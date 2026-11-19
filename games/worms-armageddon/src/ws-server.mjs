import crypto from 'node:crypto';

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_PAYLOAD_BYTES = 1024 * 1024; // 1 MB safety limit

function generateRoomCode(rooms) {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += ROOM_ALPHABET[crypto.randomInt(0, ROOM_ALPHABET.length)];
    }
    if (!rooms.has(code)) return code;
  }
  return `W${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

function encodeWsFrame(opcode, payloadBuf) {
  const len = payloadBuf.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x80 | opcode;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payloadBuf]);
}

function sendJson(ws, obj) {
  if (!ws || ws.closed || ws.socket.destroyed) return false;
  try {
    const buf = Buffer.from(JSON.stringify(obj), 'utf8');
    ws.socket.write(encodeWsFrame(0x1, buf));
    return true;
  } catch {
    return false;
  }
}

export function attachMultiplayerServer(httpServer) {
  const rooms = new Map();
  const clients = new Set();

  const pingInterval = setInterval(() => {
    for (const ws of clients) {
      if (ws.closed || ws.socket.destroyed) continue;
      try {
        ws.socket.write(encodeWsFrame(0x9, Buffer.alloc(0)));
      } catch {
        // Ignore transient write failure; socket close listener handles cleanup
      }
    }
  }, 25000);
  if (typeof pingInterval.unref === 'function') {
    pingInterval.unref();
  }

  function leaveRoom(ws, reason = 'left') {
    if (!ws.roomCode) return;
    const room = rooms.get(ws.roomCode);
    const prevCode = ws.roomCode;
    const prevRole = ws.role;
    ws.roomCode = null;
    ws.role = null;
    if (!room) return;

    if (prevRole === 'host') {
      if (room.guestSocket && room.guestSocket !== ws) {
        room.guestSocket.roomCode = null;
        room.guestSocket.role = null;
        sendJson(room.guestSocket, {
          type: 'room_closed',
          reason: reason === 'host_closed' ? 'host_closed' : 'host_left',
        });
      }
      rooms.delete(prevCode);
    } else if (prevRole === 'guest' && room.guestSocket === ws) {
      room.guestSocket = null;
      room.guestName = null;
      if (room.hostSocket) {
        sendJson(room.hostSocket, { type: 'guest_left' });
      }
    }
  }

  function handleMessage(ws, rawText) {
    let msg;
    try {
      msg = JSON.parse(rawText);
    } catch {
      return;
    }
    if (!msg || typeof msg.type !== 'string') return;

    if (msg.type === 'create_room') {
      leaveRoom(ws, 'host_closed');
      const code = generateRoomCode(rooms);
      const hostName = String(msg.hostName || 'Red Brigade').slice(0, 24);
      const room = {
        code,
        hostSocket: ws,
        guestSocket: null,
        hostName,
        guestName: null,
        lobbyState: msg.lobbyState || null,
      };
      rooms.set(code, room);
      ws.roomCode = code;
      ws.role = 'host';
      sendJson(ws, { type: 'room_created', code, hostName });
      return;
    }

    if (msg.type === 'join_room') {
      leaveRoom(ws, 'left');
      const rawCode = String(msg.code || '').trim().toUpperCase();
      const room = rooms.get(rawCode);
      if (!room) {
        sendJson(ws, { type: 'room_error', reason: 'not_found', message: 'Room not found' });
        return;
      }
      if (room.guestSocket && !room.guestSocket.closed) {
        sendJson(ws, { type: 'room_error', reason: 'full', message: 'Room is already full' });
        return;
      }
      const guestName = String(msg.guestName || 'Blue Platoon').slice(0, 24);
      room.guestSocket = ws;
      room.guestName = guestName;
      ws.roomCode = rawCode;
      ws.role = 'guest';

      sendJson(ws, {
        type: 'room_joined',
        code: rawCode,
        hostName: room.hostName,
        lobbyState: room.lobbyState,
      });
      sendJson(room.hostSocket, {
        type: 'guest_joined',
        guestName,
      });
      return;
    }

    if (msg.type === 'close_room' || msg.type === 'leave_room') {
      leaveRoom(ws, ws.role === 'host' ? 'host_closed' : 'left');
      return;
    }

    // Relay room traffic between host and guest
    if (!ws.roomCode) return;
    const room = rooms.get(ws.roomCode);
    if (!room) return;

    if (ws.role === 'host') {
      if (msg.type === 'lobby_state') {
        room.lobbyState = msg.lobbyState || null;
        if (msg.lobbyState?.hostName) {
          room.hostName = String(msg.lobbyState.hostName).slice(0, 24);
        }
      }
      if (room.guestSocket) {
        sendJson(room.guestSocket, msg);
      }
    } else if (ws.role === 'guest') {
      if (msg.type === 'guest_info' && msg.guestName) {
        room.guestName = String(msg.guestName).slice(0, 24);
      }
      if (room.hostSocket) {
        sendJson(room.hostSocket, msg);
      }
    }
  }

  function processFrames(ws) {
    while (ws.recvBuf.length >= 2) {
      const b0 = ws.recvBuf[0];
      const b1 = ws.recvBuf[1];
      const fin = (b0 & 0x80) !== 0;
      const opcode = b0 & 0x0f;
      const masked = (b1 & 0x80) !== 0;
      let payloadLen = b1 & 0x7f;
      let offset = 2;

      if (payloadLen === 126) {
        if (ws.recvBuf.length < 4) return;
        payloadLen = ws.recvBuf.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        if (ws.recvBuf.length < 10) return;
        const bigLen = ws.recvBuf.readBigUInt64BE(2);
        if (bigLen > BigInt(MAX_PAYLOAD_BYTES)) {
          ws.close(1009);
          return;
        }
        payloadLen = Number(bigLen);
        offset = 10;
      }

      if (payloadLen > MAX_PAYLOAD_BYTES) {
        ws.close(1009);
        return;
      }

      const maskLen = masked ? 4 : 0;
      const totalLen = offset + maskLen + payloadLen;
      if (ws.recvBuf.length < totalLen) return;

      let payload = Buffer.allocUnsafe(payloadLen);
      if (masked) {
        const maskKey = ws.recvBuf.subarray(offset, offset + 4);
        const dataSlice = ws.recvBuf.subarray(offset + 4, totalLen);
        for (let i = 0; i < payloadLen; i++) {
          payload[i] = dataSlice[i] ^ maskKey[i & 3];
        }
      } else {
        ws.recvBuf.copy(payload, 0, offset, totalLen);
      }

      ws.recvBuf = ws.recvBuf.subarray(totalLen);

      if (opcode === 0x8) {
        ws.close(1000);
        return;
      }
      if (opcode === 0x9) {
        if (!ws.closed && !ws.socket.destroyed) {
          ws.socket.write(encodeWsFrame(0xA, payload));
        }
        continue;
      }
      if (opcode === 0xA) {
        continue;
      }

      if (opcode === 0x1 || opcode === 0x0) {
        ws.fragChunks.push(payload);
        if (fin) {
          const full = ws.fragChunks.length === 1 ? ws.fragChunks[0] : Buffer.concat(ws.fragChunks);
          ws.fragChunks.length = 0;
          handleMessage(ws, full.toString('utf8'));
        }
      }
    }
  }

  function handleUpgrade(req, socket, head) {
    try {
      const reqUrl = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
      if (reqUrl.pathname !== '/ws') {
        socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
        socket.destroy();
        return;
      }

      const key = req.headers['sec-websocket-key'];
      const upgradeHdr = String(req.headers.upgrade || '').toLowerCase();
      if (!key || upgradeHdr !== 'websocket') {
        socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
        socket.destroy();
        return;
      }

      const accept = crypto.createHash('sha1').update(String(key) + WS_GUID).digest('base64');
      socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
          'Upgrade: websocket\r\n' +
          'Connection: Upgrade\r\n' +
          `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
      );
      if (typeof socket.setNoDelay === 'function') {
        socket.setNoDelay(true);
      }

      const ws = {
        socket,
        recvBuf: head && head.length > 0 ? Buffer.from(head) : Buffer.alloc(0),
        fragChunks: [],
        roomCode: null,
        role: null,
        closed: false,
        close(code = 1000) {
          if (ws.closed) return;
          ws.closed = true;
          clients.delete(ws);
          leaveRoom(ws, ws.role === 'host' ? 'host_left' : 'left');
          if (!socket.destroyed) {
            try {
              const closePayload = Buffer.alloc(2);
              closePayload.writeUInt16BE(code, 0);
              socket.end(encodeWsFrame(0x8, closePayload));
            } catch {
              socket.destroy();
            }
          }
        },
      };

      clients.add(ws);
      if (ws.recvBuf.length > 0) {
        processFrames(ws);
      }

      socket.on('data', (chunk) => {
        if (ws.closed) return;
        ws.recvBuf = ws.recvBuf.length === 0 ? chunk : Buffer.concat([ws.recvBuf, chunk]);
        processFrames(ws);
      });

      const onDrop = () => {
        if (ws.closed) return;
        ws.closed = true;
        clients.delete(ws);
        leaveRoom(ws, ws.role === 'host' ? 'host_left' : 'left');
      };

      socket.on('close', onDrop);
      socket.on('error', onDrop);
    } catch {
      socket.destroy();
    }
  }

  httpServer.on('upgrade', handleUpgrade);

  function closeAll() {
    clearInterval(pingInterval);
    for (const ws of [...clients]) {
      ws.close(1001);
    }
    rooms.clear();
  }

  httpServer.on('close', closeAll);

  return { rooms, closeAll };
}
