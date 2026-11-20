const WORMS_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const WORMS_ICE_SERVERS = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] },
  {
    urls: [
      'turn:openrelay.metered.ca:80',
      'turn:openrelay.metered.ca:443',
      'turn:openrelay.metered.ca:443?transport=tcp',
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

function genWormsCode(len = 6) {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += WORMS_CODE_CHARS[Math.floor(Math.random() * WORMS_CODE_CHARS.length)];
  }
  return out;
}

function normalizeWormsCode(raw) {
  return String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

function serializeWormsSdp(desc) {
  return desc ? { type: desc.type, sdp: desc.sdp } : null;
}

function serializeWormsIce(cand) {
  if (!cand) return null;
  if (typeof cand.toJSON === 'function') return cand.toJSON();
  return {
    candidate: cand.candidate,
    sdpMid: cand.sdpMid,
    sdpMLineIndex: cand.sdpMLineIndex,
    usernameFragment: cand.usernameFragment,
  };
}

/**
 * Compact Zero-Server WebRTC P2P Room transport for standalone single-file bundling.
 * Uses BroadcastChannel (0ms same-browser) + PeerJS WS + ntfy.sh (?since=15s).
 */
class WormsP2PLink {
  constructor(handlers = {}) {
    this.myId = 'wp_' + Math.random().toString(36).slice(2, 8);
    this.role = 'none';
    this.code = '';
    this.closed = false;

    this.pc = null;
    this.ctl = null;
    this.fast = null;
    this.remotePeerId = '';
    this.open = false;
    this.viaBc = false;
    this.bcFallback = false;
    this.handshakeSeen = false;
    this.offerId = '';
    this.lastOfferAt = 0;
    this.createdAt = 0;
    this.pendingIce = [];
    this.seenOfferIds = new Set();
    this.seenSignals = new Set();
    this.seenSeqs = new Set();
    this.outSeq = 1;

    this.bc = null;
    this.peerWs = null;
    this.peerWsOpen = false;
    this.peerWsQueue = [];
    this.peerHeartbeat = null;
    this.peerJsTargets = new Map();
    this.ntfyWs = null;
    this.ntfyTopic = '';
    this.ntfyTimers = new Set();
    this.ntfyRateLimitedUntil = 0;
    this.lastNtfyJoinAt = 0;
    this.joinRetryTimer = null;
    this.bcTimer = null;

    this.onOpen = handlers.onOpen || null;
    this.onClose = handlers.onClose || null;
    this.onMessage = handlers.onMessage || null;
    this.onError = handlers.onError || null;
  }

  async startHost(fixedCode) {
    this.close(true);
    this.closed = false;
    this.role = 'host';
    this.code = normalizeWormsCode(fixedCode) || genWormsCode(6);
    this._startSignaling();
    this._broadcastSig({ sig: 'host_ready', from: this.myId, to: '*' });
    return this.code;
  }

  async startGuest(rawCode) {
    const clean = normalizeWormsCode(rawCode);
    if (!clean || clean.length < 3) {
      throw new Error('Invalid room code');
    }
    this.close(true);
    this.closed = false;
    this.role = 'guest';
    this.code = clean;
    this._startSignaling();

    const sendJoin = () => {
      if (this.closed || this.open || this.role !== 'guest') return;
      this._broadcastSig({ sig: 'join', from: this.myId, to: '*' });
    };
    sendJoin();
    this.joinRetryTimer = setInterval(sendJoin, 1000);
    return clean;
  }

  send(payload, fast = false) {
    if (this.closed || !this.open) return false;
    const envelope = JSON.stringify({ __wp: 1, q: this.outSeq++, d: payload });

    if (fast && this.fast && this.fast.readyState === 'open') {
      try {
        if (this.fast.bufferedAmount < 262144) {
          this.fast.send(envelope);
          return true;
        }
      } catch { /* fall through */ }
    }
    if (this.ctl && this.ctl.readyState === 'open') {
      try {
        this.ctl.send(envelope);
        return true;
      } catch { /* fall through */ }
    }
    if (this.bcFallback && this.bc) {
      try {
        this.bc.postMessage({ __wpData: 1, from: this.myId, to: this.remotePeerId, raw: envelope });
        return true;
      } catch { /* ignore */ }
    }
    return false;
  }

  close(silent = false) {
    if (!silent && this.code && !this.closed) {
      try {
        if (this.open) this.send({ __wpSys: 'bye' }, false);
        this._broadcastSig({ sig: 'bye', from: this.myId, to: '*' });
      } catch { /* ignore */ }
    }
    this.closed = true;
    this.open = false;
    this.bcFallback = false;
    if (this.joinRetryTimer) {
      clearInterval(this.joinRetryTimer);
      this.joinRetryTimer = null;
    }
    if (this.peerHeartbeat) {
      clearInterval(this.peerHeartbeat);
      this.peerHeartbeat = null;
    }
    if (this.bcTimer) {
      clearTimeout(this.bcTimer);
      this.bcTimer = null;
    }
    for (const tid of this.ntfyTimers) clearTimeout(tid);
    this.ntfyTimers.clear();
    this.lastNtfyJoinAt = 0;
    this._destroyPeer();
    if (this.bc) {
      try { this.bc.close(); } catch { /* ignore */ }
      this.bc = null;
    }
    if (this.peerWs) {
      try { this.peerWs.onclose = null; this.peerWs.close(); } catch { /* ignore */ }
      this.peerWs = null;
    }
    if (this.ntfyWs) {
      try { this.ntfyWs.onclose = null; this.ntfyWs.close(); } catch { /* ignore */ }
      this.ntfyWs = null;
    }
    this.peerWsOpen = false;
    this.peerWsQueue = [];
    this.peerJsTargets.clear();
    this.seenSignals.clear();
  }

  _destroyPeer() {
    this.open = false;
    this.bcFallback = false;
    this.handshakeSeen = false;
    this.pendingIce = [];
    this.seenOfferIds.clear();
    if (this.bcTimer) {
      clearTimeout(this.bcTimer);
      this.bcTimer = null;
    }
    try { if (this.ctl) { this.ctl.onclose = null; this.ctl.close(); } } catch { /* ignore */ }
    try { if (this.fast) { this.fast.onclose = null; this.fast.close(); } } catch { /* ignore */ }
    try { if (this.pc) { this.pc.oniceconnectionstatechange = null; this.pc.close(); } } catch { /* ignore */ }
    this.ctl = null;
    this.fast = null;
    this.pc = null;
    this.remotePeerId = '';
  }

  _hostPeerJsId() {
    return 'np2p_worms_' + this.code + '_h';
  }

  _startSignaling() {
    if (typeof BroadcastChannel === 'function') {
      try {
        this.bc = new BroadcastChannel('np2p-sig:worms:' + this.code);
        this.bc.onmessage = (ev) => {
          const m = ev && ev.data;
          if (!m) return;
          if (m.__wpData === 1) {
            if (m.from === this.myId || (m.to && m.to !== this.myId)) return;
            this._handleWire(m.raw);
            return;
          }
          this._onSignal(m, 'bc');
        };
      } catch { /* ignore */ }
    }

    try {
      const selfId = this.role === 'host'
        ? this._hostPeerJsId()
        : 'np2p_worms_' + this.code + '_' + this.myId;
      const tok = Math.random().toString(36).slice(2, 10);
      const ws = new WebSocket(
        `wss://0.peerjs.com/peerjs?key=peerjs&id=${encodeURIComponent(selfId)}&token=${encodeURIComponent(tok)}`
      );
      this.peerWs = ws;
      this.peerWsOpen = false;
      ws.onopen = () => {
        this.peerHeartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try { ws.send(JSON.stringify({ type: 'HEARTBEAT' })); } catch { /* ignore */ }
          }
        }, 15000);
      };
      ws.onmessage = (ev) => {
        let pkt;
        try { pkt = JSON.parse(ev.data); } catch { return; }
        if (!pkt) return;
        if (pkt.type === 'OPEN') {
          this.peerWsOpen = true;
          while (this.peerWsQueue.length > 0 && ws.readyState === WebSocket.OPEN) {
            const item = this.peerWsQueue.shift();
            try { ws.send(JSON.stringify(item)); } catch { /* ignore */ }
          }
        } else if (pkt.payload && typeof pkt.payload === 'object') {
          if (pkt.src && pkt.payload.from) {
            this.peerJsTargets.set(pkt.payload.from, pkt.src);
          }
          this._onSignal(pkt.payload, 'peerjs');
        }
      };
      ws.onerror = () => {};
      ws.onclose = () => {
        this.peerWsOpen = false;
        if (this.peerHeartbeat) {
          clearInterval(this.peerHeartbeat);
          this.peerHeartbeat = null;
        }
      };
    } catch { /* ignore */ }

    try {
      this.ntfyTopic = 'np2p-worms-' + this.code.toLowerCase();
      const ws = new WebSocket(`wss://ntfy.sh/${encodeURIComponent(this.ntfyTopic)}/ws?since=15s`);
      this.ntfyWs = ws;
      ws.onmessage = (ev) => {
        const lines = String(ev.data || '').split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const row = JSON.parse(line);
            if (row && row.event === 'message' && typeof row.message === 'string') {
              this._onSignal(JSON.parse(row.message), 'ntfy');
            }
          } catch { /* ignore */ }
        }
      };
      ws.onerror = () => {};
    } catch { /* ignore */ }
  }

  _broadcastSig(sigObj, usePcSdp = false) {
    if (this.closed || !this.code) return;
    const msg = Object.assign(
      { sid: 'sg_' + Math.random().toString(36).slice(2, 9), room: this.code, ns: 'worms', ts: Date.now() },
      sigObj
    );
    if (this.bc) {
      try { this.bc.postMessage(msg); } catch { /* ignore */ }
    }
    const targetPeerJs = msg.to && msg.to !== '*'
      ? (this.peerJsTargets.get(msg.to) || (this.role === 'guest' ? this._hostPeerJsId() : null))
      : (this.role === 'guest' ? this._hostPeerJsId() : null);
    if (targetPeerJs && this.peerWs) {
      const env = { type: 'CANDIDATE', dst: targetPeerJs, payload: msg };
      if (this.peerWs.readyState === WebSocket.OPEN && this.peerWsOpen) {
        try { this.peerWs.send(JSON.stringify(env)); } catch { /* ignore */ }
      } else if (this.peerWs.readyState === WebSocket.CONNECTING || !this.peerWsOpen) {
        if (this.peerWsQueue.length < 48) this.peerWsQueue.push(env);
      }
    }
    const needsNtfy = msg.sig === 'join' || msg.sig === 'offer' || msg.sig === 'answer';
    if (needsNtfy && this.ntfyTopic && Date.now() >= this.ntfyRateLimitedUntil) {
      const tid = setTimeout(() => {
        this.ntfyTimers.delete(tid);
        if (this.closed || !this.ntfyTopic || this.open || this.viaBc || Date.now() < this.ntfyRateLimitedUntil) return;
        if (msg.sig === 'join') {
          if (Date.now() - this.lastNtfyJoinAt < 3500) return;
          this.lastNtfyJoinAt = Date.now();
        } else if (usePcSdp && this.pc && this.pc.localDescription) {
          msg.sdp = serializeWormsSdp(this.pc.localDescription);
        }
        try {
          fetch(`https://ntfy.sh/${encodeURIComponent(this.ntfyTopic)}`, {
            method: 'POST',
            body: JSON.stringify(msg),
            keepalive: true,
          }).then((res) => {
            if (res && res.status === 429) {
              this.ntfyRateLimitedUntil = Date.now() + 60000;
            }
          }).catch(() => {});
        } catch { /* ignore */ }
      }, 750);
      this.ntfyTimers.add(tid);
    }
  }

  _onSignal(msg, via) {
    if (this.closed || !msg || typeof msg !== 'object') return;
    if (msg.ns !== 'worms' || msg.room !== this.code) return;
    if (!msg.from || msg.from === this.myId) return;
    if (msg.to && msg.to !== '*' && msg.to !== this.myId) return;
    if (msg.ts && Math.abs(Date.now() - msg.ts) > 300000 && msg.sig !== 'host_ready') return;
    if (msg.sid) {
      if (this.seenSignals.has(msg.sid)) return;
      this.seenSignals.add(msg.sid);
    }

    if (msg.sig === 'bye' && msg.from === this.remotePeerId) {
      this._handlePeerLeft();
      return;
    }
    if (this.role === 'host') {
      void this._handleHostSig(msg, via);
    } else if (this.role === 'guest') {
      void this._handleGuestSig(msg, via);
    }
  }

  _createPc(peerId, viaBc) {
    const pc = new RTCPeerConnection({ iceServers: WORMS_ICE_SERVERS });
    this.pc = pc;
    this.remotePeerId = peerId;
    this.viaBc = viaBc;
    this.handshakeSeen = false;
    this.createdAt = Date.now();
    this.pendingIce = [];
    this.seenSeqs.clear();

    try {
      this._attachDc(pc.createDataChannel('ctl', { negotiated: true, id: 0, ordered: true }));
      this._attachDc(pc.createDataChannel('fast', { negotiated: true, id: 1, ordered: false, maxRetransmits: 0 }));
    } catch { /* ignore */ }

    pc.onicecandidate = (ev) => {
      if (ev.candidate && !this.closed) {
        this._broadcastSig({ sig: 'ice', from: this.myId, to: peerId, cand: serializeWormsIce(ev.candidate) });
      }
    };
    pc.oniceconnectionstatechange = () => {
      const st = pc.iceConnectionState;
      if (st === 'failed' || st === 'closed') {
        if (this.viaBc && this.handshakeSeen && !this.closed) {
          this._activateBc();
        } else if (this.open) {
          this._handlePeerLeft();
        }
      }
    };
    if (this.bcTimer) clearTimeout(this.bcTimer);
    this.bcTimer = setTimeout(() => {
      if (!this.closed && !this.open && this.viaBc && this.handshakeSeen) {
        this._activateBc();
      }
    }, 1500);
  }

  _attachDc(dc) {
    if (!dc) return;
    if (dc.label === 'fast') this.fast = dc;
    else this.ctl = dc;
    dc.onmessage = (ev) => this._handleWire(ev.data);
    dc.onopen = () => {
      if (dc.label !== 'fast') this._markOpen();
    };
    dc.onclose = () => {
      if (dc.label !== 'fast' && this.open && !this.bcFallback) {
        this._handlePeerLeft();
      }
    };
    if (dc.readyState === 'open' && dc.label !== 'fast') {
      this._markOpen();
    }
  }

  _activateBc() {
    if (!this.viaBc || !this.handshakeSeen || this.closed) return;
    this.bcFallback = true;
    this._markOpen();
  }

  _markOpen() {
    if (this.bcTimer) {
      clearTimeout(this.bcTimer);
      this.bcTimer = null;
    }
    if (this.open) return;
    this.open = true;
    for (const tid of this.ntfyTimers) clearTimeout(tid);
    this.ntfyTimers.clear();
    if (this.joinRetryTimer) {
      clearInterval(this.joinRetryTimer);
      this.joinRetryTimer = null;
    }
    this.onOpen?.(this.remotePeerId);
  }

  _handlePeerLeft() {
    const wasOpen = this.open;
    if (this.role === 'host') {
      this._destroyPeer();
    } else {
      this._destroyPeer();
    }
    if (wasOpen) this.onClose?.();
  }

  _handleWire(raw) {
    if (typeof raw !== 'string') return;
    let frame;
    try { frame = JSON.parse(raw); } catch { return; }
    if (!frame || frame.__wp !== 1) return;
    if (typeof frame.q === 'number') {
      if (this.seenSeqs.has(frame.q)) return;
      this.seenSeqs.add(frame.q);
      if (this.seenSeqs.size > 600) {
        const it = this.seenSeqs.values();
        for (let i = 0; i < 150; i++) {
          const nxt = it.next();
          if (nxt.done) break;
          this.seenSeqs.delete(nxt.value);
        }
      }
    }
    const d = frame.d;
    if (d && d.__wpSys === 'bye') {
      this._handlePeerLeft();
      return;
    }
    this.onMessage?.(d);
  }

  async _handleHostSig(msg, via) {
    if (msg.sig === 'join') {
      const stale = this.pc && !this.open && Date.now() - this.createdAt > 4000;
      if (this.remotePeerId && this.remotePeerId !== msg.from && (this.open || !stale)) {
        if (this.open) {
          this._broadcastSig({ sig: 'full', from: this.myId, to: msg.from });
          return;
        }
      }
      if (!this.pc || (this.remotePeerId !== msg.from && stale)) {
        if (stale) this._destroyPeer();
        this._createPc(msg.from, via === 'bc');
        await this._sendOffer();
      } else if (this.remotePeerId === msg.from) {
        if (via === 'bc') this.viaBc = true;
        if (!this.open && Date.now() - this.lastOfferAt > 1400) {
          await this._sendOffer();
        }
      }
      return;
    }
    if (!this.pc || msg.from !== this.remotePeerId) return;
    if (via === 'bc') this.viaBc = true;
    if (msg.sig === 'answer' && msg.sdp && this.pc.signalingState === 'have-local-offer') {
      this.handshakeSeen = true;
      if (msg.offerId && this.offerId && msg.offerId !== this.offerId) return;
      try {
        await this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        await this._drainIce();
      } catch { /* ignore */ }
    } else if (msg.sig === 'ice' && msg.cand) {
      await this._addIce(msg.cand);
    }
  }

  async _handleGuestSig(msg, via) {
    if (msg.sig === 'host_ready') {
      if (!this.open) this._broadcastSig({ sig: 'join', from: this.myId, to: msg.from });
      return;
    }
    if (msg.sig === 'full') {
      this.onError?.(new Error('Room is full'));
      return;
    }
    if (msg.sig === 'offer' && msg.sdp) {
      if (this.remotePeerId && this.remotePeerId !== msg.from) {
        if (this.open) return;
        this._destroyPeer();
      }
      if (!this.pc) {
        this._createPc(msg.from, via === 'bc');
      } else if (via === 'bc') {
        this.viaBc = true;
      }
      this.handshakeSeen = true;
      if (this.seenOfferIds.has(msg.offerId)) return;
      this.seenOfferIds.add(msg.offerId);
      try {
        await this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        await this._drainIce();
        const ans = await this.pc.createAnswer();
        await this.pc.setLocalDescription(ans);
        this._broadcastSig({
          sig: 'answer',
          from: this.myId,
          to: msg.from,
          offerId: msg.offerId,
          sdp: serializeWormsSdp(this.pc.localDescription),
        }, true);
      } catch { /* ignore */ }
      return;
    }
    if (this.pc && msg.from === this.remotePeerId && msg.sig === 'ice' && msg.cand) {
      if (via === 'bc') this.viaBc = true;
      await this._addIce(msg.cand);
    }
  }

  async _sendOffer() {
    try {
      this.lastOfferAt = Date.now();
      if (!this.pc.localDescription || this.pc.signalingState === 'stable') {
        this.offerId = 'of_' + Math.random().toString(36).slice(2, 8);
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
      }
      this._broadcastSig({
        sig: 'offer',
        from: this.myId,
        to: this.remotePeerId,
        offerId: this.offerId,
        sdp: serializeWormsSdp(this.pc.localDescription),
      }, true);
    } catch { /* ignore */ }
  }

  async _addIce(cand) {
    if (!this.pc) return;
    if (this.pc.remoteDescription && this.pc.remoteDescription.type) {
      try { await this.pc.addIceCandidate(new RTCIceCandidate(cand)); } catch { /* ignore */ }
    } else {
      this.pendingIce.push(cand);
    }
  }

  async _drainIce() {
    const items = this.pendingIce.splice(0, this.pendingIce.length);
    for (const c of items) {
      try { await this.pc.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ignore */ }
    }
  }
}

export class OnlineClient {
  constructor(handlers = {}) {
    this.ws = null;
    this.p2p = null;
    this.serverUrl = null;
    this.preferLocalWs = false;
    this.role = 'none'; // 'none' | 'host' | 'guest'
    this.roomCode = null;
    this.connected = false;
    this.peerConnected = false;
    this.onMessage = handlers.onMessage || null;
    this.onClose = handlers.onClose || null;
    this.onError = handlers.onError || null;
    this._pendingResolver = null;
    this._hostName = 'TEAM 1';
    this._lobbyState = null;
    this._guestTimer = null;
  }

  _useWebSocketMode() {
    return Boolean(this.preferLocalWs || this.serverUrl);
  }

  _getWsUrl() {
    if (this.serverUrl) {
      return `${this.serverUrl.replace(/^http/i, 'ws').replace(/\/+$/, '')}/ws`;
    }
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
      return 'ws://127.0.0.1:4174/ws';
    }
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/ws`;
  }

  _ensureSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    this.disconnect(true);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this._getWsUrl());
      this.ws = ws;
      let settled = false;

      ws.onopen = () => {
        this.connected = true;
        if (!settled) {
          settled = true;
          resolve();
        }
      };

      ws.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!msg || typeof msg.type !== 'string') return;

        if (msg.type === 'room_created') {
          this.role = 'host';
          this.roomCode = msg.code;
          this.peerConnected = false;
          if (this._pendingResolver) {
            const res = this._pendingResolver;
            this._pendingResolver = null;
            res.resolve(msg);
          }
        } else if (msg.type === 'room_joined') {
          this.role = 'guest';
          this.roomCode = msg.code;
          this.peerConnected = true;
          if (this._pendingResolver) {
            const res = this._pendingResolver;
            this._pendingResolver = null;
            res.resolve(msg);
          }
        } else if (msg.type === 'room_error') {
          if (this._pendingResolver) {
            const res = this._pendingResolver;
            this._pendingResolver = null;
            res.reject(new Error(msg.message || msg.reason || 'Room error'));
          }
        } else if (msg.type === 'guest_joined') {
          this.peerConnected = true;
        } else if (msg.type === 'guest_left') {
          this.peerConnected = false;
        } else if (msg.type === 'room_closed') {
          this.role = 'none';
          this.roomCode = null;
          this.peerConnected = false;
        }

        this.onMessage?.(msg);
      };

      ws.onerror = (err) => {
        if (!settled) {
          settled = true;
          reject(new Error('WebSocket connection failed'));
        }
        if (this._pendingResolver) {
          const res = this._pendingResolver;
          this._pendingResolver = null;
          res.reject(new Error('WebSocket error'));
        }
        this.onError?.(err);
      };

      ws.onclose = () => {
        const wasConnected = this.connected || this.role !== 'none';
        this.connected = false;
        this.ws = null;
        this.role = 'none';
        this.roomCode = null;
        this.peerConnected = false;
        if (!settled) {
          settled = true;
          reject(new Error('WebSocket closed'));
        }
        if (this._pendingResolver) {
          const res = this._pendingResolver;
          this._pendingResolver = null;
          res.reject(new Error('Connection closed'));
        }
        if (wasConnected) {
          this.onClose?.();
        }
      };
    });
  }

  async createRoom(hostName, lobbyState, fixedCode) {
    if (this._useWebSocketMode()) {
      await this._ensureSocket();
      return new Promise((resolve, reject) => {
        this._pendingResolver = { resolve, reject };
        this.send({ type: 'create_room', hostName, lobbyState });
      });
    }

    this.disconnect(true);
    this._hostName = hostName || 'TEAM 1';
    this._lobbyState = lobbyState ? { ...lobbyState } : null;

    const p2p = new WormsP2PLink({
      onOpen: () => {
        // Wait for guest hello before firing guest_joined
      },
      onClose: () => {
        this.peerConnected = false;
        this.onMessage?.({ type: 'guest_left' });
      },
      onMessage: (msg) => {
        if (!msg) return;
        if (msg.__wproto === 'hello') {
          this.peerConnected = true;
          p2p.send({
            __wproto: 'welcome',
            code: this.roomCode,
            hostName: this._hostName,
            lobbyState: this._lobbyState,
          });
          this.onMessage?.({ type: 'guest_joined', guestName: msg.guestName || 'TEAM 2' });
          return;
        }
        this.onMessage?.(msg);
      },
    });

    this.p2p = p2p;
    const code = await p2p.startHost(fixedCode);
    this.role = 'host';
    this.roomCode = code;
    this.connected = true;
    this.peerConnected = false;
    const res = { type: 'room_created', code, hostName: this._hostName };
    this.onMessage?.(res);
    return res;
  }

  async joinRoom(code, guestName) {
    if (this._useWebSocketMode()) {
      await this._ensureSocket();
      return new Promise((resolve, reject) => {
        this._pendingResolver = { resolve, reject };
        this.send({ type: 'join_room', code, guestName });
      });
    }

    this.disconnect(true);
    const cleanCode = normalizeWormsCode(code);
    if (!cleanCode || cleanCode.length < 3) {
      throw new Error('Please enter a valid room code.');
    }

    return new Promise((resolve, reject) => {
      let settled = false;
      const fail = (err) => {
        if (settled) return;
        settled = true;
        if (this._guestTimer) {
          clearTimeout(this._guestTimer);
          this._guestTimer = null;
        }
        reject(err);
      };

      this._guestTimer = setTimeout(() => {
        fail(new Error('Could not find host room ' + cleanCode));
      }, 20000);

      const p2p = new WormsP2PLink({
        onOpen: () => {
          p2p.send({ __wproto: 'hello', guestName: guestName || 'TEAM 2' });
        },
        onClose: () => {
          const wasJoined = this.role === 'guest';
          this.role = 'none';
          this.roomCode = null;
          this.peerConnected = false;
          if (!settled) {
            fail(new Error('Connection closed by host'));
            return;
          }
          if (wasJoined) {
            this.onMessage?.({ type: 'room_closed' });
            this.onClose?.();
          }
        },
        onError: (err) => {
          fail(err instanceof Error ? err : new Error('Room error'));
        },
        onMessage: (msg) => {
          if (!msg) return;
          if (msg.__wproto === 'welcome') {
            if (!settled) {
              settled = true;
              if (this._guestTimer) {
                clearTimeout(this._guestTimer);
                this._guestTimer = null;
              }
              this.role = 'guest';
              this.roomCode = msg.code || cleanCode;
              this.connected = true;
              this.peerConnected = true;
              const res = {
                type: 'room_joined',
                code: this.roomCode,
                hostName: msg.hostName || 'TEAM 1',
                lobbyState: msg.lobbyState || null,
              };
              this.onMessage?.(res);
              resolve(res);
            }
            return;
          }
          if (msg.type === 'room_closed') {
            this.role = 'none';
            this.roomCode = null;
            this.peerConnected = false;
          }
          this.onMessage?.(msg);
        },
      });

      this.p2p = p2p;
      p2p.startGuest(cleanCode).catch(fail);
    });
  }

  send(msg) {
    if (msg && msg.type === 'lobby_state' && msg.lobbyState) {
      this._lobbyState = { ...msg.lobbyState };
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
      return true;
    }
    if (this.p2p && this.p2p.open) {
      const fast = Boolean(msg && msg.type === 'state');
      return this.p2p.send(msg, fast);
    }
    return false;
  }

  closeRoom() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: this.role === 'host' ? 'close_room' : 'leave_room' });
    }
    if (this.p2p) {
      if (this.role === 'host' && this.p2p.open) {
        this.p2p.send({ type: 'room_closed' }, false);
      }
      this.p2p.close(false);
      this.p2p = null;
    }
    this.role = 'none';
    this.roomCode = null;
    this.peerConnected = false;
    this.connected = false;
  }

  disconnect(silent = false) {
    if (this._guestTimer) {
      clearTimeout(this._guestTimer);
      this._guestTimer = null;
    }
    this.role = 'none';
    this.roomCode = null;
    this.peerConnected = false;
    this.connected = false;
    if (this.p2p) {
      this.p2p.close(silent);
      this.p2p = null;
    }
    if (this.ws) {
      const sock = this.ws;
      this.ws = null;
      if (silent) {
        sock.onclose = null;
        sock.onerror = null;
        sock.onmessage = null;
      }
      try {
        sock.close();
      } catch {
        // Ignore close errors
      }
    }
  }
}
