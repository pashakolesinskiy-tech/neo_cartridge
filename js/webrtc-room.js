/**
 * NEO-CARTRIDGE Universal Zero-Server WebRTC Room Engine
 * Multi-transport signaling:
 *  1) BroadcastChannel (0ms same-browser / localhost multi-tab + ICE-blocked local fallback)
 *  2) PeerJS cloud broker WebSocket (wss://0.peerjs.com)
 *  3) ntfy.sh WebSocket + HTTPS POST pub/sub (?since=15s)
 * Star topology: Host accepts up to maxPeers Guests over RTCDataChannel ('ctl' reliable + 'fast' unordered).
 */
(function (global) {
  'use strict';

  const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const DEFAULT_ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    {
      urls: [
        'turn:openrelay.metered.ca:80',
        'turn:openrelay.metered.ca:443',
        'turn:openrelay.metered.ca:443?transport=tcp'
      ],
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ];

  function randId(prefix) {
    const a = Math.random().toString(36).slice(2, 8);
    const b = Date.now().toString(36).slice(-4);
    return (prefix || 'p') + '_' + a + b;
  }

  function serializeSdp(desc) {
    return desc ? { type: desc.type, sdp: desc.sdp } : null;
  }

  function serializeIce(cand) {
    if (!cand) return null;
    if (typeof cand.toJSON === 'function') return cand.toJSON();
    return {
      candidate: cand.candidate,
      sdpMid: cand.sdpMid,
      sdpMLineIndex: cand.sdpMLineIndex,
      usernameFragment: cand.usernameFragment
    };
  }

  class NeoP2PRoom {
    constructor(opts) {
      opts = opts || {};
      this.namespace = String(opts.namespace || 'neo').toLowerCase().replace(/[^a-z0-9_-]/g, '');
      this.maxPeers = Math.max(1, Number(opts.maxPeers || 1));
      this.codeLength = Math.max(4, Math.min(10, Number(opts.codeLength || 6)));
      this.iceServers = opts.iceServers || DEFAULT_ICE_SERVERS;
      this.peerMeta = opts.peerMeta && typeof opts.peerMeta === 'object' ? { ...opts.peerMeta } : {};

      this.onStatus = typeof opts.onStatus === 'function' ? opts.onStatus : function () {};
      this.onPeerOpen = typeof opts.onPeerOpen === 'function' ? opts.onPeerOpen : function () {};
      this.onPeerClose = typeof opts.onPeerClose === 'function' ? opts.onPeerClose : function () {};
      this.onMessage = typeof opts.onMessage === 'function' ? opts.onMessage : function () {};
      this.onError = typeof opts.onError === 'function' ? opts.onError : function () {};

      this.myId = randId('np');
      this.role = null; // 'host' | 'guest'
      this.code = '';
      this.closed = false;

      this.peers = new Map();
      this._peerJsIds = new Map(); // peerId -> senderPeerJsId for targeted replies
      this._seenSignals = new Set();
      this._outSeq = 1;

      this._bc = null;
      this._peerWs = null;
      this._peerWsOpen = false;
      this._peerJsSelfId = '';
      this._peerWsQueue = [];
      this._peerHeartbeat = null;
      this._ntfyWs = null;
      this._ntfyTopic = '';
      this._ntfyTimers = new Set();
      this._ntfyRateLimitedUntil = 0;
      this._lastNtfyJoinAt = 0;
      this._joinRetryTimer = null;
      this._reconnectTimer = null;
      this._hostId = null;

      this._peerRetryCount = 0;
      this._peerReconnectTimer = null;
      this._ntfyReconnectTimer = null;
      this._lifecycleBound = false;
      this._unloadBound = false;
      this._boundUnload = () => this._sendByeAll();
      this._boundResume = () => this._resumeSignaling();
      this._boundVisibility = () => {
        if (!global.document || !global.document.hidden) this._resumeSignaling();
      };
      this._bindUnloadListeners();
    }

    _bindUnloadListeners() {
      if (this._unloadBound || typeof global.addEventListener !== 'function') return;
      this._unloadBound = true;
      global.addEventListener('beforeunload', this._boundUnload);
      global.addEventListener('pagehide', this._boundUnload);
    }

    _bindLifecycleListeners() {
      if (this._lifecycleBound || typeof global.addEventListener !== 'function') return;
      this._lifecycleBound = true;
      global.addEventListener('online', this._boundResume);
      global.addEventListener('pageshow', this._boundResume);
      global.addEventListener('focus', this._boundResume);
      if (global.document) global.document.addEventListener('visibilitychange', this._boundVisibility);
    }

    _unbindLifecycleListeners() {
      if (!this._lifecycleBound) return;
      this._lifecycleBound = false;
      global.removeEventListener('online', this._boundResume);
      global.removeEventListener('pageshow', this._boundResume);
      global.removeEventListener('focus', this._boundResume);
      if (global.document) global.document.removeEventListener('visibilitychange', this._boundVisibility);
    }

    _resumeSignaling() {
      if (this.closed || !this.code || !this.role) return;
      this._bindLifecycleListeners();
      const wsState = (ws) => ws ? ws.readyState : -1;
      if (wsState(this._peerWs) !== WebSocket.OPEN && wsState(this._peerWs) !== WebSocket.CONNECTING) {
        this._setupPeerJsSocket();
      }
      if (wsState(this._ntfyWs) !== WebSocket.OPEN && wsState(this._ntfyWs) !== WebSocket.CONNECTING) {
        this._setupNtfySocket();
      }
      if (this.role === 'host') {
        this._broadcastSignal({ sig: 'host_ready', from: this.myId, to: '*', meta: this.peerMeta });
      } else if (this.role === 'guest' && this.getConnectedPeerIds().length === 0) {
        this._broadcastSignal({ sig: 'join', from: this.myId, to: '*', meta: this.peerMeta });
      }
    }

    static generateCode(length) {
      const len = Math.max(4, Math.min(10, Number(length || 6)));
      let out = '';
      for (let i = 0; i < len; i++) {
        out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
      }
      return out;
    }

    static normalizeCode(raw) {
      return String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    static async copyText(text) {
      const str = String(text || '');
      try {
        if (global.navigator && global.navigator.clipboard && global.isSecureContext) {
          await global.navigator.clipboard.writeText(str);
          return true;
        }
      } catch (_) {}
      try {
        const ta = global.document.createElement('textarea');
        ta.value = str;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-9999px';
        ta.style.left = '-9999px';
        global.document.body.appendChild(ta);
        ta.select();
        const ok = global.document.execCommand('copy');
        global.document.body.removeChild(ta);
        if (ok) return true;
      } catch (_) {}
      return false;
    }

    async host(codeOrOpts) {
      let desiredCode = '';
      if (typeof codeOrOpts === 'string') {
        desiredCode = codeOrOpts;
      } else if (codeOrOpts && typeof codeOrOpts === 'object') {
        desiredCode = codeOrOpts.code || '';
        if (codeOrOpts.meta) this.peerMeta = { ...this.peerMeta, ...codeOrOpts.meta };
      }
      const clean = NeoP2PRoom.normalizeCode(desiredCode) || NeoP2PRoom.generateCode(this.codeLength);
      this._resetRuntime();
      this.role = 'host';
      this.code = clean;
      this.closed = false;
      this._peerRetryCount = 0;
      this._bindUnloadListeners();
      this._bindLifecycleListeners();
      this._emitStatus('hosting', { code: clean });
      this._startSignaling();
      this._broadcastSignal({
        sig: 'host_ready',
        from: this.myId,
        to: '*',
        meta: this.peerMeta
      });
      return clean;
    }

    async join(code, meta) {
      const clean = NeoP2PRoom.normalizeCode(code);
      if (!clean || clean.length < 3) {
        const err = { code: 'invalid_code', message: 'Неверный код комнаты' };
        this.onError(err);
        throw new Error(err.message);
      }
      if (meta && typeof meta === 'object') {
        this.peerMeta = { ...this.peerMeta, ...meta };
      }
      this._resetRuntime();
      this.role = 'guest';
      this.code = clean;
      this.closed = false;
      this._peerRetryCount = 0;
      this._bindUnloadListeners();
      this._bindLifecycleListeners();
      this._emitStatus('connecting', { code: clean });
      this._startSignaling();

      const sendJoin = () => {
        if (this.closed || this.role !== 'guest') return;
        const connected = this.getConnectedPeerIds().length > 0;
        if (connected) return;
        this._broadcastSignal({
          sig: 'join',
          from: this.myId,
          to: '*',
          meta: this.peerMeta
        });
      };

      sendJoin();
      let tries = 0;
      this._joinRetryTimer = global.setInterval(() => {
        tries++;
        if (this.closed || this.getConnectedPeerIds().length > 0) {
          global.clearInterval(this._joinRetryTimer);
          this._joinRetryTimer = null;
          return;
        }
        if (tries > 40) {
          global.clearInterval(this._joinRetryTimer);
          this._joinRetryTimer = null;
          this._emitStatus('timeout', { code: this.code });
          this.onError({ code: 'timeout', message: 'Таймаут подключения к хосту' });
          return;
        }
        sendJoin();
      }, 1100);

      return clean;
    }

    setMeta(meta) {
      if (meta && typeof meta === 'object') {
        this.peerMeta = { ...this.peerMeta, ...meta };
      }
    }

    getConnectedPeerIds() {
      const ids = [];
      for (const [id, p] of this.peers.entries()) {
        if (p.open) ids.push(id);
      }
      return ids;
    }

    getPeerMeta(peerId) {
      const p = this.peers.get(peerId);
      return p ? { ...(p.meta || {}) } : {};
    }

    getConnectionMode() {
      let hasDc = false;
      let hasBc = false;
      for (const p of this.peers.values()) {
        if (!p.open) continue;
        if (p.ctl && p.ctl.readyState === 'open') hasDc = true;
        else if (p.bcFallback) hasBc = true;
      }
      if (hasDc) return 'webrtc';
      if (hasBc) return 'local';
      return 'signaling';
    }

    send(payload, opts) {
      if (this.closed) return false;
      opts = opts || {};
      const targetId = opts.to || null;
      const useFast = !!opts.fast;
      let sent = 0;
      for (const [peerId, p] of this.peers.entries()) {
        if (targetId && peerId !== targetId) continue;
        if (!p.open) continue;
        if (this._sendToPeer(p, payload, useFast)) sent++;
      }
      return sent > 0;
    }

    broadcastExcept(excludePeerId, payload, opts) {
      if (this.closed) return false;
      opts = opts || {};
      const useFast = !!opts.fast;
      let sent = 0;
      for (const [peerId, p] of this.peers.entries()) {
        if (peerId === excludePeerId || !p.open) continue;
        if (this._sendToPeer(p, payload, useFast)) sent++;
      }
      return sent > 0;
    }

    close() {
      if (this.closed) return;
      this._sendByeAll();
      this.closed = true;
      this._resetRuntime();
      if (typeof global.removeEventListener === 'function') {
        global.removeEventListener('beforeunload', this._boundUnload);
        global.removeEventListener('pagehide', this._boundUnload);
        this._unloadBound = false;
      }
      this._unbindLifecycleListeners();
      this._emitStatus('closed', { code: this.code });
    }

    _sendByeAll() {
      try {
        for (const p of this.peers.values()) {
          if (p.open) {
            this._sendToPeer(p, { __np2pSys: 'bye' }, false);
          }
        }
        if (this.code && !this.closed) {
          this._broadcastSignal({ sig: 'bye', from: this.myId, to: '*' });
        }
      } catch (_) {}
    }

    _resetRuntime() {
      if (this._joinRetryTimer) {
        global.clearInterval(this._joinRetryTimer);
        this._joinRetryTimer = null;
      }
      if (this._peerHeartbeat) {
        global.clearInterval(this._peerHeartbeat);
        this._peerHeartbeat = null;
      }
      if (this._reconnectTimer) {
        global.clearTimeout(this._reconnectTimer);
        this._reconnectTimer = null;
      }
      if (this._peerReconnectTimer) {
        global.clearTimeout(this._peerReconnectTimer);
        this._peerReconnectTimer = null;
      }
      if (this._ntfyReconnectTimer) {
        global.clearTimeout(this._ntfyReconnectTimer);
        this._ntfyReconnectTimer = null;
      }
      for (const tid of this._ntfyTimers) {
        global.clearTimeout(tid);
      }
      this._ntfyTimers.clear();
      this._lastNtfyJoinAt = 0;
      for (const peerId of Array.from(this.peers.keys())) {
        this._destroyPeer(peerId, 'reset', true);
      }
      this.peers.clear();
      this._peerJsIds.clear();
      this._seenSignals.clear();
      this._peerWsQueue = [];
      this._peerWsOpen = false;
      this._hostId = null;

      if (this._bc) {
        try { this._bc.close(); } catch (_) {}
        this._bc = null;
      }
      if (this._peerWs) {
        try { this._peerWs.onclose = null; this._peerWs.close(); } catch (_) {}
        this._peerWs = null;
      }
      if (this._ntfyWs) {
        try { this._ntfyWs.onclose = null; this._ntfyWs.close(); } catch (_) {}
        this._ntfyWs = null;
      }
    }

    _emitStatus(status, detail) {
      try {
        this.onStatus(status, detail || {});
      } catch (_) {}
    }

    _sendToPeer(peer, payload, useFast) {
      const seq = this._outSeq++;
      const envelope = JSON.stringify({ __np2p: 1, q: seq, d: payload });

      // Prefer real WebRTC DataChannels whenever open
      if (useFast && peer.fast && peer.fast.readyState === 'open') {
        try {
          if (peer.fast.bufferedAmount < 262144) {
            peer.fast.send(envelope);
            return true;
          }
        } catch (_) {}
      }
      if (peer.ctl && peer.ctl.readyState === 'open') {
        try {
          peer.ctl.send(envelope);
          return true;
        } catch (_) {}
      }
      // Fallback ONLY when same-browser BroadcastChannel fallback is active
      if (peer.bcFallback && this._bc) {
        try {
          this._bc.postMessage({
            __np2pData: 1,
            from: this.myId,
            to: peer.id,
            raw: envelope
          });
          return true;
        } catch (_) {}
      }
      return false;
    }

    _handleWirePayload(peer, rawText) {
      if (typeof rawText !== 'string') return;
      let frame;
      try {
        frame = JSON.parse(rawText);
      } catch (_) {
        return;
      }
      if (!frame || frame.__np2p !== 1) return;
      const q = frame.q;
      if (typeof q === 'number') {
        if (peer.seenSeqs.has(q)) return;
        peer.seenSeqs.add(q);
        if (peer.seenSeqs.size > 600) {
          const it = peer.seenSeqs.values();
          for (let i = 0; i < 150; i++) {
            const nxt = it.next();
            if (nxt.done) break;
            peer.seenSeqs.delete(nxt.value);
          }
        }
      }
      const d = frame.d;
      if (d && d.__np2pSys === 'bye') {
        this._handlePeerDisconnect(peer.id, 'bye');
        return;
      }
      if (d && d.__np2pSys === 'ping') return;
      try {
        this.onMessage(d, peer.id);
      } catch (err) {
        console.error('[NeoP2PRoom] onMessage error:', err);
      }
    }

    // --- Multi-transport Signaling ---
    _startSignaling() {
      const chName = 'neo-sig:' + this.namespace + ':' + this.code;
      if (typeof global.BroadcastChannel === 'function') {
        try {
          this._bc = new global.BroadcastChannel(chName);
          this._bc.onmessage = (ev) => {
            const msg = ev && ev.data;
            if (!msg) return;
            if (msg.__np2pData === 1) {
              if (msg.from === this.myId) return;
              if (msg.to && msg.to !== this.myId) return;
              const p = this.peers.get(msg.from);
              if (p) this._handleWirePayload(p, msg.raw);
              return;
            }
            this._onSignal(msg, 'bc');
          };
        } catch (_) {}
      }

      this._setupPeerJsSocket();
      this._setupNtfySocket();
    }

    _hostPeerJsId() {
      return 'np2p_' + this.namespace + '_' + this.code + '_h';
    }

    _setupPeerJsSocket() {
      if (this.closed || !this.code) return;
      if (this._peerWs && (this._peerWs.readyState === WebSocket.OPEN || this._peerWs.readyState === WebSocket.CONNECTING)) return;
      try {
        const selfId =
          this.role === 'host'
            ? this._hostPeerJsId()
            : 'np2p_' + this.namespace + '_' + this.code + '_' + this.myId;
        this._peerJsSelfId = selfId;
        const token = Math.random().toString(36).slice(2, 10);
        const url =
          'wss://0.peerjs.com/peerjs?key=peerjs&id=' +
          encodeURIComponent(selfId) +
          '&token=' +
          encodeURIComponent(token);
        const ws = new WebSocket(url);
        this._peerWs = ws;
        this._peerWsOpen = false;

        ws.onopen = () => {
          this._peerRetryCount = 0;
          if (this._peerHeartbeat) global.clearInterval(this._peerHeartbeat);
          this._peerHeartbeat = global.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              try { ws.send(JSON.stringify({ type: 'HEARTBEAT' })); } catch (_) {}
            }
          }, 15000);
        };

        ws.onmessage = (ev) => {
          let pkt;
          try { pkt = JSON.parse(ev.data); } catch (_) { return; }
          if (!pkt) return;
          if (pkt.type === 'OPEN') {
            this._peerWsOpen = true;
            while (this._peerWsQueue.length > 0 && ws.readyState === WebSocket.OPEN) {
              const item = this._peerWsQueue.shift();
              try { ws.send(JSON.stringify(item)); } catch (_) {}
            }
          } else if (pkt.payload && typeof pkt.payload === 'object') {
            if (pkt.src && pkt.payload.from) {
              this._peerJsIds.set(pkt.payload.from, pkt.src);
            }
            this._onSignal(pkt.payload, 'peerjs');
          }
        };

        ws.onerror = () => {};
        ws.onclose = () => {
          if (this._peerWs === ws) this._peerWs = null;
          this._peerWsOpen = false;
          if (this._peerHeartbeat) {
            global.clearInterval(this._peerHeartbeat);
            this._peerHeartbeat = null;
          }
          if (!this.closed && !this._peerReconnectTimer) {
            const delay = Math.min(30000, 1500 * Math.pow(2, Math.min(this._peerRetryCount || 0, 5)));
            this._peerRetryCount = (this._peerRetryCount || 0) + 1;
            this._peerReconnectTimer = global.setTimeout(() => {
              this._peerReconnectTimer = null;
              if (!this.closed) this._setupPeerJsSocket();
            }, delay);
          }
        };
      } catch (_) {}
    }

    _setupNtfySocket() {
      if (this.closed || !this.code) return;
      if (this._ntfyWs && (this._ntfyWs.readyState === WebSocket.OPEN || this._ntfyWs.readyState === WebSocket.CONNECTING)) return;
      try {
        this._ntfyTopic = 'np2p-' + this.namespace + '-' + this.code.toLowerCase();
        const wsUrl = 'wss://ntfy.sh/' + encodeURIComponent(this._ntfyTopic) + '/ws?since=15s';
        const ws = new WebSocket(wsUrl);
        this._ntfyWs = ws;

        ws.onmessage = (ev) => {
          const lines = String(ev.data || '').split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const row = JSON.parse(line);
              if (row && row.event === 'message' && typeof row.message === 'string') {
                const sig = JSON.parse(row.message);
                this._onSignal(sig, 'ntfy');
              }
            } catch (_) {}
          }
        };

        ws.onerror = () => {};
        ws.onclose = () => {
          if (this._ntfyWs === ws) this._ntfyWs = null;
          const needMorePeers = this.role === 'host'
            ? this.getConnectedPeerIds().length < this.maxPeers
            : this.getConnectedPeerIds().length === 0;
          if (!this.closed && needMorePeers && !this._ntfyReconnectTimer) {
            this._ntfyReconnectTimer = global.setTimeout(() => {
              this._ntfyReconnectTimer = null;
              if (!this.closed) this._setupNtfySocket();
            }, 2500);
          }
        };
      } catch (_) {}
    }

    _broadcastSignal(sigObj, peerForSdp) {
      if (this.closed || !this.code) return;
      const msg = Object.assign(
        {
          sid: randId('sg'),
          room: this.code,
          ns: this.namespace,
          ts: Date.now()
        },
        sigObj
      );

      // 1) BroadcastChannel (0ms same-browser; plain JSON objects only)
      if (this._bc) {
        try {
          this._bc.postMessage(msg);
        } catch (_) {}
      }

      // 2) PeerJS targeted WebSocket relay
      const targetPeerJs =
        msg.to && msg.to !== '*'
          ? (this._peerJsIds.get(msg.to) || (this.role === 'guest' ? this._hostPeerJsId() : null))
          : this.role === 'guest'
            ? this._hostPeerJsId()
            : null;

      if (targetPeerJs && this._peerWs) {
        const envelope = { type: 'CANDIDATE', dst: targetPeerJs, payload: msg };
        if (this._peerWs.readyState === WebSocket.OPEN && this._peerWsOpen) {
          try { this._peerWs.send(JSON.stringify(envelope)); } catch (_) {}
        } else if (this._peerWs.readyState === WebSocket.CONNECTING || !this._peerWsOpen) {
          if (this._peerWsQueue.length < 48) this._peerWsQueue.push(envelope);
        }
      }

      // 3) Delayed ntfy.sh HTTP POST fallback (cross-device; includes ice when PeerJS WS is unavailable)
      const needsNtfy =
        msg.sig === 'join' ||
        msg.sig === 'offer' ||
        msg.sig === 'answer' ||
        (msg.sig === 'ice');
      if (needsNtfy && this._ntfyTopic && Date.now() >= this._ntfyRateLimitedUntil) {
        const delayMs = msg.sig === 'offer' || msg.sig === 'answer' ? 1400 : 650;
        const tid = global.setTimeout(() => {
          this._ntfyTimers.delete(tid);
          if (this.closed || !this._ntfyTopic || Date.now() < this._ntfyRateLimitedUntil) return;
          if (msg.sig === 'join') {
            if (this.getConnectedPeerIds().length > 0) return;
            for (const p of this.peers.values()) {
              if (p.viaBc || p.open) return;
            }
            if (Date.now() - this._lastNtfyJoinAt < 3500) return;
            this._lastNtfyJoinAt = Date.now();
          } else {
            const pTarget = peerForSdp || (msg.to && this.peers.get(msg.to));
            if (pTarget && (pTarget.open || pTarget.viaBc)) return;
            if (peerForSdp && peerForSdp.pc && peerForSdp.pc.localDescription) {
              msg.sdp = serializeSdp(peerForSdp.pc.localDescription);
            }
          }
          try {
            global.fetch('https://ntfy.sh/' + encodeURIComponent(this._ntfyTopic), {
              method: 'POST',
              body: JSON.stringify(msg),
              keepalive: true
            }).then((res) => {
              if (res && res.status === 429) {
                this._ntfyRateLimitedUntil = Date.now() + 60000;
              }
            }).catch(() => {});
          } catch (_) {}
        }, delayMs);
        this._ntfyTimers.add(tid);
      }
    }

    _onSignal(msg, via) {
      if (this.closed || !msg || typeof msg !== 'object') return;
      if (msg.ns !== this.namespace || msg.room !== this.code) return;
      if (!msg.from || msg.from === this.myId) return;
      if (msg.to && msg.to !== '*' && msg.to !== this.myId) return;

      // Ignore obviously ancient cached messages if clock-reasonable (> 5 min), otherwise accept to tolerate clock skew
      if (msg.ts && Math.abs(Date.now() - msg.ts) > 300000 && msg.sig !== 'host_ready') return;

      // Re-allow periodic join retries on dedup by including unique sid, deduplicate identical sid across transports
      if (msg.sid) {
        if (this._seenSignals.has(msg.sid)) return;
        this._seenSignals.add(msg.sid);
        if (this._seenSignals.size > 800) {
          const it = this._seenSignals.values();
          for (let i = 0; i < 200; i++) {
            const nxt = it.next();
            if (nxt.done) break;
            this._seenSignals.delete(nxt.value);
          }
        }
      }

      if (msg.sig === 'bye') {
        if (this.peers.has(msg.from)) {
          this._handlePeerDisconnect(msg.from, 'bye');
        }
        return;
      }

      if (this.role === 'host') {
        this._handleHostSignal(msg, via);
      } else if (this.role === 'guest') {
        this._handleGuestSignal(msg, via);
      }
    }

    _pruneDeadPeers() {
      const now = Date.now();
      for (const [id, p] of Array.from(this.peers.entries())) {
        const st = p.pc ? p.pc.iceConnectionState : 'closed';
        const deadIce = !p.bcFallback && (st === 'failed' || st === 'closed');
        const stalePending = !p.open && now - p.createdAt > 12000;
        if (deadIce || stalePending) {
          this._destroyPeer(id, 'stale', true);
        }
      }
    }

    async _handleHostSignal(msg, via) {
      if (msg.sig === 'join') {
        this._pruneDeadPeers();
        const existing = this.peers.get(msg.from);
        if (!existing) {
          if (this.peers.size >= this.maxPeers) {
            this._broadcastSignal({
              sig: 'full',
              from: this.myId,
              to: msg.from
            });
            return;
          }
          const peer = this._createPeerRecord(msg.from, msg.meta || {}, via === 'bc');
          this._scheduleBcFallback(peer);
          await this._sendHostOffer(peer);
        } else {
          if (via === 'bc') existing.viaBc = true;
          if (!existing.open && Date.now() - existing.lastOfferAt > 1400) {
            await this._sendHostOffer(existing);
          }
        }
        return;
      }

      const peer = this.peers.get(msg.from);
      if (!peer) return;
      if (msg.meta) peer.meta = { ...peer.meta, ...msg.meta };
      if (via === 'bc') peer.viaBc = true;

      if (msg.sig === 'answer' && msg.sdp) {
        peer.handshakeSeen = true;
        if (peer.offerId && msg.offerId && msg.offerId !== peer.offerId) return;
        if (peer.pc.signalingState === 'have-local-offer') {
          try {
            await peer.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            await this._drainIce(peer);
          } catch (_) {}
        }
      } else if (msg.sig === 'ice' && msg.cand) {
        await this._addIce(peer, msg.cand);
      }
    }

    async _handleGuestSignal(msg, via) {
      if (msg.sig === 'host_ready') {
        if (this.getConnectedPeerIds().length === 0) {
          this._broadcastSignal({
            sig: 'join',
            from: this.myId,
            to: msg.from,
            meta: this.peerMeta
          });
        }
        return;
      }

      if (msg.sig === 'full') {
        if (this._joinRetryTimer) {
          global.clearInterval(this._joinRetryTimer);
          this._joinRetryTimer = null;
        }
        this._emitStatus('full', { code: this.code });
        this.onError({ code: 'room_full', message: 'Комната переполнена' });
        return;
      }

      if (msg.sig === 'offer' && msg.sdp) {
        if (this._hostId && this._hostId !== msg.from) {
          const oldHost = this.peers.get(this._hostId);
          if (oldHost && oldHost.open) return; // Already connected to another host instance
          this._destroyPeer(this._hostId, 'replaced', true);
        }
        this._hostId = msg.from;
        let peer = this.peers.get(msg.from);
        if (!peer) {
          peer = this._createPeerRecord(msg.from, msg.meta || {}, via === 'bc');
          peer.handshakeSeen = true;
          this._scheduleBcFallback(peer);
        } else {
          if (via === 'bc') peer.viaBc = true;
          peer.handshakeSeen = true;
          if (msg.meta) peer.meta = { ...peer.meta, ...msg.meta };
        }
        if (peer.seenOfferIds.has(msg.offerId)) {
          // A repeated offer may be the signaling fallback retry; resend the
          // already-created answer instead of silently dropping the retry.
          if (peer.pc.signalingState === 'stable' &&
              peer.pc.localDescription &&
              peer.pc.localDescription.type === 'answer') {
            this._broadcastSignal({
              sig: 'answer',
              from: this.myId,
              to: peer.id,
              offerId: msg.offerId,
              sdp: serializeSdp(peer.pc.localDescription),
              meta: this.peerMeta
            }, peer);
            return;
          }
        }
        peer.seenOfferIds.add(msg.offerId);

        try {
          if (peer.pc.signalingState !== 'stable') {
            await Promise.all([
              peer.pc.setLocalDescription({ type: 'rollback' }),
              peer.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            ]).catch(async () => {
              await peer.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            });
          } else {
            await peer.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          }
          await this._drainIce(peer);
          const ans = await peer.pc.createAnswer();
          await peer.pc.setLocalDescription(ans);
          this._broadcastSignal({
            sig: 'answer',
            from: this.myId,
            to: peer.id,
            offerId: msg.offerId,
            sdp: serializeSdp(peer.pc.localDescription),
            meta: this.peerMeta
          }, peer);
        } catch (err) {
          console.warn('[NeoP2PRoom] Guest offer/answer error:', err);
        }
        return;
      }

      const peer = this.peers.get(msg.from);
      if (!peer) return;
      if (via === 'bc') peer.viaBc = true;
      if (msg.sig === 'ice' && msg.cand) {
        await this._addIce(peer, msg.cand);
      }
    }

    _createPeerRecord(peerId, meta, viaBc) {
      const pc = new RTCPeerConnection({ iceServers: this.iceServers });
      const peer = {
        id: peerId,
        meta: meta || {},
        pc: pc,
        ctl: null,
        fast: null,
        open: false,
        bcFallback: false,
        handshakeSeen: false,
        bcTimer: null,
        keepaliveTimer: null,
        viaBc: !!viaBc,
        createdAt: Date.now(),
        lastOfferAt: 0,
        offerId: '',
        seenOfferIds: new Set(),
        pendingIce: [],
        seenSeqs: new Set()
      };
      this.peers.set(peerId, peer);

      // Negotiated pre-attached DataChannels on BOTH Host & Guest eliminate ondatachannel timing races
      try {
        const ctl = pc.createDataChannel('ctl', { negotiated: true, id: 0, ordered: true });
        this._attachChannel(peer, ctl);
        const fast = pc.createDataChannel('fast', { negotiated: true, id: 1, ordered: false, maxRetransmits: 0 });
        this._attachChannel(peer, fast);
      } catch (err) {
        console.warn('[NeoP2PRoom] createDataChannel failed:', err);
      }

      pc.onicecandidate = (ev) => {
        if (ev.candidate) {
          this._broadcastSignal({
            sig: 'ice',
            from: this.myId,
            to: peerId,
            cand: serializeIce(ev.candidate)
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        const st = pc.iceConnectionState;
        if (st === 'failed' || st === 'closed') {
          if (peer.viaBc && peer.handshakeSeen && !this.closed) {
            this._activateBcFallback(peer);
          } else if (peer.open) {
            this._handlePeerDisconnect(peerId, st);
          }
        } else if (st === 'disconnected') {
          global.setTimeout(() => {
            if (!this.closed && peer.pc === pc && pc.iceConnectionState === 'disconnected') {
              if (!peer.bcFallback && (!peer.ctl || peer.ctl.readyState !== 'open')) {
                this._handlePeerDisconnect(peerId, 'disconnected');
              }
            }
          }, 3500);
        }
      };

      return peer;
    }

    _attachChannel(peer, dc) {
      if (!dc) return;
      if (dc.label === 'fast') {
        peer.fast = dc;
      } else {
        peer.ctl = dc;
      }
      dc.onmessage = (ev) => this._handleWirePayload(peer, ev.data);
      dc.onopen = () => {
        if (dc.label !== 'fast') {
          this._markPeerOpen(peer);
        }
      };
      dc.onclose = () => {
        if (dc.label !== 'fast' && peer.open && !peer.bcFallback) {
          this._handlePeerDisconnect(peer.id, 'channel_closed');
        }
      };
      if (dc.readyState === 'open' && dc.label !== 'fast') {
        this._markPeerOpen(peer);
      }
    }

    _scheduleBcFallback(peer) {
      if (peer.bcTimer) global.clearTimeout(peer.bcTimer);
      peer.bcTimer = global.setTimeout(() => {
        if (this.closed || this.peers.get(peer.id) !== peer) return;
        if (!peer.open && peer.viaBc && peer.handshakeSeen) {
          this._activateBcFallback(peer);
        }
      }, 1500);
    }

    _activateBcFallback(peer) {
      if (!peer.viaBc || !peer.handshakeSeen || this.closed) return;
      peer.bcFallback = true;
      this._markPeerOpen(peer);
    }

    _markPeerOpen(peer) {
      if (peer.bcTimer) {
        global.clearTimeout(peer.bcTimer);
        peer.bcTimer = null;
      }
      if (peer.open) return;
      peer.open = true;
      if (this.role === 'guest' || this.getConnectedPeerIds().length >= this.maxPeers) {
        for (const tid of this._ntfyTimers) global.clearTimeout(tid);
        this._ntfyTimers.clear();
      }
      if (this._joinRetryTimer && this.role === 'guest') {
        global.clearInterval(this._joinRetryTimer);
        this._joinRetryTimer = null;
      }
      if (!peer.keepaliveTimer) {
        peer.keepaliveTimer = global.setInterval(() => {
          if (!this.closed && peer.open) {
            this._sendToPeer(peer, { __np2pSys: 'ping' }, false);
          }
        }, 5000);
      }
      this._emitStatus('connected', {
        code: this.code,
        peerId: peer.id,
        mode: this.getConnectionMode()
      });
      try {
        this.onPeerOpen(peer.id, { ...(peer.meta || {}) });
      } catch (err) {
        console.error('[NeoP2PRoom] onPeerOpen error:', err);
      }
    }

    _handlePeerDisconnect(peerId, reason) {
      const peer = this.peers.get(peerId);
      if (!peer) return;
      const wasOpen = peer.open;
      this._destroyPeer(peerId, reason, false);
      if (wasOpen) {
        try {
          this.onPeerClose(peerId, reason);
        } catch (err) {
          console.error('[NeoP2PRoom] onPeerClose error:', err);
        }
      }
      if (!this.closed && this.getConnectedPeerIds().length === 0) {
        this._emitStatus(this.role === 'host' ? 'hosting' : 'disconnected', {
          code: this.code,
          reason
        });
      }
    }

    _destroyPeer(peerId, _reason, _silent) {
      const p = this.peers.get(peerId);
      if (!p) return;
      this.peers.delete(peerId);
      if (p.bcTimer) {
        global.clearTimeout(p.bcTimer);
        p.bcTimer = null;
      }
      if (p.keepaliveTimer) {
        global.clearInterval(p.keepaliveTimer);
        p.keepaliveTimer = null;
      }
      try { if (p.ctl) { p.ctl.onclose = null; p.ctl.close(); } } catch (_) {}
      try { if (p.fast) { p.fast.onclose = null; p.fast.close(); } } catch (_) {}
      try { if (p.pc) { p.pc.oniceconnectionstatechange = null; p.pc.close(); } } catch (_) {}
    }

    async _sendHostOffer(peer) {
      try {
        peer.lastOfferAt = Date.now();
        if (!peer.pc.localDescription || peer.pc.signalingState === 'stable') {
          peer.offerId = randId('of');
          const offer = await peer.pc.createOffer();
          await peer.pc.setLocalDescription(offer);
        }
        this._broadcastSignal({
          sig: 'offer',
          from: this.myId,
          to: peer.id,
          offerId: peer.offerId,
          sdp: serializeSdp(peer.pc.localDescription),
          meta: this.peerMeta
        }, peer);
      } catch (err) {
        console.warn('[NeoP2PRoom] Host createOffer failed:', err);
      }
    }

    async _addIce(peer, cand) {
      if (!peer.pc) return;
      if (peer.pc.remoteDescription && peer.pc.remoteDescription.type) {
        try {
          await peer.pc.addIceCandidate(new RTCIceCandidate(cand));
        } catch (_) {}
      } else {
        peer.pendingIce.push(cand);
      }
    }

    async _drainIce(peer) {
      const list = peer.pendingIce.splice(0, peer.pendingIce.length);
      for (const c of list) {
        try {
          await peer.pc.addIceCandidate(new RTCIceCandidate(c));
        } catch (_) {}
      }
    }
  }

  global.NeoP2PRoom = NeoP2PRoom;
})(typeof window !== 'undefined' ? window : globalThis);
