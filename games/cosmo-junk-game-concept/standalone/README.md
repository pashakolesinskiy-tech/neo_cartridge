# COSMO-JUNK — автономный сервер (standalone)

Самодостаточная версия игры: **нулевые зависимости**, без Next.js и PostgreSQL.
Запускается plain-скриптом на любом устройстве с Node.js (v18+) — это и есть хост-экран.

## Запуск

```powershell
cd ...\cosmo-junk-game-concept\standalone
node server.js              # порт 3000
node server.js 3100         # свой порт (или переменная окружения PORT)
```

В консоли будут адреса: `http://localhost:<порт>` — большой экран,
и адреса локальной сети (`/api/server-info`) — для телефонов.

## Как играть

1. Открыть `http://localhost:<порт>` на хосте → **СОЗДАТЬ ЭКИПАЖ** → попадёте в лобби `/ship/<КОД>`.
2. Телефоны: отсканировать QR из лобби или открыть `http://<IP-хоста>:<порт>/play/<КОД>`.
3. Свободные кресла займут боты. В лобби — «ЗАПУСК ДВИГАТЕЛЕЙ».

## Устройство

| Файл / папка | Что это |
|---|---|
| `server.js` | Весь сервер (только `node:`-модули): статика, SPA-fallback, API комнат, лидерборд, сервер-инфо |
| `index.html` | SPA-оболочка; роутер в `src/main.tsx` разбирает `/`, `/ship/<КОД>`, `/play/<КОД>` |
| `src/` | Точка входа и заглушки `next/navigation`, `next/link` (полная навигация) |
| `src/HomeLeaderboard.tsx` | Зал славы как в Next-версии, но читает `/api/leaderboard` клиентом |
| `assets/` | Собранный бандл: `app.js`, `app.css`, `icon.svg` |
| `data/leaderboard.json` | Рекорды (создаётся сам; сохранение атомарное, батчем ~0.3 с) |

Комнаты — в памяти процесса (как в оригинале), TTL по активности хоста/игроков.
React-компоненты игры не изменялись — бандл собирается из исходников `../src`.

## API (совместимы с Next-версией)

- `POST /api/rooms` → `{code, shipName}`
- `GET /api/rooms/<code>?host=1` — опрос хоста (забирает очередь инпутов); `?player=<id>` — пинг игрока
- `POST /api/rooms/<code>/join` `{name, playerId?}` → `{playerId, role, name, ...}`
- `POST /api/rooms/<code>/host` `{op: "start" | "reset" | "snapshot", snapshot?}`
- `POST /api/rooms/<code>/input` `{playerId, role, msg}`
- `GET/POST /api/leaderboard` (POST: `{code, shipName, crew[], bots, result}`; дедуп на код комнаты)
- `GET /api/server-info` → `{urls[]}` (IP локальной сети для телефонов)
- `GET /api/health` → `{ok: true}`

## Пересборка фронтенда

Собранные файлы уже в `assets/` — **обычно не нужно**. Если правили исходники игры:

```powershell
node standalone/build.mjs
```

Требует `node_modules` рабочего репозитория (react, lucide-react, qrcode, esbuild,
@tailwindcss/postcss). По умолчанию берёт `D:\Projects\cosmo-junk-game-concept`,
другой путь: `COSMO_BUILD_ROOT=D:\путь\к\репо node standalone/build.mjs`.

## Отличия от Next-версии

- Рекорды — JSON-файл вместо PostgreSQL (схема строки та же).
- Веб-шрифты «Press Start 2P» / «Roboto Mono» не упакованы — тексты рендерятся
  системным monospace. При желании положите `ps2p-cyr.woff2` и т.п. в
  `standalone/fonts/` — сервер раздаёт `/fonts/*`; стили globals.css уже на них ссылаются.
- `/images/nebula.jpg` отсутствует — рендер деградирует мягко (фон рисуется кодом).
