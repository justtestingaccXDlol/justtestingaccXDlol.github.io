const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const MAX_BYTES_PER_USER = 256;
const MAX_SIDS = 5000;
const MAX_ACCOUNTS = 2000;
const MAX_SIDS_PER_ACCOUNT = 20;
const SID_TTL_MS = (Number(process.env.SID_TTL_SECONDS) || 3 * 24 * 3600) * 1000; // unused SIDs are deleted after 3 days
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;
const SID_RE = /^(?!__)[A-Za-z0-9_-]{3,32}$/;
const USER_RE = /^(?!__)[A-Za-z0-9_]{3,24}$/;
const BIN_RE = /^[01]{8}$/;
const COOKIE = 'session';

app.set('trust proxy', 1); // Render sits behind a proxy: needed for the real client IP

// ---------- "Database" as a JSON file ----------
fs.mkdirSync(DATA_DIR, { recursive: true });
let db = { users: {}, accounts: {}, sessions: {} }; // users = SIDs
try {
  const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  db = { users: loaded.users || {}, accounts: loaded.accounts || {}, sessions: loaded.sessions || {} };
} catch (_) { /* first boot */ }

// Migrate older data (timestamps as numbers, owner and lastUsed fields)
for (const u of Object.values(db.users)) {
  if (typeof u.created !== 'number') u.created = Date.parse(u.created) || Date.now();
  if (typeof u.lastUsed !== 'number') u.lastUsed = Date.now();
  if (u.owner === undefined) u.owner = null;
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = DB_FILE + '.tmp';
    fs.writeFile(tmp, JSON.stringify(db), (err) => {
      if (!err) fs.rename(tmp, DB_FILE, () => {});
    });
  }, 300);
}

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

// Returns the SID record, deleting it first if it expired
function getUser(sid) {
  if (!has(db.users, sid)) return null;
  const u = db.users[sid];
  if (Date.now() - u.lastUsed > SID_TTL_MS) { delete db.users[sid]; save(); return null; }
  return u;
}

function cleanup() {
  const now = Date.now();
  let changed = false;
  for (const [sid, u] of Object.entries(db.users))
    if (now - u.lastUsed > SID_TTL_MS) { delete db.users[sid]; changed = true; }
  for (const [h, s] of Object.entries(db.sessions))
    if (s.expires < now) { delete db.sessions[h]; changed = true; }
  if (changed) save();
}
cleanup();
setInterval(cleanup, 3600_000).unref();

// ---------- Utilities ----------
function rateLimit({ windowMs, max }) {
  const hits = new Map();
  setInterval(() => hits.clear(), windowMs).unref();
  return (req, res, next) => {
    const n = (hits.get(req.ip) || 0) + 1;
    hits.set(req.ip, n);
    if (n > max) return res.status(429).json({ code: 'rate_limited', error: 'Too many requests. Please try again shortly.' });
    next();
  };
}

const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'; // no look-alike characters
function availableSid(len = 10) {
  let sid;
  do {
    const b = crypto.randomBytes(len);
    sid = Array.from(b, (x) => ALPHABET[x % ALPHABET.length]).join('');
  } while (getUser(sid));
  return sid;
}

// Creates a SID (random if none requested). Returns {status, ...}
function createSid(requested, owner) {
  if (Object.keys(db.users).length >= MAX_SIDS) return { status: 503, code: 'sid_limit', error: 'SID limit reached.' };
  let sid = requested;
  if (sid !== undefined && sid !== null && sid !== '') {
    sid = String(sid);
    if (!SID_RE.test(sid)) return { status: 400, code: 'sid_invalid', error: 'Invalid SID: use 3 to 32 characters (letters, numbers, _ or -).' };
    if (getUser(sid)) return { status: 409, code: 'sid_taken', error: 'This SID is already taken. Choose another one.' };
  } else {
    sid = availableSid();
  }
  const now = Date.now();
  db.users[sid] = { created: now, lastUsed: now, owner: owner || null, bytes: ['00000000'] };
  save();
  return { status: 201, sid, value: '00000000', expiresAt: now + SID_TTL_MS };
}

// ---------- Accounts: password hashing and sessions ----------
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const hashPw = async (pw, salt) => (await scrypt(pw, salt, 64)).toString('hex');
const safeEqual = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i < 1) return;
    try { out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); } catch (_) {}
  });
  return out;
}

function startSession(req, res, username) {
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[sha(token)] = { username, expires: Date.now() + SESSION_TTL_MS };
  save();
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: req.secure, maxAge: SESSION_TTL_MS });
}

function currentSession(req) {
  const t = parseCookies(req)[COOKIE];
  if (!t) return null;
  const h = sha(t);
  if (!has(db.sessions, h)) return null;
  const s = db.sessions[h];
  if (s.expires < Date.now()) { delete db.sessions[h]; return null; }
  return { hash: h, username: s.username };
}

const requireAuth = (req, res, next) => {
  const s = currentSession(req);
  if (!s) return res.status(401).json({ code: 'not_logged_in', error: 'Not logged in.' });
  req.account = s.username;
  req.sessionHash = s.hash;
  next();
};

// ---------- Middleware ----------
// Open CORS only for the SID API (lets other sites/games use it). Account routes stay same-origin.
app.use('/data', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'SID, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  });
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '1kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => res.json({ ok: true }));

// ---------- Account routes ----------
const acct = express.Router();
const signupLimit = rateLimit({ windowMs: 3600_000, max: 10 });
const loginLimit = rateLimit({ windowMs: 15 * 60_000, max: 20 });

acct.post('/signup', signupLimit, async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || !USER_RE.test(username))
    return res.status(400).json({ code: 'username_invalid', error: 'Username: 3 to 24 characters (letters, numbers or _).' });
  if (typeof password !== 'string' || password.length < 8 || password.length > 128)
    return res.status(400).json({ code: 'password_invalid', error: 'Password: 8 to 128 characters.' });
  const key = username.toLowerCase();
  if (has(db.accounts, key)) return res.status(409).json({ code: 'username_taken', error: 'This username is already taken.' });
  if (Object.keys(db.accounts).length >= MAX_ACCOUNTS) return res.status(503).json({ code: 'account_limit', error: 'Account limit reached.' });

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await hashPw(password, salt);
  if (has(db.accounts, key)) return res.status(409).json({ code: 'username_taken', error: 'This username is already taken.' });
  db.accounts[key] = { username, salt, hash, created: Date.now() };
  startSession(req, res, username);
  res.status(201).json({ username });
});

acct.post('/login', loginLimit, async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string')
    return res.status(400).json({ code: 'creds_missing', error: 'Send a username and a password.' });
  const key = username.toLowerCase();
  const acc = has(db.accounts, key) ? db.accounts[key] : null;
  const hash = await hashPw(password.slice(0, 128), acc ? acc.salt : 'x'.repeat(32)); // same work either way
  if (!acc || !safeEqual(hash, acc.hash)) return res.status(401).json({ code: 'bad_login', error: 'Wrong username or password.' });
  startSession(req, res, acc.username);
  res.json({ username: acc.username });
});

acct.post('/logout', (req, res) => {
  const s = currentSession(req);
  if (s) { delete db.sessions[s.hash]; save(); }
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

acct.get('/me', requireAuth, (req, res) => {
  const sids = Object.entries(db.users)
    .filter(([sid]) => getUser(sid))
    .filter(([, u]) => u.owner === req.account)
    .map(([sid, u]) => ({ sid, created: u.created, lastUsed: u.lastUsed, expiresAt: u.lastUsed + SID_TTL_MS }))
    .sort((a, b) => b.created - a.created);
  res.json({ username: req.account, now: Date.now(), maxSids: MAX_SIDS_PER_ACCOUNT, ttlDays: SID_TTL_MS / 86400000, sids });
});

acct.post('/sids', requireAuth, (req, res) => {
  const owned = Object.values(db.users).filter((u) => u.owner === req.account).length;
  if (owned >= MAX_SIDS_PER_ACCOUNT)
    return res.status(403).json({ code: 'account_sid_cap', error: `You can have up to ${MAX_SIDS_PER_ACCOUNT} SIDs. Delete one first.` });
  const r = createSid(req.body && req.body.sid, req.account);
  if (r.error) return res.status(r.status).json({ code: r.code, error: r.error });
  res.status(201).json({ sid: r.sid, expiresAt: r.expiresAt });
});

acct.delete('/sids/:sid', requireAuth, (req, res) => {
  const u = SID_RE.test(req.params.sid) ? getUser(req.params.sid) : null;
  if (!u || u.owner !== req.account) return res.status(404).json({ code: 'sid_not_in_account', error: 'SID not found in your account.' });
  delete db.users[req.params.sid];
  save();
  res.json({ ok: true });
});

app.use('/account', acct);

// ---------- API /data/binary ----------
const api = express.Router();

// Register an anonymous ID (optionally choosing your own)
api.post('/register', rateLimit({ windowMs: 3_600_000, max: 20 }), (req, res) => {
  const r = createSid(req.body && req.body.sid, null);
  if (r.error) return res.status(r.status).json({ code: r.code, error: r.error });
  res.status(201).json({ sid: r.sid, value: r.value, expiresAt: r.expiresAt });
});

// Suggest a random SID that is available right now (it is only reserved if you register it)
api.get('/generate', (_req, res) => res.json({ sid: availableSid() }));

// Authentication via the SID header
api.use((req, res, next) => {
  const sid = req.get('SID');
  if (!sid) return res.status(401).json({ code: 'sid_header_missing', error: 'Send your ID in the SID header. E.g.: SID: 1234' });
  const user = SID_RE.test(sid) ? getUser(sid) : null;
  if (!user) return res.status(401).json({ code: 'sid_unknown', error: 'SID not registered (or deleted after 3 days without use).' });
  const now = Date.now();
  if (now - user.lastUsed > 60_000) { user.lastUsed = now; save(); } // using the SID resets its 3-day timer
  req.user = user;
  next();
});

function parseIndex(raw) {
  if (raw === undefined) return 0;
  if (!/^\d+$/.test(raw)) return null;
  const i = Number(raw);
  return i < MAX_BYTES_PER_USER ? i : null;
}

// Read all
api.get('/all', (req, res) => {
  res.json({ bytes: req.user.bytes.map((value, index) => ({ index, value })) });
});

// Read one byte (default: index 0)
api.get(['/', '/:index'], (req, res) => {
  const i = parseIndex(req.params.index);
  if (i === null) return res.status(400).json({ code: 'index_invalid', error: `Invalid index (0 to ${MAX_BYTES_PER_USER - 1}).` });
  if (i >= req.user.bytes.length) return res.status(404).json({ code: 'byte_unwritten', error: 'This byte has not been written yet.' });
  res.json({ value: req.user.bytes[i] });
});

// Write one byte (POST or PUT)
function write(req, res) {
  const i = parseIndex(req.params.index);
  if (i === null) return res.status(400).json({ code: 'index_invalid', error: `Invalid index (0 to ${MAX_BYTES_PER_USER - 1}).` });
  const value = req.body && req.body.value;
  if (typeof value !== 'string' || !BIN_RE.test(value))
    return res.status(400).json({ code: 'body_invalid', error: 'Invalid body. Send {"value":"01010101"} with exactly 8 bits.' });
  while (req.user.bytes.length <= i) req.user.bytes.push('00000000');
  req.user.bytes[i] = value;
  save();
  res.json({ value });
}
api.post(['/', '/:index'], write);
api.put(['/', '/:index'], write);

app.use('/data/binary', api);

app.use((req, res) => {
  if (req.path.startsWith('/data/') || req.path.startsWith('/account/'))
    return res.status(404).json({ code: 'route_not_found', error: 'Route not found.' });
  res.status(404).send('Page not found. <a href="/">Go back</a>');
});
app.use((err, _req, res, _next) => {
  res.status(400).json({ code: 'bad_request', error: 'Invalid request (malformed JSON?).' });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
