import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { attachMultiplayerServer } from './src/ws-server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname);
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function getNetworkAddresses(port) {
  const interfaces = os.networkInterfaces();
  const list = [];
  const vpnKeywords = /vpn|adguard|tailscale|zerotier|hamachi|vmware|virtualbox|hyper-v|vethernet|tunnel|wg/i;

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!Array.isArray(addrs)) continue;
    for (const info of addrs) {
      if (info.family !== 'IPv4' || info.internal) continue;
      const ip = info.address;
      const isPrivateLan =
        ip.startsWith('192.168.') ||
        ip.startsWith('10.') ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip);
      const isVpnName = vpnKeywords.test(name);
      const kind = isPrivateLan && !isVpnName ? 'lan' : 'vpn';
      list.push({
        name,
        ip,
        url: `http://${ip}:${port}`,
        kind,
      });
    }
  }

  const rank = { lan: 0, vpn: 1, local: 2 };
  list.sort((a, b) => rank[a.kind] - rank[b.kind] || a.name.localeCompare(b.name));
  list.push({
    name: 'This PC (Local)',
    ip: '127.0.0.1',
    url: `http://127.0.0.1:${port}`,
    kind: 'local',
  });
  return list;
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
    let pathname = decodeURIComponent(reqUrl.pathname);

    if (pathname === '/api/network-info') {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : currentPort;
      const payload = JSON.stringify({
        port,
        addresses: getNetworkAddresses(port),
      });
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(payload);
      return;
    }

    if (pathname === '/') pathname = '/index.html';

    // Prevent path traversal outside ROOT_DIR
    const safeRelative = path.normalize(pathname).replace(/^([/\\])+/, '');
    const fullPath = path.resolve(ROOT_DIR, safeRelative);
    if (fullPath !== ROOT_DIR && !fullPath.startsWith(ROOT_DIR + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    const stat = await fs.stat(fullPath).catch(() => null);
    if (!stat || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const data = await fs.readFile(fullPath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

attachMultiplayerServer(server);

let currentPort = Number(process.env.PORT) || 4174;
const maxPort = process.env.PORT ? currentPort : currentPort + 20;

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE' && currentPort < maxPort) {
    currentPort += 1;
    server.listen(currentPort, HOST);
    return;
  }
  console.error(err);
  process.exit(1);
});

server.listen(currentPort, HOST, () => {
  const addr = server.address();
  const actualPort = typeof addr === 'object' && addr ? addr.port : currentPort;
  const addrs = getNetworkAddresses(actualPort);
  console.log(`Worms Armageddon server listening at http://127.0.0.1:${actualPort}`);
  for (const a of addrs) {
    if (a.kind !== 'local') {
      console.log(`  [${a.kind.toUpperCase()}] ${a.name}: ${a.url}`);
    }
  }
});
