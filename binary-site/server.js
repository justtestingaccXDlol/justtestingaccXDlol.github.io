const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const MAX_BYTES_PER_USER = 256;
const MAX_USERS = 5000;
const SID_RE = /^[A-Za-z0-9_-]{3,32}$/;
const BIN_RE = /^[01]{8}$/;

app.set('trust proxy', 1); // Render fica atrás de proxy: necessário p/ IP real

// ---------- "Banco" em arquivo JSON ----------
fs.mkdirSync(DATA_DIR, { recursive: true });
let db = { users: {} };
try {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!db.users) db.users = {};
} catch (_) { /* primeiro boot */ }

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
const hasUser = (sid) => Object.prototype.hasOwnProperty.call(db.users, sid);

// ---------- Utilidades ----------
function rateLimit({ windowMs, max }) {
  const hits = new Map();
  setInterval(() => hits.clear(), windowMs).unref();
  return (req, res, next) => {
    const n = (hits.get(req.ip) || 0) + 1;
    hits.set(req.ip, n);
    if (n > max) return res.status(429).json({ error: 'Muitas requisições. Tente de novo em instantes.' });
    next();
  };
}

// CORS aberto (permite usar a API de outros sites/jogos) + header SID liberado
app.use((req, res, next) => {
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

// ---------- API /data/binary ----------
const api = express.Router();

// Registrar um ID (opcionalmente escolhendo o seu)
api.post('/register', rateLimit({ windowMs: 3_600_000, max: 20 }), (req, res) => {
  if (Object.keys(db.users).length >= MAX_USERS)
    return res.status(503).json({ error: 'Limite de usuários atingido.' });

  let sid = req.body && req.body.sid;
  if (sid !== undefined) {
    sid = String(sid);
    if (!SID_RE.test(sid))
      return res.status(400).json({ error: 'SID inválido: use 3 a 32 caracteres (letras, números, _ ou -).' });
    if (hasUser(sid))
      return res.status(409).json({ error: 'Esse SID já está em uso. Escolha outro.' });
  } else {
    do { sid = crypto.randomBytes(8).toString('hex'); } while (hasUser(sid));
  }

  db.users[sid] = { created: new Date().toISOString(), bytes: ['00000000'] };
  save();
  res.status(201).json({ sid, value: '00000000' });
});

// Autenticação pelo header SID
api.use((req, res, next) => {
  const sid = req.get('SID');
  if (!sid) return res.status(401).json({ error: 'Envie seu ID no header SID. Ex.: SID: 1234' });
  if (!SID_RE.test(sid) || !hasUser(sid)) return res.status(401).json({ error: 'SID não registrado.' });
  req.user = db.users[sid];
  next();
});

function parseIndex(raw) {
  if (raw === undefined) return 0;
  if (!/^\d+$/.test(raw)) return null;
  const i = Number(raw);
  return i < MAX_BYTES_PER_USER ? i : null;
}

// Ler todos
api.get('/all', (req, res) => {
  res.json({ bytes: req.user.bytes.map((value, index) => ({ index, value })) });
});

// Ler um byte (padrão: índice 0)
api.get(['/', '/:index'], (req, res) => {
  const i = parseIndex(req.params.index);
  if (i === null) return res.status(400).json({ error: `Índice inválido (0 a ${MAX_BYTES_PER_USER - 1}).` });
  if (i >= req.user.bytes.length) return res.status(404).json({ error: 'Esse byte ainda não foi escrito.' });
  res.json({ value: req.user.bytes[i] });
});

// Escrever um byte (POST ou PUT)
function write(req, res) {
  const i = parseIndex(req.params.index);
  if (i === null) return res.status(400).json({ error: `Índice inválido (0 a ${MAX_BYTES_PER_USER - 1}).` });
  const value = req.body && req.body.value;
  if (typeof value !== 'string' || !BIN_RE.test(value))
    return res.status(400).json({ error: 'Corpo inválido. Envie {"value":"01010101"} com exatamente 8 bits.' });
  while (req.user.bytes.length <= i) req.user.bytes.push('00000000');
  req.user.bytes[i] = value;
  save();
  res.json({ value });
}
api.post(['/', '/:index'], write);
api.put(['/', '/:index'], write);

app.use('/data/binary', api);

app.use((req, res) => {
  if (req.path.startsWith('/data/')) return res.status(404).json({ error: 'Rota não encontrada.' });
  res.status(404).send('Página não encontrada. <a href="/">Voltar</a>');
});
app.use((err, _req, res, _next) => {
  res.status(400).json({ error: 'Requisição inválida (JSON malformado?).' });
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
