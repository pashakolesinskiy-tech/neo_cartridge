/**
 * NEO-CARTRIDGE // Процедурный Chiptune Звуковой Движок (Web Audio API)
 * Полная автономность: 0 внешних аудиофайлов, генерация звуковых волн в реальном времени.
 */

const Sound = {
  ctx: null,
  muted: false,
  musicRunning: false,
  bgmPreferred: false,
  musicTimer: null,
  masterGain: null,

  get isMuted() {
    return this.muted;
  },

  get isBGMPlaying() {
    return this.musicRunning;
  },

  init() {
    // Lazy initialization happens inside ensureContext() on first user gesture
  },

  ensureContext() {
    if (this.muted) return false;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      try {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.2, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (_) {
        return false;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch (_) {}
    }
    return !!this.ctx;
  },

  resume() {
    return this.ensureContext();
  },

  syncIframeMute() {
    try {
      const iframe = document.getElementById('game-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'NEO_SET_MUTE', muted: this.muted }, '*');
      }
    } catch (_) {}
  },

  setMuted(muted, persist = true) {
    this.muted = !!muted;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.2, this.ctx.currentTime);
      } catch (_) {}
    }
    if (this.muted && this.musicRunning) {
      this.stopBGM();
    }
    if (persist && typeof Storage !== 'undefined' && Storage.data && Storage.data.settings) {
      Storage.data.settings.soundEnabled = !this.muted;
      Storage.save();
    }
    this.syncIframeMute();
    return this.muted;
  },

  toggleMute() {
    return this.setMuted(!this.muted, true);
  },

  _disconnectOnEnded(node, chainEnd) {
    if (!node) return;
    node.onended = () => {
      try { node.disconnect(); } catch (_) {}
      if (chainEnd && chainEnd !== node) {
        try { chainEnd.disconnect(); } catch (_) {}
      }
    };
  },

  // 1. Повышение уровня / Ачивка (Восходящий аккорд)
  playPowerup() {
    if (!this.ensureContext()) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      this._disconnectOnEnded(osc, gain);

      osc.start(start);
      osc.stop(start + 0.21);
    });
  },

  // 2. Механический тактильный клик консоли
  playClick() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.03);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    this._disconnectOnEnded(osc, gain);

    osc.start(t);
    osc.stop(t + 0.035);
  },

  // 3. Треск поворота слайдера картриджей
  playCarouselTick() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.03);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(this.masterGain);
    this._disconnectOnEnded(osc, gain);
    osc.start(t);
    osc.stop(t + 0.035);
  },

  // 4. Тяжёлая механическая вставка картриджа в слот (скольжение + фиксатор)
  playCartridgeInsert() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.07);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1300, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this._disconnectOnEnded(noise, noiseGain);
    noise.start(t);

    const t2 = t + 0.05;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(180, t2);
    osc1.frequency.exponentialRampToValueAtTime(45, t2 + 0.09);
    gain1.gain.setValueAtTime(0.35, t2);
    gain1.gain.exponentialRampToValueAtTime(0.01, t2 + 0.09);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    this._disconnectOnEnded(osc1, gain1);
    osc1.start(t2);
    osc1.stop(t2 + 0.095);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1600, t2);
    osc2.frequency.exponentialRampToValueAtTime(220, t2 + 0.05);
    gain2.gain.setValueAtTime(0.2, t2);
    gain2.gain.exponentialRampToValueAtTime(0.01, t2 + 0.05);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    this._disconnectOnEnded(osc2, gain2);
    osc2.start(t2);
    osc2.stop(t2 + 0.055);
  },

  // 5. Пружинный выброс картриджа (Eject lever)
  playCartridgeEject() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.12);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    this._disconnectOnEnded(osc, gain);
    osc.start(t);
    osc.stop(t + 0.125);
  },

  // 6. Тактильный щелчок тумблера питания POWER
  playPowerClick() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.04);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    this._disconnectOnEnded(osc, gain);
    osc.start(t);
    osc.stop(t + 0.045);
  },

  // 7. Звук выключения ЭЛТ-монитора
  playPowerOff() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(4500, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.28);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(this.masterGain);
    this._disconnectOnEnded(osc, gain);
    osc.start(t);
    osc.stop(t + 0.29);
  },

  // 8. 16-битный BIOS Chime запуска приставки
  playBootJingle() {
    if (!this.ensureContext()) return;
    const t = this.ctx.currentTime;
    const notes = [
      { f: 329.63, delay: 0, dur: 0.12 },
      { f: 415.30, delay: 0.09, dur: 0.12 },
      { f: 493.88, delay: 0.18, dur: 0.12 },
      { f: 659.25, delay: 0.27, dur: 0.22 },
      { f: 830.61, delay: 0.38, dur: 0.55 },
      { f: 1318.51, delay: 0.40, dur: 0.65 }
    ];

    notes.forEach((n) => {
      const start = t + n.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = n.delay >= 0.38 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(n.f, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.005, start + n.dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      this._disconnectOnEnded(osc, gain);
      osc.start(start);
      osc.stop(start + n.dur + 0.01);
    });
  },

  // 9. Процедурная ретро-музыка (Чиптюн генератор баса и мелодии)
  toggleBGM() {
    if (this.musicRunning) {
      this.bgmPreferred = false;
      this.stopBGM();
      return false;
    }
    if (this.muted) {
      this.setMuted(false, true);
    }
    this.bgmPreferred = true;
    this.startBGM();
    return this.musicRunning;
  },

  startBGM() {
    if (this.muted || this.musicRunning) return;
    if (!this.ensureContext()) return;
    this.musicRunning = true;

    const scale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63]; // C3 minor pentatonic
    let step = 0;

    const tick = () => {
      if (!this.musicRunning || this.muted || !this.ctx) {
        this.stopBGM();
        return;
      }
      const t = this.ctx.currentTime;

      const bassNote = scale[step % 4];
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassNote, t);
      bassGain.gain.setValueAtTime(0.18, t);
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      this._disconnectOnEnded(bassOsc, bassGain);
      bassOsc.start(t);
      bassOsc.stop(t + 0.17);

      if (step % 2 === 0) {
        const leadNote = scale[(step * 3) % scale.length] * 2;
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(leadNote, t);
        leadGain.gain.setValueAtTime(0.08, t);
        leadGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        leadOsc.connect(leadGain);
        leadGain.connect(this.masterGain);
        this._disconnectOnEnded(leadOsc, leadGain);
        leadOsc.start(t);
        leadOsc.stop(t + 0.13);
      }

      step++;
      this.musicTimer = setTimeout(tick, 160);
    };

    tick();
  },

  pauseBGMForGame() {
    if (this.musicRunning) {
      this.bgmPreferred = true;
      this.stopBGM();
    }
  },

  resumeBGMFromGame() {
    if (this.bgmPreferred && !this.muted && !this.musicRunning) {
      this.startBGM();
    }
  },

  stopBGM() {
    this.musicRunning = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
};
