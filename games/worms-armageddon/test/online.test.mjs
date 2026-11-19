import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { EventEmitter } from 'node:events';
import { Duplex } from 'node:stream';

import { DT, PHASES } from '../src/constants.js';
import { GameEngine } from '../src/game.js';
import { computeFormatBits, computeReedSolomon, encodeQR } from '../src/qr.js';
import { attachMultiplayerServer } from '../src/ws-server.mjs';

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function encodeMaskedTextFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const mask = crypto.randomBytes(4);
  let header;
  if (payload.length < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81;
    header[1] = 0x80 | payload.length;
  } else {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  }
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) {
    masked[i] = payload[i] ^ mask[i % 4];
  }
  return Buffer.concat([header, mask, masked]);
}

function createDuplexPair() {
  let closed = false;
  const clientSocket = new Duplex({
    read() {},
    write(chunk, _enc, cb) {
      if (!closed) serverSocket.push(Buffer.from(chunk));
      cb();
    },
  });
  const serverSocket = new Duplex({
    read() {},
    write(chunk, _enc, cb) {
      if (!closed) clientSocket.push(Buffer.from(chunk));
      cb();
    },
  });
  const shutdown = () => {
    if (closed) return;
    closed = true;
    clientSocket.push(null);
    serverSocket.push(null);
    clientSocket.emit('close');
    serverSocket.emit('close');
  };
  clientSocket.destroy = shutdown;
  serverSocket.destroy = shutdown;
  clientSocket.end = (chunk) => {
    if (chunk) clientSocket.write(chunk);
    shutdown();
  };
  serverSocket.end = (chunk) => {
    if (chunk) serverSocket.write(chunk);
    shutdown();
  };
  return { clientSocket, serverSocket };
}

function connectInMemoryWs(mockServer) {
  return new Promise((resolve, reject) => {
    const { clientSocket, serverSocket } = createDuplexPair();
    const key = crypto.randomBytes(16).toString('base64');
    const expectedAccept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
    const emitter = new EventEmitter();

    let upgraded = false;
    let recvBuf = Buffer.alloc(0);

    const ws = {
      send(text) {
        clientSocket.write(encodeMaskedTextFrame(String(text)));
      },
      close() {
        clientSocket.end();
      },
      addEventListener(type, fn) {
        emitter.on(type, fn);
      },
      removeEventListener(type, fn) {
        emitter.off(type, fn);
      },
    };

    function parseFrames() {
      while (recvBuf.length >= 2) {
        const opcode = recvBuf[0] & 0x0f;
        let len = recvBuf[1] & 0x7f;
        let off = 2;
        if (len === 126) {
          if (recvBuf.length < 4) return;
          len = recvBuf.readUInt16BE(2);
          off = 4;
        }
        if (recvBuf.length < off + len) return;
        const payload = recvBuf.subarray(off, off + len);
        recvBuf = recvBuf.subarray(off + len);
        if (opcode === 0x1) {
          emitter.emit('message', { data: payload.toString('utf8') });
        } else if (opcode === 0x8) {
          ws.close();
        }
      }
    }

    clientSocket.on('data', (chunk) => {
      recvBuf = recvBuf.length === 0 ? Buffer.from(chunk) : Buffer.concat([recvBuf, chunk]);
      if (!upgraded) {
        const hdrEnd = recvBuf.indexOf('\r\n\r\n');
        if (hdrEnd === -1) return;
        const headerText = recvBuf.subarray(0, hdrEnd).toString('utf8');
        recvBuf = recvBuf.subarray(hdrEnd + 4);
        if (!headerText.startsWith('HTTP/1.1 101 ') || !headerText.includes(expectedAccept)) {
          reject(new Error(`Invalid WebSocket handshake response: ${headerText}`));
          return;
        }
        upgraded = true;
        resolve(ws);
        if (recvBuf.length > 0) parseFrames();
        return;
      }
      parseFrames();
    });

    mockServer.emit(
      'upgrade',
      {
        url: '/ws',
        headers: {
          host: '127.0.0.1:4174',
          upgrade: 'websocket',
          'sec-websocket-key': key,
        },
      },
      serverSocket,
      Buffer.alloc(0)
    );
  });
}

function waitForEvent(ws, predicate, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timed out waiting for WebSocket message'));
    }, timeoutMs);
    const onMsg = (ev) => {
      const data = JSON.parse(String(ev.data));
      if (predicate(data)) {
        cleanup();
        resolve(data);
      }
    };
    const onErr = (err) => {
      cleanup();
      reject(err);
    };
    function cleanup() {
      clearTimeout(timer);
      ws.removeEventListener('message', onMsg);
      ws.removeEventListener('error', onErr);
    }
    ws.addEventListener('message', onMsg);
    ws.addEventListener('error', onErr);
  });
}

test('QR encoder generates valid ISO 18004 matrix, format bits, and Reed-Solomon codewords', () => {
  assert.equal(computeFormatBits(0), 0x77c4);

  // Verify Reed-Solomon remainder check (data + ec concatenated gives 0 remainder)
  const sampleData = new Uint8Array([0x40, 0xd4, 0x86, 0x56, 0xc6, 0xc6, 0xf2, 0xc2, 0x05, 0x76, 0xf7, 0x26, 0xc6, 0x42, 0x10, 0xec, 0x11, 0xec, 0x11]);
  const ec = computeReedSolomon(sampleData, 7);
  assert.equal(ec.length, 7);
  const combined = new Uint8Array(sampleData.length + ec.length);
  combined.set(sampleData, 0);
  combined.set(ec, sampleData.length);
  const verifyZero = computeReedSolomon(combined, 7);
  assert.deepEqual(Array.from(verifyZero), [0, 0, 0, 0, 0, 0, 0]);

  const url = 'http://192.168.1.7:4174/?room=K7M4P9';
  const qr = encodeQR(url);
  assert.equal(qr.version, 3);
  assert.equal(qr.size, 29);
  assert.equal(qr.modules.length, 29 * 29);

  // Top-left 7x7 finder corners & center
  assert.equal(qr.modules[0 * 29 + 0], 1);
  assert.equal(qr.modules[0 * 29 + 6], 1);
  assert.equal(qr.modules[1 * 29 + 1], 0);
  assert.equal(qr.modules[3 * 29 + 3], 1);

  // Top-right & bottom-left finder centers
  assert.equal(qr.modules[3 * 29 + (29 - 4)], 1);
  assert.equal(qr.modules[(29 - 4) * 29 + 3], 1);

  // Dark module at (4 * version + 9, 8) = (21, 8)
  assert.equal(qr.modules[21 * 29 + 8], 1);
});

test('WebSocket room server creates rooms, validates joins/full rooms, relays messages, and cleans up', async () => {
  const mockServer = new EventEmitter();
  const mp = attachMultiplayerServer(mockServer);

  const hostWs = await connectInMemoryWs(mockServer);
  const guestWs = await connectInMemoryWs(mockServer);
  const thirdWs = await connectInMemoryWs(mockServer);

  try {
    // Host creates room
    const createdPromise = waitForEvent(hostWs, (m) => m.type === 'room_created');
    hostWs.send(
      JSON.stringify({
        type: 'create_room',
        hostName: 'Red Brigade',
        lobbyState: { theme: 'arctic', seed: 9001 },
      })
    );
    const created = await createdPromise;
    assert.match(created.code, /^[A-Z2-9]{6}$/);

    // Invalid code check
    const notFoundPromise = waitForEvent(guestWs, (m) => m.type === 'room_error');
    guestWs.send(JSON.stringify({ type: 'join_room', code: 'ZZZZZZ', guestName: 'Blue' }));
    const notFound = await notFoundPromise;
    assert.equal(notFound.reason, 'not_found');

    // Guest joins valid room
    const hostNotifyPromise = waitForEvent(hostWs, (m) => m.type === 'guest_joined');
    const guestJoinedPromise = waitForEvent(guestWs, (m) => m.type === 'room_joined');
    guestWs.send(JSON.stringify({ type: 'join_room', code: created.code, guestName: 'Blue Platoon' }));
    const [hostNotif, guestJoined] = await Promise.all([hostNotifyPromise, guestJoinedPromise]);
    assert.equal(hostNotif.guestName, 'Blue Platoon');
    assert.equal(guestJoined.code, created.code);
    assert.equal(guestJoined.lobbyState.theme, 'arctic');

    // Third player gets rejected as full
    const fullPromise = waitForEvent(thirdWs, (m) => m.type === 'room_error');
    thirdWs.send(JSON.stringify({ type: 'join_room', code: created.code, guestName: 'Intruder' }));
    const fullErr = await fullPromise;
    assert.equal(fullErr.reason, 'full');

    // Bidirectional relay
    const guestGotLobby = waitForEvent(guestWs, (m) => m.type === 'lobby_state');
    hostWs.send(JSON.stringify({ type: 'lobby_state', lobbyState: { theme: 'volcano', seed: 42 } }));
    const relayedLobby = await guestGotLobby;
    assert.equal(relayedLobby.lobbyState.theme, 'volcano');

    const hostGotAction = waitForEvent(hostWs, (m) => m.type === 'action');
    guestWs.send(JSON.stringify({ type: 'action', action: { kind: 'jump' } }));
    const relayedAction = await hostGotAction;
    assert.equal(relayedAction.action.kind, 'jump');

    // Close room notifies guest
    const closedPromise = waitForEvent(guestWs, (m) => m.type === 'room_closed');
    hostWs.send(JSON.stringify({ type: 'close_room' }));
    const closedMsg = await closedPromise;
    assert.equal(closedMsg.reason, 'host_closed');
  } finally {
    hostWs.close();
    guestWs.close();
    thirdWs.close();
    mp.closeAll();
    mockServer.emit('close');
  }
});

test('Host and Guest GameEngine stay synchronized across terrain carving and remote Guest turn', () => {
  const cfg = {
    theme: 'meadow',
    seed: 5150,
    wormsPerTeam: 2,
    startHp: 100,
    turnTime: 45,
    suddenDeathTurns: 14,
    teams: [
      { name: 'Host Red', isAI: false },
      { name: 'Guest Blue', isAI: false },
    ],
  };

  const guest = new GameEngine();
  const host = new GameEngine({
    onNetEvent: (msg) => {
      if (msg.type === 'terrain_op') guest.applyTerrainOp(msg);
      else if (msg.type === 'fx_event') guest.applyFxEvent(msg.fx);
    },
  });

  host.setNetworkMode('host', 0);
  host.startMatch(cfg);
  guest.startGuestMatch(cfg);
  guest.applySnapshot(host.getSnapshot());

  assert.equal(host.terrain.solidCount, guest.terrain.solidCount);
  assert.equal(host.canLocalPlayerControl(), true);
  assert.equal(guest.canLocalPlayerControl(), false);

  // Host carves explosion and verifies terrain + HP sync
  const target = host.worms.find((w) => w.teamIndex === 1);
  host.explode(target.x + 8, target.y + 6, 40, 35, 250, { attackerTeamIndex: 0, attackerWormName: 'Host' });
  guest.applySnapshot(host.getSnapshot());
  assert.equal(guest.terrain.solidCount, host.terrain.solidCount);
  assert.equal(guest.worms.find((w) => w.id === target.id).hp, target.hp);

  // Advance turn to Guest (team 1)
  host._enterResolving();
  for (let i = 0; i < 300; i++) {
    host.step(DT);
    if (host.activeTeamIndex === 1 && host.phase === PHASES.PLAYER_TURN) break;
  }
  guest.applySnapshot(host.getSnapshot());
  assert.equal(host.activeTeamIndex, 1);
  assert.equal(host.canLocalPlayerControl(), false);
  assert.equal(guest.canLocalPlayerControl(), true);

  // Guest walks right and selects grenade, Host rejects if wrong turn or applies on Guest's turn
  const guestWormHostSide = host.getActiveWorm();
  const startX = guestWormHostSide.x;
  host.applyRemoteInput({ left: false, right: true, up: false, down: false });
  for (let i = 0; i < 15; i++) host.step(DT);
  host.applyRemoteInput({ left: false, right: false, up: false, down: false });
  host.applyRemoteAction({ kind: 'select_weapon', weaponId: 'grenade' });
  guest.applySnapshot(host.getSnapshot());

  assert.ok(guestWormHostSide.x > startX);
  assert.equal(guest.getActiveWorm().x, Math.round(guestWormHostSide.x * 10) / 10);
  assert.equal(guest.selectedWeaponId, 'grenade');
  assert.equal(guest.teams[0].inventory.bazooka, Infinity);
});
