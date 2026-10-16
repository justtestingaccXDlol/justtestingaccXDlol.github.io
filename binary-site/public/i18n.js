(function () {
  const LANGS = { pt: 'Português', en: 'English', ru: 'Русский', fr: 'Français', es: 'Español' };

  const D = {
    en: {
      'nav.home': `← Home`,
      'title.index': `Binary Site`, 'title.playground': `Playground · Binary Site`, 'title.docs': `Docs · Binary Site`, 'title.account': `My SIDs · Binary Site`,
      'idx.sub': `Store and read 8-bit bytes over the web, each one tied to your own ID.`,
      'idx.account.h': `👤 My SIDs`, 'idx.account.p': `Create an account and manage all your SIDs in one place.`,
      'idx.play.h': `🎮 Playground`, 'idx.play.p': `Register your ID, flip the bits and try the API right in your browser.`,
      'idx.docs.h': `📖 Documentation`, 'idx.docs.p': `How to use the API with curl, JavaScript or Roblox.`,
      'idx.api.p': `The API endpoint (requires the <code>SID</code> header).`,
      'idx.status.h': `💚 Status`, 'idx.status.p': `Check that the server is up.`,
      'pg.h1': `🎮 Playground`, 'pg.step1': `1. Your ID (SID)`, 'pg.sid.ph': `e.g. my_id_123`, 'pg.register': `Register`, 'pg.random': `🎲 Random`,
      'pg.help': `"Random" fills in an available ID for you. Leave it empty when registering to get one automatically. Anyone who knows your ID can read and write your bytes, and IDs unused for 3 days are deleted. Want to keep track of your IDs? <a href="/account.html">Create an account</a>.`,
      'pg.step2': `2. Your byte`, 'pg.index': `Index (0–255):`, 'pg.value': `Value:`, 'pg.read': `Read`, 'pg.write': `Write`, 'pg.readall': `Read all`,
      'pg.response': `Response`, 'pg.log.init': `Nothing yet. Register an ID to get started.`, 'pg.neterr': `Network error: {msg}`,
      'ac.h1': `👤 My SIDs`, 'ac.sub': `Create an account to see and manage all the SIDs you created.`,
      'ac.guest.h': `Log in or create an account`, 'ac.user.ph': `Username`, 'ac.pass.ph': `Password (min. 8)`, 'ac.login': `Log in`, 'ac.signup': `Create account`,
      'ac.guest.help': `Usernames: 3–24 letters, numbers or _. Don't reuse an important password: this is a small hobby project.`,
      'ac.hi': `Hi, {name} 👋`, 'ac.logout': `Log out`,
      'ac.create.h': `Create a SID`, 'ac.newsid.ph': `Choose your own, e.g. my_id_123`, 'ac.create': `Create`, 'ac.suggest': `🎲 Suggest a random one`, 'ac.useit': `Use this one`, 'ac.another': `Another`,
      'ac.create.help': `Every SID is unique: two people can never share one. A suggested SID is only reserved when you click "Use this one".`,
      'ac.list.h': `Your SIDs`, 'ac.th.sid': `SID`, 'ac.th.created': `Created`, 'ac.th.last': `Last used`, 'ac.th.exp': `Expires in`,
      'ac.empty': `No SIDs yet. Create one above.`,
      'ac.list.help': `A SID that isn't used for {n} days is deleted automatically. Any read or write with it resets the timer.`,
      'ac.copy': `Copy`, 'ac.copied': `Copied!`, 'ac.delete': `Delete`, 'ac.confirm': `Delete SID "{sid}" and all its bytes? This cannot be undone.`, 'ac.created': `Created: {sid}`,
      'ago.now': `just now`, 'ago.min': `{n} min ago`, 'ago.h': `{n} h ago`, 'ago.d': `{n} d ago`,
      'left.expired': `expired`, 'left.dh': `{d}d {h}h`, 'left.h': `{h}h`, 'left.min': `{m} min`,
      'dc.h1': `📖 Documentation`, 'dc.sub': `Each user has a <code>SID</code> and a list of bytes (up to 256). The SID always goes in the request header.`,
      'dc.endpoints': `Endpoints`, 'dc.th.method': `Method`, 'dc.th.route': `Route`, 'dc.th.what': `What it does`,
      'dc.r.register': `Registers an ID. Optional body: <code>{"sid":"my_id"}</code>`,
      'dc.r.generate': `Suggests a random SID that is available right now (not reserved until you register it)`,
      'dc.r.read0': `Reads byte 0 → <code>{"value":"00000000"}</code>`, 'dc.r.readidx': `Reads the byte at the given index (0–255)`,
      'dc.r.readall': `Reads all your bytes`, 'dc.r.write': `Writes <code>{"value":"10101010"}</code> (exactly 8 bits)`,
      'dc.exp.h': `Expiry and accounts`,
      'dc.exp.p1': `A SID that isn't read or written for <strong>3 days</strong> is deleted along with its bytes. Every request that uses the SID resets the timer. Every SID is unique, so two users can never share one.`,
      'dc.exp.p2': `Registering through the API creates an anonymous SID. To see and manage all your SIDs, <a href="/account.html">create an account</a> and create them there.`,
      'dc.errors.h': `Common errors`, 'dc.e401': `Missing SID header, or SID not registered / expired`, 'dc.e400': `Value is not exactly 8 characters of 0/1, or invalid index`,
      'dc.e404': `That index has not been written yet`, 'dc.e409': `SID already taken when registering`, 'dc.e429': `Too many requests (per-IP limit)`,
      'err.rate_limited': `Too many requests. Please try again shortly.`, 'err.sid_limit': `SID limit reached.`,
      'err.sid_invalid': `Invalid SID: use 3 to 32 characters (letters, numbers, _ or -).`, 'err.sid_taken': `This SID is already taken. Choose another one.`,
      'err.username_invalid': `Username: 3 to 24 characters (letters, numbers or _).`, 'err.password_invalid': `Password: 8 to 128 characters.`,
      'err.username_taken': `This username is already taken.`, 'err.account_limit': `Account limit reached.`,
      'err.creds_missing': `Send a username and a password.`, 'err.bad_login': `Wrong username or password.`, 'err.not_logged_in': `Not logged in.`,
      'err.account_sid_cap': `You can have up to 20 SIDs. Delete one first.`, 'err.sid_not_in_account': `SID not found in your account.`,
      'err.sid_header_missing': `Send your ID in the SID header. E.g.: SID: 1234`, 'err.sid_unknown': `SID not registered (or deleted after 3 days without use).`,
      'err.index_invalid': `Invalid index (0 to 255).`, 'err.byte_unwritten': `This byte has not been written yet.`,
      'err.body_invalid': `Invalid body. Send {"value":"01010101"} with exactly 8 bits.`, 'err.route_not_found': `Route not found.`,
      'err.bad_request': `Invalid request (malformed JSON?).`, 'err.generic': `Something went wrong.`
    },
    pt: {
      'nav.home': `← Início`,
      'title.index': `Binary Site`, 'title.playground': `Playground · Binary Site`, 'title.docs': `Documentação · Binary Site`, 'title.account': `Meus SIDs · Binary Site`,
      'idx.sub': `Guarde e leia bytes de 8 bits pela web, cada um ligado ao seu próprio ID.`,
      'idx.account.h': `👤 Meus SIDs`, 'idx.account.p': `Crie uma conta e gerencie todos os seus SIDs em um só lugar.`,
      'idx.play.h': `🎮 Playground`, 'idx.play.p': `Registre seu ID, ligue os bits e teste a API direto no navegador.`,
      'idx.docs.h': `📖 Documentação`, 'idx.docs.p': `Como usar a API com curl, JavaScript ou Roblox.`,
      'idx.api.p': `O endpoint da API (exige o header <code>SID</code>).`,
      'idx.status.h': `💚 Status`, 'idx.status.p': `Confira se o servidor está no ar.`,
      'pg.h1': `🎮 Playground`, 'pg.step1': `1. Seu ID (SID)`, 'pg.sid.ph': `ex.: meu_id_123`, 'pg.register': `Registrar`, 'pg.random': `🎲 Aleatório`,
      'pg.help': `"Aleatório" preenche um ID disponível para você. Deixe em branco ao registrar para gerar um automaticamente. Quem souber seu ID pode ler e escrever nos seus bytes, e IDs sem uso por 3 dias são apagados. Quer acompanhar seus IDs? <a href="/account.html">Crie uma conta</a>.`,
      'pg.step2': `2. Seu byte`, 'pg.index': `Índice (0–255):`, 'pg.value': `Valor:`, 'pg.read': `Ler`, 'pg.write': `Escrever`, 'pg.readall': `Ler todos`,
      'pg.response': `Resposta`, 'pg.log.init': `Nada ainda. Registre um ID para começar.`, 'pg.neterr': `Erro de rede: {msg}`,
      'ac.h1': `👤 Meus SIDs`, 'ac.sub': `Crie uma conta para ver e gerenciar todos os SIDs que você criou.`,
      'ac.guest.h': `Entrar ou criar uma conta`, 'ac.user.ph': `Nome de usuário`, 'ac.pass.ph': `Senha (mín. 8)`, 'ac.login': `Entrar`, 'ac.signup': `Criar conta`,
      'ac.guest.help': `Usuários: 3–24 letras, números ou _. Não reutilize uma senha importante: este é um pequeno projeto de hobby.`,
      'ac.hi': `Olá, {name} 👋`, 'ac.logout': `Sair`,
      'ac.create.h': `Criar um SID`, 'ac.newsid.ph': `Escolha o seu, ex.: meu_id_123`, 'ac.create': `Criar`, 'ac.suggest': `🎲 Sugerir um aleatório`, 'ac.useit': `Usar este`, 'ac.another': `Outro`,
      'ac.create.help': `Todo SID é único: duas pessoas nunca podem compartilhar o mesmo. Um SID sugerido só é reservado quando você clica em "Usar este".`,
      'ac.list.h': `Seus SIDs`, 'ac.th.sid': `SID`, 'ac.th.created': `Criado`, 'ac.th.last': `Último uso`, 'ac.th.exp': `Expira em`,
      'ac.empty': `Nenhum SID ainda. Crie um acima.`,
      'ac.list.help': `Um SID que não é usado por {n} dias é apagado automaticamente. Qualquer leitura ou escrita com ele reinicia o contador.`,
      'ac.copy': `Copiar`, 'ac.copied': `Copiado!`, 'ac.delete': `Apagar`, 'ac.confirm': `Apagar o SID "{sid}" e todos os seus bytes? Isso não pode ser desfeito.`, 'ac.created': `Criado: {sid}`,
      'ago.now': `agora mesmo`, 'ago.min': `há {n} min`, 'ago.h': `há {n} h`, 'ago.d': `há {n} d`,
      'left.expired': `expirado`, 'left.dh': `{d}d {h}h`, 'left.h': `{h}h`, 'left.min': `{m} min`,
      'dc.h1': `📖 Documentação`, 'dc.sub': `Cada usuário tem um <code>SID</code> e uma lista de bytes (até 256). O SID sempre vai no header da requisição.`,
      'dc.endpoints': `Endpoints`, 'dc.th.method': `Método`, 'dc.th.route': `Rota`, 'dc.th.what': `O que faz`,
      'dc.r.register': `Registra um ID. Corpo opcional: <code>{"sid":"meu_id"}</code>`,
      'dc.r.generate': `Sugere um SID aleatório disponível agora (não fica reservado até você registrá-lo)`,
      'dc.r.read0': `Lê o byte 0 → <code>{"value":"00000000"}</code>`, 'dc.r.readidx': `Lê o byte do índice informado (0–255)`,
      'dc.r.readall': `Lê todos os seus bytes`, 'dc.r.write': `Escreve <code>{"value":"10101010"}</code> (exatamente 8 bits)`,
      'dc.exp.h': `Expiração e contas`,
      'dc.exp.p1': `Um SID que não é lido nem escrito por <strong>3 dias</strong> é apagado junto com seus bytes. Toda requisição que usa o SID reinicia o contador. Todo SID é único, então dois usuários nunca podem compartilhar o mesmo.`,
      'dc.exp.p2': `Registrar pela API cria um SID anônimo. Para ver e gerenciar todos os seus SIDs, <a href="/account.html">crie uma conta</a> e crie-os por lá.`,
      'dc.errors.h': `Erros comuns`, 'dc.e401': `Header SID ausente, ou SID não registrado / expirado`, 'dc.e400': `O valor não tem exatamente 8 caracteres 0/1, ou índice inválido`,
      'dc.e404': `Esse índice ainda não foi escrito`, 'dc.e409': `SID já em uso ao registrar`, 'dc.e429': `Muitas requisições (limite por IP)`,
      'err.rate_limited': `Muitas requisições. Tente de novo em instantes.`, 'err.sid_limit': `Limite de SIDs atingido.`,
      'err.sid_invalid': `SID inválido: use de 3 a 32 caracteres (letras, números, _ ou -).`, 'err.sid_taken': `Esse SID já está em uso. Escolha outro.`,
      'err.username_invalid': `Usuário: 3 a 24 caracteres (letras, números ou _).`, 'err.password_invalid': `Senha: 8 a 128 caracteres.`,
      'err.username_taken': `Esse nome de usuário já está em uso.`, 'err.account_limit': `Limite de contas atingido.`,
      'err.creds_missing': `Envie um nome de usuário e uma senha.`, 'err.bad_login': `Usuário ou senha incorretos.`, 'err.not_logged_in': `Você não está logado.`,
      'err.account_sid_cap': `Você pode ter até 20 SIDs. Apague um primeiro.`, 'err.sid_not_in_account': `SID não encontrado na sua conta.`,
      'err.sid_header_missing': `Envie seu ID no header SID. Ex.: SID: 1234`, 'err.sid_unknown': `SID não registrado (ou apagado após 3 dias sem uso).`,
      'err.index_invalid': `Índice inválido (0 a 255).`, 'err.byte_unwritten': `Esse byte ainda não foi escrito.`,
      'err.body_invalid': `Corpo inválido. Envie {"value":"01010101"} com exatamente 8 bits.`, 'err.route_not_found': `Rota não encontrada.`,
      'err.bad_request': `Requisição inválida (JSON malformado?).`, 'err.generic': `Algo deu errado.`
    },
    ru: {
      'nav.home': `← На главную`,
      'title.index': `Binary Site`, 'title.playground': `Песочница · Binary Site`, 'title.docs': `Документация · Binary Site`, 'title.account': `Мои SID · Binary Site`,
      'idx.sub': `Храните и читайте 8-битные байты через веб, каждый привязан к вашему личному ID.`,
      'idx.account.h': `👤 Мои SID`, 'idx.account.p': `Создайте аккаунт и управляйте всеми своими SID в одном месте.`,
      'idx.play.h': `🎮 Песочница`, 'idx.play.p': `Зарегистрируйте ID, переключайте биты и пробуйте API прямо в браузере.`,
      'idx.docs.h': `📖 Документация`, 'idx.docs.p': `Как использовать API с curl, JavaScript или Roblox.`,
      'idx.api.p': `Эндпоинт API (требуется заголовок <code>SID</code>).`,
      'idx.status.h': `💚 Статус`, 'idx.status.p': `Проверьте, работает ли сервер.`,
      'pg.h1': `🎮 Песочница`, 'pg.step1': `1. Ваш ID (SID)`, 'pg.sid.ph': `напр.: my_id_123`, 'pg.register': `Зарегистрировать`, 'pg.random': `🎲 Случайный`,
      'pg.help': `«Случайный» подставит свободный ID. Оставьте поле пустым при регистрации, чтобы получить ID автоматически. Любой, кто знает ваш ID, может читать и записывать ваши байты, а ID, которые не использовались 3 дня, удаляются. Хотите следить за своими ID? <a href="/account.html">Создайте аккаунт</a>.`,
      'pg.step2': `2. Ваш байт`, 'pg.index': `Индекс (0–255):`, 'pg.value': `Значение:`, 'pg.read': `Прочитать`, 'pg.write': `Записать`, 'pg.readall': `Прочитать все`,
      'pg.response': `Ответ`, 'pg.log.init': `Пока ничего. Зарегистрируйте ID, чтобы начать.`, 'pg.neterr': `Ошибка сети: {msg}`,
      'ac.h1': `👤 Мои SID`, 'ac.sub': `Создайте аккаунт, чтобы видеть и управлять всеми созданными вами SID.`,
      'ac.guest.h': `Войдите или создайте аккаунт`, 'ac.user.ph': `Имя пользователя`, 'ac.pass.ph': `Пароль (мин. 8)`, 'ac.login': `Войти`, 'ac.signup': `Создать аккаунт`,
      'ac.guest.help': `Имя пользователя: 3–24 буквы, цифры или _. Не используйте важный пароль повторно: это небольшой хобби-проект.`,
      'ac.hi': `Привет, {name} 👋`, 'ac.logout': `Выйти`,
      'ac.create.h': `Создать SID`, 'ac.newsid.ph': `Придумайте свой, напр.: my_id_123`, 'ac.create': `Создать`, 'ac.suggest': `🎲 Предложить случайный`, 'ac.useit': `Взять этот`, 'ac.another': `Другой`,
      'ac.create.help': `Каждый SID уникален: два человека не могут использовать один и тот же. Предложенный SID резервируется только после нажатия «Взять этот».`,
      'ac.list.h': `Ваши SID`, 'ac.th.sid': `SID`, 'ac.th.created': `Создан`, 'ac.th.last': `Последнее использование`, 'ac.th.exp': `Истекает через`,
      'ac.empty': `SID пока нет. Создайте его выше.`,
      'ac.list.help': `SID, который не использовался {n} дн., удаляется автоматически. Любое чтение или запись с ним сбрасывает таймер.`,
      'ac.copy': `Копировать`, 'ac.copied': `Скопировано!`, 'ac.delete': `Удалить`, 'ac.confirm': `Удалить SID «{sid}» и все его байты? Это нельзя отменить.`, 'ac.created': `Создан: {sid}`,
      'ago.now': `только что`, 'ago.min': `{n} мин назад`, 'ago.h': `{n} ч назад`, 'ago.d': `{n} дн. назад`,
      'left.expired': `истёк`, 'left.dh': `{d}д {h}ч`, 'left.h': `{h}ч`, 'left.min': `{m} мин`,
      'dc.h1': `📖 Документация`, 'dc.sub': `У каждого пользователя есть <code>SID</code> и список байтов (до 256). SID всегда передаётся в заголовке запроса.`,
      'dc.endpoints': `Эндпоинты`, 'dc.th.method': `Метод`, 'dc.th.route': `Путь`, 'dc.th.what': `Что делает`,
      'dc.r.register': `Регистрирует ID. Необязательное тело: <code>{"sid":"my_id"}</code>`,
      'dc.r.generate': `Предлагает случайный SID, свободный прямо сейчас (не резервируется, пока вы его не зарегистрируете)`,
      'dc.r.read0': `Читает байт 0 → <code>{"value":"00000000"}</code>`, 'dc.r.readidx': `Читает байт с указанным индексом (0–255)`,
      'dc.r.readall': `Читает все ваши байты`, 'dc.r.write': `Записывает <code>{"value":"10101010"}</code> (ровно 8 бит)`,
      'dc.exp.h': `Срок действия и аккаунты`,
      'dc.exp.p1': `SID, который не читали и не записывали <strong>3 дня</strong>, удаляется вместе со своими байтами. Каждый запрос с этим SID сбрасывает таймер. Каждый SID уникален, поэтому два пользователя никогда не смогут использовать один и тот же.`,
      'dc.exp.p2': `Регистрация через API создаёт анонимный SID. Чтобы видеть и управлять всеми своими SID, <a href="/account.html">создайте аккаунт</a> и создавайте их там.`,
      'dc.errors.h': `Частые ошибки`, 'dc.e401': `Нет заголовка SID, либо SID не зарегистрирован / истёк`, 'dc.e400': `Значение — не ровно 8 символов 0/1, либо неверный индекс`,
      'dc.e404': `Этот индекс ещё не записан`, 'dc.e409': `SID уже занят при регистрации`, 'dc.e429': `Слишком много запросов (лимит на IP)`,
      'err.rate_limited': `Слишком много запросов. Попробуйте чуть позже.`, 'err.sid_limit': `Достигнут лимит SID.`,
      'err.sid_invalid': `Недопустимый SID: от 3 до 32 символов (буквы, цифры, _ или -).`, 'err.sid_taken': `Этот SID уже занят. Выберите другой.`,
      'err.username_invalid': `Имя пользователя: от 3 до 24 символов (буквы, цифры или _).`, 'err.password_invalid': `Пароль: от 8 до 128 символов.`,
      'err.username_taken': `Это имя пользователя уже занято.`, 'err.account_limit': `Достигнут лимит аккаунтов.`,
      'err.creds_missing': `Укажите имя пользователя и пароль.`, 'err.bad_login': `Неверное имя пользователя или пароль.`, 'err.not_logged_in': `Вы не вошли в аккаунт.`,
      'err.account_sid_cap': `У вас может быть не более 20 SID. Сначала удалите один.`, 'err.sid_not_in_account': `SID не найден в вашем аккаунте.`,
      'err.sid_header_missing': `Передайте ваш ID в заголовке SID. Напр.: SID: 1234`, 'err.sid_unknown': `SID не зарегистрирован (или удалён после 3 дней без использования).`,
      'err.index_invalid': `Недопустимый индекс (от 0 до 255).`, 'err.byte_unwritten': `Этот байт ещё не записан.`,
      'err.body_invalid': `Недопустимое тело запроса. Отправьте {"value":"01010101"} ровно из 8 бит.`, 'err.route_not_found': `Маршрут не найден.`,
      'err.bad_request': `Недопустимый запрос (некорректный JSON?).`, 'err.generic': `Что-то пошло не так.`
    },
    fr: {
      'nav.home': `← Accueil`,
      'title.index': `Binary Site`, 'title.playground': `Bac à sable · Binary Site`, 'title.docs': `Documentation · Binary Site`, 'title.account': `Mes SID · Binary Site`,
      'idx.sub': `Stockez et lisez des octets de 8 bits sur le web, chacun lié à votre propre ID.`,
      'idx.account.h': `👤 Mes SID`, 'idx.account.p': `Créez un compte et gérez tous vos SID au même endroit.`,
      'idx.play.h': `🎮 Bac à sable`, 'idx.play.p': `Enregistrez votre ID, basculez les bits et testez l’API directement dans votre navigateur.`,
      'idx.docs.h': `📖 Documentation`, 'idx.docs.p': `Comment utiliser l’API avec curl, JavaScript ou Roblox.`,
      'idx.api.p': `Le point d’accès de l’API (nécessite l’en-tête <code>SID</code>).`,
      'idx.status.h': `💚 État`, 'idx.status.p': `Vérifiez que le serveur est en ligne.`,
      'pg.h1': `🎮 Bac à sable`, 'pg.step1': `1. Votre ID (SID)`, 'pg.sid.ph': `ex. : mon_id_123`, 'pg.register': `Enregistrer`, 'pg.random': `🎲 Aléatoire`,
      'pg.help': `« Aléatoire » remplit un ID disponible pour vous. Laissez le champ vide à l’enregistrement pour en obtenir un automatiquement. Toute personne connaissant votre ID peut lire et écrire vos octets, et les ID inutilisés pendant 3 jours sont supprimés. Envie de suivre vos ID ? <a href="/account.html">Créez un compte</a>.`,
      'pg.step2': `2. Votre octet`, 'pg.index': `Index (0–255) :`, 'pg.value': `Valeur :`, 'pg.read': `Lire`, 'pg.write': `Écrire`, 'pg.readall': `Tout lire`,
      'pg.response': `Réponse`, 'pg.log.init': `Rien pour l’instant. Enregistrez un ID pour commencer.`, 'pg.neterr': `Erreur réseau : {msg}`,
      'ac.h1': `👤 Mes SID`, 'ac.sub': `Créez un compte pour voir et gérer tous les SID que vous avez créés.`,
      'ac.guest.h': `Connectez-vous ou créez un compte`, 'ac.user.ph': `Nom d’utilisateur`, 'ac.pass.ph': `Mot de passe (8 min.)`, 'ac.login': `Se connecter`, 'ac.signup': `Créer un compte`,
      'ac.guest.help': `Noms d’utilisateur : 3 à 24 lettres, chiffres ou _. Ne réutilisez pas un mot de passe important : c’est un petit projet amateur.`,
      'ac.hi': `Salut, {name} 👋`, 'ac.logout': `Se déconnecter`,
      'ac.create.h': `Créer un SID`, 'ac.newsid.ph': `Choisissez le vôtre, ex. : mon_id_123`, 'ac.create': `Créer`, 'ac.suggest': `🎲 Suggérer un SID aléatoire`, 'ac.useit': `Utiliser celui-ci`, 'ac.another': `Un autre`,
      'ac.create.help': `Chaque SID est unique : deux personnes ne peuvent jamais en partager un. Un SID suggéré n’est réservé que lorsque vous cliquez sur « Utiliser celui-ci ».`,
      'ac.list.h': `Vos SID`, 'ac.th.sid': `SID`, 'ac.th.created': `Créé`, 'ac.th.last': `Dernière utilisation`, 'ac.th.exp': `Expire dans`,
      'ac.empty': `Aucun SID pour l’instant. Créez-en un ci-dessus.`,
      'ac.list.help': `Un SID inutilisé pendant {n} jours est supprimé automatiquement. Toute lecture ou écriture avec lui réinitialise le minuteur.`,
      'ac.copy': `Copier`, 'ac.copied': `Copié !`, 'ac.delete': `Supprimer`, 'ac.confirm': `Supprimer le SID « {sid} » et tous ses octets ? Cette action est irréversible.`, 'ac.created': `Créé : {sid}`,
      'ago.now': `à l’instant`, 'ago.min': `il y a {n} min`, 'ago.h': `il y a {n} h`, 'ago.d': `il y a {n} j`,
      'left.expired': `expiré`, 'left.dh': `{d}j {h}h`, 'left.h': `{h}h`, 'left.min': `{m} min`,
      'dc.h1': `📖 Documentation`, 'dc.sub': `Chaque utilisateur a un <code>SID</code> et une liste d’octets (jusqu’à 256). Le SID est toujours placé dans l’en-tête de la requête.`,
      'dc.endpoints': `Points d’accès`, 'dc.th.method': `Méthode`, 'dc.th.route': `Route`, 'dc.th.what': `Ce que ça fait`,
      'dc.r.register': `Enregistre un ID. Corps facultatif : <code>{"sid":"mon_id"}</code>`,
      'dc.r.generate': `Suggère un SID aléatoire disponible à l’instant (non réservé tant que vous ne l’enregistrez pas)`,
      'dc.r.read0': `Lit l’octet 0 → <code>{"value":"00000000"}</code>`, 'dc.r.readidx': `Lit l’octet à l’index donné (0–255)`,
      'dc.r.readall': `Lit tous vos octets`, 'dc.r.write': `Écrit <code>{"value":"10101010"}</code> (exactement 8 bits)`,
      'dc.exp.h': `Expiration et comptes`,
      'dc.exp.p1': `Un SID ni lu ni écrit pendant <strong>3 jours</strong> est supprimé avec ses octets. Chaque requête utilisant le SID réinitialise le minuteur. Chaque SID est unique : deux utilisateurs ne peuvent jamais en partager un.`,
      'dc.exp.p2': `S’enregistrer via l’API crée un SID anonyme. Pour voir et gérer tous vos SID, <a href="/account.html">créez un compte</a> et créez-les depuis là.`,
      'dc.errors.h': `Erreurs courantes`, 'dc.e401': `En-tête SID manquant, ou SID non enregistré / expiré`, 'dc.e400': `La valeur n’est pas exactement 8 caractères 0/1, ou index invalide`,
      'dc.e404': `Cet index n’a pas encore été écrit`, 'dc.e409': `SID déjà pris lors de l’enregistrement`, 'dc.e429': `Trop de requêtes (limite par IP)`,
      'err.rate_limited': `Trop de requêtes. Réessayez dans un instant.`, 'err.sid_limit': `Limite de SID atteinte.`,
      'err.sid_invalid': `SID invalide : 3 à 32 caractères (lettres, chiffres, _ ou -).`, 'err.sid_taken': `Ce SID est déjà pris. Choisissez-en un autre.`,
      'err.username_invalid': `Nom d’utilisateur : 3 à 24 caractères (lettres, chiffres ou _).`, 'err.password_invalid': `Mot de passe : 8 à 128 caractères.`,
      'err.username_taken': `Ce nom d’utilisateur est déjà pris.`, 'err.account_limit': `Limite de comptes atteinte.`,
      'err.creds_missing': `Envoyez un nom d’utilisateur et un mot de passe.`, 'err.bad_login': `Nom d’utilisateur ou mot de passe incorrect.`, 'err.not_logged_in': `Vous n’êtes pas connecté.`,
      'err.account_sid_cap': `Vous pouvez avoir jusqu’à 20 SID. Supprimez-en un d’abord.`, 'err.sid_not_in_account': `SID introuvable dans votre compte.`,
      'err.sid_header_missing': `Envoyez votre ID dans l’en-tête SID. Ex. : SID: 1234`, 'err.sid_unknown': `SID non enregistré (ou supprimé après 3 jours sans utilisation).`,
      'err.index_invalid': `Index invalide (0 à 255).`, 'err.byte_unwritten': `Cet octet n’a pas encore été écrit.`,
      'err.body_invalid': `Corps invalide. Envoyez {"value":"01010101"} avec exactement 8 bits.`, 'err.route_not_found': `Route introuvable.`,
      'err.bad_request': `Requête invalide (JSON mal formé ?).`, 'err.generic': `Une erreur est survenue.`
    },
    es: {
      'nav.home': `← Inicio`,
      'title.index': `Binary Site`, 'title.playground': `Zona de pruebas · Binary Site`, 'title.docs': `Documentación · Binary Site`, 'title.account': `Mis SID · Binary Site`,
      'idx.sub': `Guarda y lee bytes de 8 bits por la web, cada uno ligado a tu propio ID.`,
      'idx.account.h': `👤 Mis SID`, 'idx.account.p': `Crea una cuenta y gestiona todos tus SID en un solo lugar.`,
      'idx.play.h': `🎮 Zona de pruebas`, 'idx.play.p': `Registra tu ID, activa los bits y prueba la API directamente en tu navegador.`,
      'idx.docs.h': `📖 Documentación`, 'idx.docs.p': `Cómo usar la API con curl, JavaScript o Roblox.`,
      'idx.api.p': `El endpoint de la API (requiere el header <code>SID</code>).`,
      'idx.status.h': `💚 Estado`, 'idx.status.p': `Comprueba que el servidor está en línea.`,
      'pg.h1': `🎮 Zona de pruebas`, 'pg.step1': `1. Tu ID (SID)`, 'pg.sid.ph': `ej.: mi_id_123`, 'pg.register': `Registrar`, 'pg.random': `🎲 Aleatorio`,
      'pg.help': `«Aleatorio» rellena un ID disponible por ti. Déjalo vacío al registrar para obtener uno automáticamente. Cualquiera que conozca tu ID puede leer y escribir tus bytes, y los ID sin uso durante 3 días se eliminan. ¿Quieres llevar el control de tus ID? <a href="/account.html">Crea una cuenta</a>.`,
      'pg.step2': `2. Tu byte`, 'pg.index': `Índice (0–255):`, 'pg.value': `Valor:`, 'pg.read': `Leer`, 'pg.write': `Escribir`, 'pg.readall': `Leer todos`,
      'pg.response': `Respuesta`, 'pg.log.init': `Nada todavía. Registra un ID para empezar.`, 'pg.neterr': `Error de red: {msg}`,
      'ac.h1': `👤 Mis SID`, 'ac.sub': `Crea una cuenta para ver y gestionar todos los SID que has creado.`,
      'ac.guest.h': `Inicia sesión o crea una cuenta`, 'ac.user.ph': `Nombre de usuario`, 'ac.pass.ph': `Contraseña (mín. 8)`, 'ac.login': `Iniciar sesión`, 'ac.signup': `Crear cuenta`,
      'ac.guest.help': `Usuarios: 3–24 letras, números o _. No reutilices una contraseña importante: es un pequeño proyecto de hobby.`,
      'ac.hi': `Hola, {name} 👋`, 'ac.logout': `Cerrar sesión`,
      'ac.create.h': `Crear un SID`, 'ac.newsid.ph': `Elige el tuyo, ej.: mi_id_123`, 'ac.create': `Crear`, 'ac.suggest': `🎲 Sugerir uno aleatorio`, 'ac.useit': `Usar este`, 'ac.another': `Otro`,
      'ac.create.help': `Cada SID es único: dos personas nunca pueden compartir uno. Un SID sugerido solo se reserva cuando haces clic en «Usar este».`,
      'ac.list.h': `Tus SID`, 'ac.th.sid': `SID`, 'ac.th.created': `Creado`, 'ac.th.last': `Último uso`, 'ac.th.exp': `Caduca en`,
      'ac.empty': `Aún no hay SID. Crea uno arriba.`,
      'ac.list.help': `Un SID que no se usa durante {n} días se elimina automáticamente. Cualquier lectura o escritura con él reinicia el temporizador.`,
      'ac.copy': `Copiar`, 'ac.copied': `¡Copiado!`, 'ac.delete': `Eliminar`, 'ac.confirm': `¿Eliminar el SID «{sid}» y todos sus bytes? No se puede deshacer.`, 'ac.created': `Creado: {sid}`,
      'ago.now': `justo ahora`, 'ago.min': `hace {n} min`, 'ago.h': `hace {n} h`, 'ago.d': `hace {n} d`,
      'left.expired': `caducado`, 'left.dh': `{d}d {h}h`, 'left.h': `{h}h`, 'left.min': `{m} min`,
      'dc.h1': `📖 Documentación`, 'dc.sub': `Cada usuario tiene un <code>SID</code> y una lista de bytes (hasta 256). El SID siempre va en el header de la petición.`,
      'dc.endpoints': `Endpoints`, 'dc.th.method': `Método`, 'dc.th.route': `Ruta`, 'dc.th.what': `Qué hace`,
      'dc.r.register': `Registra un ID. Cuerpo opcional: <code>{"sid":"mi_id"}</code>`,
      'dc.r.generate': `Sugiere un SID aleatorio disponible ahora mismo (no se reserva hasta que lo registres)`,
      'dc.r.read0': `Lee el byte 0 → <code>{"value":"00000000"}</code>`, 'dc.r.readidx': `Lee el byte del índice indicado (0–255)`,
      'dc.r.readall': `Lee todos tus bytes`, 'dc.r.write': `Escribe <code>{"value":"10101010"}</code> (exactamente 8 bits)`,
      'dc.exp.h': `Caducidad y cuentas`,
      'dc.exp.p1': `Un SID que no se lee ni se escribe durante <strong>3 días</strong> se elimina junto con sus bytes. Cada petición que usa el SID reinicia el temporizador. Cada SID es único, así que dos usuarios nunca pueden compartir uno.`,
      'dc.exp.p2': `Registrarse por la API crea un SID anónimo. Para ver y gestionar todos tus SID, <a href="/account.html">crea una cuenta</a> y créalos allí.`,
      'dc.errors.h': `Errores comunes`, 'dc.e401': `Falta el header SID, o el SID no está registrado / ha caducado`, 'dc.e400': `El valor no tiene exactamente 8 caracteres 0/1, o índice no válido`,
      'dc.e404': `Ese índice todavía no se ha escrito`, 'dc.e409': `SID ya en uso al registrar`, 'dc.e429': `Demasiadas peticiones (límite por IP)`,
      'err.rate_limited': `Demasiadas peticiones. Inténtalo de nuevo en un momento.`, 'err.sid_limit': `Límite de SID alcanzado.`,
      'err.sid_invalid': `SID no válido: usa de 3 a 32 caracteres (letras, números, _ o -).`, 'err.sid_taken': `Ese SID ya está en uso. Elige otro.`,
      'err.username_invalid': `Usuario: de 3 a 24 caracteres (letras, números o _).`, 'err.password_invalid': `Contraseña: de 8 a 128 caracteres.`,
      'err.username_taken': `Ese nombre de usuario ya está en uso.`, 'err.account_limit': `Límite de cuentas alcanzado.`,
      'err.creds_missing': `Envía un nombre de usuario y una contraseña.`, 'err.bad_login': `Usuario o contraseña incorrectos.`, 'err.not_logged_in': `No has iniciado sesión.`,
      'err.account_sid_cap': `Puedes tener hasta 20 SID. Elimina uno primero.`, 'err.sid_not_in_account': `SID no encontrado en tu cuenta.`,
      'err.sid_header_missing': `Envía tu ID en el header SID. Ej.: SID: 1234`, 'err.sid_unknown': `SID no registrado (o eliminado tras 3 días sin uso).`,
      'err.index_invalid': `Índice no válido (0 a 255).`, 'err.byte_unwritten': `Ese byte todavía no se ha escrito.`,
      'err.body_invalid': `Cuerpo no válido. Envía {"value":"01010101"} con exactamente 8 bits.`, 'err.route_not_found': `Ruta no encontrada.`,
      'err.bad_request': `Petición no válida (¿JSON mal formado?).`, 'err.generic': `Algo salió mal.`
    }
  };

  function detect() {
    try { const s = localStorage.getItem('lang'); if (s && LANGS[s]) return s; } catch (_) {}
    const n = ((navigator.language || 'en') + '').slice(0, 2).toLowerCase();
    return LANGS[n] ? n : 'en';
  }
  let lang = detect();

  window.__I18N = D;
  window.getLang = () => lang;
  window.t = function (key, vars) {
    let s = (D[lang] && D[lang][key]) || D.en[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };
  // Translates an API error ({code, error}); falls back to the server's English text
  window.apiError = (data) => (data && data.code && D.en['err.' + data.code]) ? window.t('err.' + data.code) : ((data && data.error) || window.t('err.generic'));

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((e) => { e.textContent = window.t(e.dataset.i18n, e.dataset); });
    document.querySelectorAll('[data-i18n-html]').forEach((e) => { e.innerHTML = window.t(e.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-ph]').forEach((e) => { e.placeholder = window.t(e.dataset.i18nPh); });
    const tk = document.body && document.body.dataset.title;
    if (tk) document.title = window.t(tk);
    document.querySelectorAll('.origin').forEach((e) => { e.textContent = location.origin; });
  }
  window.applyI18n = apply;

  function build() {
    const bar = document.createElement('div');
    bar.className = 'langbar';
    const sel = document.createElement('select');
    sel.id = 'lang';
    sel.setAttribute('aria-label', 'Language');
    for (const [code, name] of Object.entries(LANGS)) {
      const o = document.createElement('option');
      o.value = code; o.textContent = name; if (code === lang) o.selected = true;
      sel.append(o);
    }
    sel.onchange = () => {
      lang = sel.value;
      try { localStorage.setItem('lang', lang); } catch (_) {}
      apply();
      document.dispatchEvent(new Event('langchange'));
    };
    bar.append('🌐 ', sel);
    const main = document.querySelector('main');
    (main || document.body).prepend(bar);
  }

  document.addEventListener('DOMContentLoaded', () => { build(); apply(); document.dispatchEvent(new Event('langready')); });
})();
