// ============================================================
// COSMO-JUNK — автономный сервер для хост-устройства.
// Ноль зависимостей: запускается plainly "node server.js".
// Без PostgreSQL — комнаты в памяти, лидерборд в JSON-файле.
// Повторяет API из src/app/api/* исходного Next-приложения.
// ============================================================

"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const ROOT = __dirname;           // .../standalone
const DATA_DIR = path.join(ROOT, "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");

const PORT = Number(process.argv[2] || process.env.PORT || 3000);
const HOST = process.env.HOST || "::"; // IPv6 any + IPv4 fallback

// ====== имена и код комнат (порт из src/lib/game/names.ts) ======
const ADJ = [
  "РЖАВЫЙ", "ПЬЯНЫЙ", "КОСМИЧЕСКИЙ", "ПОСЛЕДНИЙ", "ВЕСЁЛЫЙ", "СЛОМАННЫЙ",
  "НЕУТОМИМЫЙ", "МЯТЫЙ", "ХРАБРЫЙ", "ЗВЕНЯЩИЙ", "ДРЕМУЧИЙ", "ПОДОЗРИТЕЛЬНЫЙ",
];
const NOUN = [
  "ТАЗИК", "САМОВАР", "ПЕНЁК", "БАРЖА-9", "УТЮГ", "ЧАЙНИК", "ВАРЕНИК",
  "ТРАКТОР", "ПЫЛЕСОС", "ГВОЗДЬ", "ЧЕМОДАН", "БАРАК", "САПОГ", "КОВШ",
];
const CALLSIGNS = [
  "БОРЯ", "ГРИША", "ЗИНА", "КЭП", "МАКС", "ТАСЯ", "ФЕДЯ", "ЮЛЬКА",
  "ВАЛЕРА", "ДОЗИМЕТР", "ШТИРЛИЦ", "ПРОФЕССОР", "БОЦМАН", "ЧИЖ",
];
function randomShipName() {
  return `${ADJ[(Math.random() * ADJ.length) | 0]} «${NOUN[(Math.random() * NOUN.length) | 0]}»`;
}
function randomCallsign() {
  return CALLSIGNS[(Math.random() * CALLSIGNS.length) | 0];
}
function makeRoomCode() {
  const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += ABC[(Math.random() * ABC.length) | 0];
  return s;
}

// ====== комнаты в памяти (порт из src/server/rooms.ts) ======
const ROLE_ORDER = ["pilot", "engineer", "gunner", "navigator"];
const HOST_TIMEOUT = 7000;
const PLAYER_TIMEOUT = 9000;
const ROOM_TTL = 3 * 60 * 60 * 1000;

const rooms = new Map();
const lastSeen = new Map(); // `${code}:${playerId}` -> ts

function refreshConnected(room) {
  const now = Date.now();
  for (const pl of room.players) {
    pl.connected = now - (lastSeen.get(`${room.code}:${pl.id}`) ?? 0) < PLAYER_TIMEOUT;
  }
}

function sweep() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const seen = (id) => lastSeen.get(`${room.code}:${id}`) ?? room.createdAt;
    const anyAlive =
      now - room.hostLastSeen < ROOM_TTL &&
      (now - room.hostLastSeen < 15000 || room.players.some((pl) => now - seen(pl.id) < 15000));
    if (!anyAlive || now - room.createdAt > ROOM_TTL) rooms.delete(code);
  }
}
setInterval(sweep, 60 * 1000).unref();

function createRoom(code) {
  const room = {
    code,
    shipName: randomShipName(),
    phase: "lobby",
    players: [],
    inputs: [],
    inputSeq: 0,
    snapshot: null,
    createdAt: Date.now(),
    hostLastSeen: Date.now(),
    savedResult: false,
  };
  rooms.set(code, room);
  return room;
}

function joinRoom(room, name, playerId) {
  if (playerId) {
    const existing = room.players.find((p) => p.id === playerId);
    if (existing) {
      if (name && name !== existing.name) existing.name = name;
      lastSeen.set(`${room.code}:${existing.id}`, Date.now());
      return { player: existing, rejoined: true };
    }
  }
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const taken = new Set(room.players.map((p) => p.role));
  const role = ROLE_ORDER.find((r) => !taken.has(r)) ?? "spectator";
  const player = {
    id,
    name: (name || randomCallsign()).toUpperCase().slice(0, 12),
    role,
    connected: true,
  };
  room.players.push(player);
  lastSeen.set(`${room.code}:${player.id}`, Date.now());
  return { player, rejoined: false };
}

function addInput(room, playerId, role, msg) {
  if (room.phase !== "playing") return;
  room.inputSeq++;
  room.inputs.push({ ...msg, playerId, role, seq: room.inputSeq });
  if (room.inputs.length > 400) room.inputs.splice(0, room.inputs.length - 400);
}

function drainInputs(room) {
  if (room.inputs.length === 0) return [];
  const out = room.inputs;
  room.inputs = [];
  return out;
}

function toPublic(room) {
  refreshConnected(room);
  return {
    code: room.code,
    shipName: room.shipName,
    phase: room.phase,
    createdAt: room.createdAt,
    players: room.players.map((p) => ({ ...p })),
    snapshot: room.snapshot,
    hostOnline: Date.now() - room.hostLastSeen < HOST_TIMEOUT,
  };
}

// ====== лидерборд-файл (замена PostgreSQL) ======
let boardRowSeq = 1;
let board = [];
let saveTimer = null;

function loadBoard() {
  try {
    const rows = JSON.parse(fs.readFileSync(LEADERBOARD_FILE, "utf8"));
    if (Array.isArray(rows)) {
      board = rows;
      boardRowSeq = board.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    }
  } catch {
    /* файла нет — начнём с пустого */
  }
}

function saveBoardSoon() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const tmp = LEADERBOARD_FILE + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(board, null, 2), "utf8");
      fs.renameSync(tmp, LEADERBOARD_FILE);
    } catch (e) {
      console.error("[board] save failed:", e.message);
    }
  }, 300);
  saveTimer.unref?.();
}

function topRows(limit) {
  return board
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ====== утилиты HTTP ======
function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(body);
}

function readJSON(req) {
  return new Promise((resolve) => {
    let data = "";
    let over = false;
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 512 * 1024) {
        over = true;
        req.destroy();
      }
    });
    req.on("end", () => {
      if (over) return resolve(null);
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

// ====== статика ======
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const INDEX_HTML = (() => {
  try {
    return fs.readFileSync(path.join(ROOT, "index.html"));
  } catch {
    return Buffer.from("<h1>standalone/index.html не найден — собери пакет (build.mjs)</h1>");
  }
})();

const STATIC_DIRS = ["assets", "fonts", "images"];

function serveStatic(req, res, pathname) {
  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": MIME[".html"], "Cache-Control": "no-cache" });
    res.end(INDEX_HTML);
    return true;
  }
  const rel = decodeURIComponent(pathname).replace(/^\/+/, "");
  const allowed = STATIC_DIRS.some((dir) => rel === dir || rel.startsWith(dir + "/"));
  if (allowed) {
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) return false; // traversal
    let data;
    try {
      data = fs.readFileSync(file);
    } catch {
      return false;
    }
    const ext = path.extname(file).toLowerCase();
    const cache = rel.startsWith("assets/") || rel.startsWith("fonts/") ? "public, max-age=600" : "no-cache";
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": cache });
    res.end(data);
    return true;
  }
  return false;
}

// ====== роутер ======
async function handleAPI(req, res, url) {
  const p = url.pathname.replace(/\/+$/, "");
  const seg = p.split("/").filter(Boolean); // ["api", ...]

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return true;
  }

  // --- GET /api/health ---
  if (req.method === "GET" && p === "/api/health") {
    sendJSON(res, 200, { ok: true });
    return true;
  }

  // --- GET /api/server-info ---
  if (req.method === "GET" && p === "/api/server-info") {
    const port = url.port || String(PORT);
    const proto = "http";
    const nets = os.networkInterfaces();
    const ips = [];
    for (const list of Object.values(nets)) {
      for (const net of list ?? []) {
        if (String(net.family) === "IPv4" && !net.internal) ips.push(net.address);
      }
    }
    const prio = (ip) =>
      ip.startsWith("192.168.") ? 0 : ip.startsWith("10.") ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ? 2 : 3;
    ips.sort((a, b) => prio(a) - prio(b));
    const suffix = port === "80" ? "" : `:${port}`;
    sendJSON(res, 200, { urls: ips.map((ip) => `${proto}://${ip}${suffix}`) });
    return true;
  }

  // --- комнаты ---
  if (seg[1] === "rooms") {
    if (req.method === "POST" && p === "/api/rooms") {
      sweep();
      let code = makeRoomCode();
      let tries = 0;
      while (rooms.has(code) && tries < 20) {
        code = makeRoomCode();
        tries++;
      }
      const room = createRoom(code);
      sendJSON(res, 200, { code: room.code, shipName: room.shipName });
      return true;
    }

    const code = String(seg[2] ?? "").toUpperCase();
    const room = rooms.get(code);
    const tail = seg[3] ?? "";

    if (!room) {
      sendJSON(res, 404, { error: "NOT_FOUND" });
      return true;
    }

    if (req.method === "GET" && !tail) {
      const u = new URL(req.url, `http://${req.headers.host ?? "x"}`);
      let inputs;
      if (u.searchParams.get("host") === "1") {
        room.hostLastSeen = Date.now();
        inputs = drainInputs(room);
      }
      const playerId = u.searchParams.get("player");
      if (playerId) lastSeen.set(`${room.code}:${playerId}`, Date.now());
      sendJSON(res, 200, { ...toPublic(room), ...(inputs !== undefined ? { inputs } : {}) });
      return true;
    }

    if (req.method === "POST" && tail === "join") {
      const body = (await readJSON(req)) ?? {};
      const { player, rejoined } = joinRoom(room, String(body.name ?? ""), body.playerId);
      sendJSON(res, 200, {
        playerId: player.id,
        role: player.role,
        name: player.name,
        shipName: room.shipName,
        phase: room.phase,
        rejoined,
      });
      return true;
    }

    if (req.method === "POST" && tail === "host") {
      const body = (await readJSON(req)) ?? {};
      room.hostLastSeen = Date.now();
      if (body.op === "start") {
        room.phase = "playing";
        room.snapshot = null;
        room.savedResult = false;
      } else if (body.op === "reset") {
        room.phase = "lobby";
        room.snapshot = null;
        room.savedResult = false;
        room.inputs = [];
      } else if (body.op === "snapshot") {
        if (body.snapshot) room.snapshot = body.snapshot;
      } else {
        sendJSON(res, 400, { error: "BAD_OP" });
        return true;
      }
      sendJSON(res, 200, { ok: true, ...toPublic(room) });
      return true;
    }

    if (req.method === "POST" && tail === "input") {
      const body = (await readJSON(req)) ?? {};
      if (!body.playerId || !body.role || !body.msg) {
        sendJSON(res, 400, { error: "BAD_BODY" });
        return true;
      }
      lastSeen.set(`${room.code}:${body.playerId}`, Date.now());
      addInput(room, body.playerId, body.role, body.msg);
      sendJSON(res, 200, { ok: true });
      return true;
    }
  }

  // --- лидерборд ---
  if (req.method === "GET" && p === "/api/leaderboard") {
    sendJSON(res, 200, { rows: topRows(10) });
    return true;
  }

  if (req.method === "POST" && p === "/api/leaderboard") {
    const body = (await readJSON(req)) ?? {};
    if (!body.code || !body.result || !body.shipName) {
      sendJSON(res, 400, { error: "BAD_BODY" });
      return true;
    }
    const room = rooms.get(String(body.code).toUpperCase());
    if (room?.savedResult) {
      sendJSON(res, 200, { ok: true, dedup: true });
      return true;
    }
    const r = body.result;
    board.push({
      id: boardRowSeq++,
      createdAt: Date.now(),
      shipName: String(body.shipName).slice(0, 60),
      crew: JSON.stringify((body.crew ?? []).slice(0, 8)),
      score: Math.max(0, Math.round(r.score || 0)),
      rankCode: String(r.rankCode || "X"),
      rankTitle: String(r.rankTitle || "").slice(0, 60),
      hull: Number(r.hull) || 0,
      progress: Number(r.progress) || 0,
      won: Boolean(r.won),
      resolved: Number(r.resolved) || 0,
      kills: Number(r.kills) || 0,
      bots: Math.max(0, Math.min(4, Math.round(Number(body.bots) || 0))),
      durationSec: Number(r.timeSec) || 0,
    });
    if (room) room.savedResult = true;
    saveBoardSoon();
    sendJSON(res, 200, { ok: true });
    return true;
  }

  return false; // не API
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "x"}`);
  let pathname;
  try {
    pathname = url.pathname;
  } catch {
    res.writeHead(400);
    res.end("bad url");
    return;
  }

  try {
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      const handled = await handleAPI(req, res, url);
      if (!handled && !res.writableEnded) sendJSON(res, 404, { error: "NOT_FOUND" });
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      if (serveStatic(req, res, pathname)) return;
      // SPA: любые прочие пути → index.html (клиент сам разберёт /ship/CODE, /play/CODE)
      res.writeHead(200, { "Content-Type": MIME[".html"], "Cache-Control": "no-cache" });
      res.end(INDEX_HTML);
      return;
    }

    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }));
  } catch (e) {
    console.error("[server]", e);
    if (!res.writableEnded) {
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "INTERNAL" }));
    }
  }
});

// IPv6 "::" ловит и IPv4-клиентов (IPV6_V6ONLY=false в Node по умолчанию).
server.on("error", (e) => {
  console.error(`[server] Не удалось занять порт ${PORT}:`, e.message);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  loadBoard();
  sweep();
  const nets = os.networkInterfaces();
  const ips = [];
  for (const list of Object.values(nets)) {
    for (const net of list ?? []) {
      if (String(net.family) === "IPv4" && !net.internal) ips.push(net.address);
    }
  }
  const prio = (ip) => (ip.startsWith("192.168.") ? 0 : ip.startsWith("10.") ? 1 : 2);
  ips.sort((a, b) => prio(a) - prio(b));

  console.log("");
  console.log("  ╔══════════════════════════════════════════════════╗");
  console.log("  ║   COSMO-JUNK // АВТОНОМНЫЙ БОРТОВОЙ ТЕРМИНАЛ      ║");
  console.log("  ╚══════════════════════════════════════════════════╝");
  console.log("");
  console.log(`   Хост-экран:   http://localhost:${PORT}`);
  if (ips.length) {
    for (const ip of ips.slice(0, 3)) {
      console.log(`   Телефоны:     http://${ip}:${PORT}  (QR появится в лобби)`);
    }
  } else {
    console.log(`   Телефоны:     http://<IP-этого-устройства>:${PORT}`);
  }
  console.log("");
  console.log(`   Лидерборд:    ${LEADERBOARD_FILE}`);
  console.log("   База данных:  НЕ НУЖНА. Комнаты в памяти, рекорды в JSON.");
  console.log("");
});
