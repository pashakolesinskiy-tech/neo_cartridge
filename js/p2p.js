/**
 * NEO-CARTRIDGE // P2P ДУЭЛИ И СЕССИИ (WebRTC DataChannels + Hot-Seat)
 * Мультиплеер без игрового сервера: передача координат и инпутов напрямую между пирами.
 */

const P2P = {
  peerConnection: null,
  dataChannel: null,
  isHost: false,
  connected: false,

  init() {
    this.setupUI();
  },

  createRoom() {
    try {
      const config = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      };
      this.peerConnection = new RTCPeerConnection(config);
      this.isHost = true;

      this.dataChannel = this.peerConnection.createDataChannel('neo_cartridge_sync');
      this.setupChannel(this.dataChannel);

      this.peerConnection.onicecandidate = (e) => {
        if (!e.candidate) {
          // Все кандидаты собраны, генерируем компактный код комнаты
          const offerStr = btoa(JSON.stringify(this.peerConnection.localDescription));
          const roomUrl = `${window.location.origin}${window.location.pathname}#p2p=${offerStr.slice(0, 48)}`;
          
          const codeEl = document.getElementById('p2p-share-code');
          if (codeEl) {
            codeEl.value = roomUrl;
          }
          Storage.unlock("P2P_WARRIOR");
          Sound.playPowerup();
        }
      };

      this.peerConnection.createOffer().then(offer => {
        return this.peerConnection.setLocalDescription(offer);
      });
    } catch (e) {
      console.warn("WebRTC initialization fallback", e);
    }
  },

  setupChannel(channel) {
    channel.onopen = () => {
      this.connected = true;
      Sound.playPowerup();
      const statusEl = document.getElementById('p2p-status-pill');
      if (statusEl) {
        statusEl.textContent = 'P2P: ПОДКЛЮЧЕНО';
        statusEl.style.color = '#00FF88';
      }
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'P2P_INPUT' && window.App) {
          window.App.handleRemoteInput(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
  },

  sendInput(data) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(data));
    }
  },

  copyShareLink() {
    const codeEl = document.getElementById('p2p-share-code');
    if (codeEl) {
      navigator.clipboard.writeText(codeEl.value).then(() => {
        Sound.playCoin();
        alert('Ссылка для подключения скопирована! Отправьте её второму игроку.');
      });
    }
  },

  setupUI() {
    const createBtn = document.getElementById('btn-create-p2p');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.createRoom());
    }
    const copyBtn = document.getElementById('btn-copy-p2p');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyShareLink());
    }
  }
};
