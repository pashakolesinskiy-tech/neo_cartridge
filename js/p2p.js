/**
 * NEO-CARTRIDGE // Универсальный Zero-Server Лаунчер Онлайн-Комнат (WebRTC P2P)
 * Генерирует полноценные ссылки-приглашения и коды комнат для активного картриджа
 * без обрезки SDP и без промежуточного сервера.
 */

const P2P = {
  roomCode: '',
  selectedGame: 'stick_fighting',
  _copyResetTimer: null,
  _roomRegistryKey: 'neo_p2p_room_games',
  _bc: null,

  _readRegistry() {
    const now = Date.now();
    try {
      const raw = JSON.parse(localStorage.getItem(this._roomRegistryKey) || '{}');
      const cleaned = {};
      for (const [code, rec] of Object.entries(raw || {})) {
        if (rec && typeof rec.gameId === 'string' && (!rec.ts || now - rec.ts < 86400000)) {
          cleaned[code] = rec;
        }
      }
      return cleaned;
    } catch {
      return {};
    }
  },

  _registerRoomGame(code, gameId) {
    if (!code || !gameId || !this.GAME_ROUTES[gameId]) return;
    const clean = window.NeoP2PRoom ? NeoP2PRoom.normalizeCode(code) : String(code).toUpperCase();
    const reg = this._readRegistry();
    reg[clean] = { gameId, ts: Date.now() };
    try {
      localStorage.setItem(this._roomRegistryKey, JSON.stringify(reg));
    } catch {}
    try {
      this._bc?.postMessage({ type: 'room_created', code: clean, gameId });
    } catch {}
  },

  _lookupRoomGame(code) {
    const clean = window.NeoP2PRoom ? NeoP2PRoom.normalizeCode(code) : String(code || '').toUpperCase();
    const rec = this._readRegistry()[clean];
    return rec && this.GAME_ROUTES[rec.gameId] ? rec.gameId : null;
  },

  GAME_ROUTES: {
    stick_fighting: {
      label: 'STICK FIGHTING (1v1)',
      file: 'games/stick_fighting.html',
      guestQuery: (code) => `?join=${code}`,
      hostQuery: (code) => `?host=${code}`
    },
    pixel_drift: {
      label: 'PIXEL DRIFT GP (до 4 игроков)',
      file: 'games/pixel_drift.html',
      guestQuery: (code) => `?room=${code}`,
      hostQuery: (code) => `?host=${code}`
    },
    chrono_blade: {
      label: 'CHRONO BLADE (Дуэль 1v1)',
      file: 'games/chrono_blade.html',
      guestQuery: (code) => `?room=${code}`,
      hostQuery: (code) => `?host=${code}`
    },
    mecha_siege: {
      label: 'MECHA SIEGE (Кооп 2P)',
      file: 'games/mecha_siege.html',
      guestQuery: (code) => `?room=${code}`,
      hostQuery: (code) => `?host=${code}`
    },
    worms_armageddon: {
      label: 'WORMS ARMAGEDDON (Онлайн)',
      file: 'games/worms_armageddon.html',
      guestQuery: (code) => `?room=${code}`,
      hostQuery: (code) => `?host=${code}`
    },
    cosmo_junk: {
      label: 'COSMO JUNK (Пульт экипажа)',
      file: 'games/cosmo_junk.html',
      guestQuery: (code) => `#/play/${code}`,
      hostQuery: (code) => `#/ship/${code}`
    }
  },

  init() {
    if (typeof BroadcastChannel !== 'undefined' && !this._bc) {
      try {
        this._bc = new BroadcastChannel('neo_p2p_room_registry');
        this._bc.onmessage = (ev) => {
          const d = ev?.data;
          if (d && d.type === 'room_created' && d.code && d.gameId) {
            const reg = this._readRegistry();
            reg[d.code] = { gameId: d.gameId, ts: Date.now() };
            try { localStorage.setItem(this._roomRegistryKey, JSON.stringify(reg)); } catch {}
          }
        };
      } catch {}
    }
    this.setupUI();
    this.updateStatusUI('ready');
  },

  _baseUrl() {
    return window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  },

  getActiveGameId() {
    const sel = document.getElementById('p2p-game-select');
    if (sel && this.GAME_ROUTES[sel.value]) {
      this.selectedGame = sel.value;
      return sel.value;
    }
    if (window.App && App.currentCartridge && this.GAME_ROUTES[App.currentCartridge]) {
      this.selectedGame = App.currentCartridge;
    }
    return this.selectedGame;
  },

  buildGuestUrl(gameId, code) {
    const route = this.GAME_ROUTES[gameId] || this.GAME_ROUTES.chrono_blade;
    const clean = window.NeoP2PRoom ? NeoP2PRoom.normalizeCode(code) : String(code || '').toUpperCase();
    return `${this._baseUrl()}${route.file}${route.guestQuery(clean)}`;
  },

  buildHostUrl(gameId, code) {
    const route = this.GAME_ROUTES[gameId] || this.GAME_ROUTES.chrono_blade;
    const clean = window.NeoP2PRoom ? NeoP2PRoom.normalizeCode(code) : String(code || '').toUpperCase();
    return `${this._baseUrl()}${route.file}${route.hostQuery(clean)}`;
  },

  generateRoomCode(gameId) {
    const len = gameId === 'pixel_drift' || gameId === 'cosmo_junk' ? 4 : 6;
    if (window.NeoP2PRoom && NeoP2PRoom.generateCode) {
      return NeoP2PRoom.generateCode(len);
    }
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  },

  setStatusText(text, tone) {
    const el = document.getElementById('p2p-status-text');
    if (!el) return;
    el.textContent = text;
    if (tone === 'ok') el.style.color = 'var(--crt-phosphor)';
    else if (tone === 'err') el.style.color = '#ff5c7a';
    else el.style.color = 'var(--crt-cyan)';
  },

  async createOffer() {
    const gameId = this.getActiveGameId();
    this.roomCode = this.generateRoomCode(gameId);
    this._registerRoomGame(this.roomCode, gameId);
    const inviteUrl = this.buildGuestUrl(gameId, this.roomCode);

    const codeBadge = document.getElementById('p2p-room-code-badge');
    const codeEl = document.getElementById('p2p-share-code');
    const launchBtn = document.getElementById('btn-launch-p2p-host');
    const copyBtn = document.getElementById('btn-copy-p2p');

    if (codeBadge) codeBadge.textContent = this.roomCode;
    if (codeEl) codeEl.value = inviteUrl;
    if (launchBtn) launchBtn.disabled = false;
    if (copyBtn) copyBtn.disabled = false;

    if (window.Storage && Storage.unlock) {
      Storage.unlock('P2P_WARRIOR');
    }
    this.updateStatusUI('hosting');
    this.setStatusText(
      `Комната ${this.roomCode} готова! Отправьте ссылку другу и нажмите «Запустить как Хост».`,
      'ok'
    );
    return inviteUrl;
  },

  launchCartridgeUrl(gameId, targetUrl) {
    if (window.App && App.closeModal) {
      App.closeModal('p2p-modal');
    }
    if (window.App && App.cartridges && App.cartridges[gameId]) {
      if (App.isBooting && App.cancelBoot) {
        App.cancelBoot();
      }
      if (App.isPoweredOn && App.switchRunningCartridge) {
        App.switchRunningCartridge(gameId, targetUrl);
        return;
      }
      if (App.powerOnCartridge) {
        App.powerOnCartridge(gameId, targetUrl);
        return;
      }
    }
    window.location.href = targetUrl;
  },

  async copyInviteLink() {
    const codeEl = document.getElementById('p2p-share-code');
    if (!this.roomCode) {
      await this.createOffer();
    }
    const text = codeEl ? codeEl.value : '';
    if (!text) return;
    const copied = window.NeoP2PRoom
      ? await NeoP2PRoom.copyText(text)
      : await navigator.clipboard.writeText(text).then(() => true).catch(() => false);

    if (copied) {
      const copyBtn = document.getElementById('btn-copy-p2p');
      if (copyBtn) {
        if (this._copyResetTimer) clearTimeout(this._copyResetTimer);
        copyBtn.textContent = '✓ Скопировано';
        this._copyResetTimer = setTimeout(() => {
          copyBtn.textContent = 'Копировать ссылку';
        }, 2000);
      }
      this.setStatusText(`Ссылка комнаты ${this.roomCode} скопирована в буфер обмена.`, 'ok');
    } else {
      if (codeEl) codeEl.select();
      this.setStatusText('Выделите и скопируйте ссылку вручную (Ctrl+C).', 'info');
    }
  },

  joinByCode() {
    let gameId = this.getActiveGameId();
    const input = document.getElementById('p2p-join-input');
    const raw = input ? input.value.trim() : '';
    if (!raw) {
      this.setStatusText('Введите код комнаты или вставьте ссылку-приглашение.', 'err');
      return;
    }

    let clean = raw;
    let urlMatchedGame = false;
    try {
      if (raw.includes('http://') || raw.includes('https://') || raw.includes('?') || raw.includes('#/')) {
        const parsed = new URL(raw, window.location.origin);
        const lowPath = parsed.pathname.toLowerCase();
        for (const id of Object.keys(this.GAME_ROUTES)) {
          if (lowPath.includes(id)) {
            gameId = id;
            urlMatchedGame = true;
            const sel = document.getElementById('p2p-game-select');
            if (sel) sel.value = id;
            this.selectedGame = id;
            break;
          }
        }
        const paramCode = parsed.searchParams.get('room') || parsed.searchParams.get('join') || parsed.searchParams.get('host');
        if (paramCode) clean = paramCode;
        else if (parsed.hash && parsed.hash.includes('/play/')) {
          clean = parsed.hash.split('/play/')[1] || '';
        } else if (parsed.hash && parsed.hash.includes('/ship/')) {
          clean = parsed.hash.split('/ship/')[1] || '';
        }
      }
    } catch (_) {}

    clean = window.NeoP2PRoom ? NeoP2PRoom.normalizeCode(clean) : clean.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length < 3) {
      this.setStatusText('Код должен содержать минимум 3 символа.', 'err');
      return;
    }
    if (!urlMatchedGame) {
      const regGame = this._lookupRoomGame(clean);
      if (regGame) {
        gameId = regGame;
        this.selectedGame = regGame;
        const sel = document.getElementById('p2p-game-select');
        if (sel) sel.value = regGame;
      }
    }
    const guestUrl = this.buildGuestUrl(gameId, clean);
    this.setStatusText(`Подключение к комнате ${clean}...`, 'ok');
    this.launchCartridgeUrl(gameId, guestUrl);
  },

  updateStatusUI(state) {
    const statusEl = document.getElementById('p2p-status-pill');
    if (!statusEl) return;
    const span = statusEl.querySelector('span:last-child');
    if (state === 'connected') {
      statusEl.classList.add('connected');
      if (span) span.textContent = 'P2P: ПОДКЛЮЧЕНО';
    } else if (state === 'hosting') {
      statusEl.classList.add('connected');
      if (span) span.textContent = `P2P: КОД ${this.roomCode}`;
    } else {
      statusEl.classList.remove('connected');
      if (span) span.textContent = 'P2P: WEBRTC ГОТОВ';
    }
  },

  syncSelectedGameFromConsole() {
    const sel = document.getElementById('p2p-game-select');
    if (sel && window.App && App.currentCartridge && this.GAME_ROUTES[App.currentCartridge]) {
      sel.value = App.currentCartridge;
      this.selectedGame = App.currentCartridge;
    }
  },

  setupUI() {
    const selectEl = document.getElementById('p2p-game-select');
    const createBtn = document.getElementById('btn-create-p2p');
    const copyBtn = document.getElementById('btn-copy-p2p');
    const launchBtn = document.getElementById('btn-launch-p2p-host');
    const joinBtn = document.getElementById('btn-join-p2p');

    if (selectEl) {
      selectEl.innerHTML = Object.entries(this.GAME_ROUTES)
        .map(([id, cfg]) => `<option value="${id}">${cfg.label}</option>`)
        .join('');
      selectEl.addEventListener('change', () => {
        this.selectedGame = selectEl.value;
        if (this.roomCode) {
          const expectedLen = this.selectedGame === 'pixel_drift' || this.selectedGame === 'cosmo_junk' ? 4 : 6;
          if (this.roomCode.length !== expectedLen) {
            this.roomCode = this.generateRoomCode(this.selectedGame);
            const codeBadge = document.getElementById('p2p-room-code-badge');
            if (codeBadge) codeBadge.textContent = this.roomCode;
          }
          const inviteUrl = this.buildGuestUrl(this.selectedGame, this.roomCode);
          const codeEl = document.getElementById('p2p-share-code');
          if (codeEl) codeEl.value = inviteUrl;
          this.updateStatusUI('hosting');
          this.setStatusText(`Ссылка обновлена для ${this.GAME_ROUTES[this.selectedGame].label}.`, 'info');
        }
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', () => {
        if (window.Sound && Sound.playClick) Sound.playClick();
        this.createOffer();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (window.Sound && Sound.playClick) Sound.playClick();
        this.copyInviteLink();
      });
    }

    if (launchBtn) {
      launchBtn.addEventListener('click', async () => {
        if (window.Sound && Sound.playClick) Sound.playClick();
        const gameId = this.getActiveGameId();
        if (!this.roomCode) await this.createOffer();
        const hostUrl = this.buildHostUrl(gameId, this.roomCode);
        this.launchCartridgeUrl(gameId, hostUrl);
      });
    }

    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        if (window.Sound && Sound.playClick) Sound.playClick();
        this.joinByCode();
      });
    }
  }
};
