export class OnlineClient {
  constructor(handlers = {}) {
    this.ws = null;
    this.serverUrl = null;
    this.role = 'none'; // 'none' | 'host' | 'guest'
    this.roomCode = null;
    this.connected = false;
    this.peerConnected = false;
    this.onMessage = handlers.onMessage || null;
    this.onClose = handlers.onClose || null;
    this.onError = handlers.onError || null;
    this._pendingResolver = null;
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

  async createRoom(hostName, lobbyState) {
    await this._ensureSocket();
    return new Promise((resolve, reject) => {
      this._pendingResolver = { resolve, reject };
      this.send({ type: 'create_room', hostName, lobbyState });
    });
  }

  async joinRoom(code, guestName) {
    await this._ensureSocket();
    return new Promise((resolve, reject) => {
      this._pendingResolver = { resolve, reject };
      this.send({ type: 'join_room', code, guestName });
    });
  }

  send(msg) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(msg));
    return true;
  }

  closeRoom() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: this.role === 'host' ? 'close_room' : 'leave_room' });
    }
    this.role = 'none';
    this.roomCode = null;
    this.peerConnected = false;
  }

  disconnect(silent = false) {
    this.role = 'none';
    this.roomCode = null;
    this.peerConnected = false;
    this.connected = false;
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
