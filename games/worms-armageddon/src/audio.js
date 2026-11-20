export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.noiseBuffer = null;
  }

  unlock() {
    if (this.muted || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this._buildNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
  }

  _canPlay() {
    if (this.muted || !this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  _buildNoiseBuffer() {
    if (!this.ctx) return;
    const length = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  _tone(freqStart, freqEnd, duration, type = 'sine', gainVal = 0.2, delay = 0) {
    if (!this._canPlay()) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freqStart), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  _noise(duration, filterFreq, gainVal = 0.25, filterType = 'lowpass', delay = 0) {
    if (!this._canPlay() || !this.noiseBuffer) return;
    const now = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, filterFreq * 0.25), now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  playClick() {
    this._tone(680, 920, 0.05, 'triangle', 0.1);
  }

  playJump() {
    this._tone(190, 360, 0.11, 'sine', 0.1);
  }

  playBounce(speed = 200) {
    const vol = Math.min(0.16, 0.04 + speed / 2400);
    this._tone(240, 140, 0.08, 'triangle', vol);
  }

  playLaunch(isHeavy = false) {
    this._tone(isHeavy ? 180 : 280, 75, 0.22, 'sawtooth', 0.18);
    this._noise(0.18, 900, 0.16, 'bandpass');
  }

  playShotgun() {
    this._noise(0.24, 1800, 0.34, 'lowpass');
    this._tone(160, 48, 0.18, 'square', 0.16);
  }

  playUziShot() {
    this._noise(0.07, 2600, 0.18, 'bandpass');
    this._tone(240, 90, 0.05, 'square', 0.09);
  }

  playBatSwing() {
    this._noise(0.14, 1100, 0.18, 'bandpass');
    this._tone(190, 620, 0.16, 'triangle', 0.2);
  }

  playExplosion(radius = 48) {
    const scale = Math.min(1.5, Math.max(0.6, radius / 48));
    this._noise(0.42 * scale, 520 * scale, 0.42, 'lowpass');
    this._tone(110, 28, 0.45 * scale, 'sine', 0.34);
    this._tone(75, 24, 0.35 * scale, 'triangle', 0.24);
  }

  playSplash() {
    this._noise(0.36, 1500, 0.24, 'bandpass');
    this._tone(420, 140, 0.26, 'sine', 0.12);
  }

  playHurt() {
    const base = 360 + Math.random() * 120;
    this._tone(base, base * 0.58, 0.18, 'square', 0.11);
  }

  playPickup() {
    this._tone(523, 659, 0.09, 'triangle', 0.15, 0);
    this._tone(659, 880, 0.14, 'triangle', 0.16, 0.08);
  }

  playTeleport() {
    this._tone(320, 1240, 0.22, 'sine', 0.18);
    this._tone(880, 440, 0.22, 'triangle', 0.12, 0.08);
  }

  playBeep(high = false) {
    this._tone(high ? 1140 : 880, high ? 1140 : 880, 0.07, 'sine', 0.11);
  }

  playHallelujah() {
    if (!this._canPlay()) return;
    // Iconic triad choir swelling chord (F4 - A4 - C5 - F5)
    const freqs = [349.23, 440.0, 523.25, 698.46];
    for (let i = 0; i < freqs.length; i++) {
      this._tone(freqs[i] * 0.99, freqs[i], 0.95, 'triangle', 0.11, 0);
      this._tone(freqs[i], freqs[i] * 1.005, 0.85, 'sine', 0.08, 0.15);
    }
  }

  playJetpack() {
    this._noise(0.08, 700, 0.09, 'bandpass');
  }

  playSiren() {
    this._tone(520, 780, 0.25, 'sawtooth', 0.12, 0);
    this._tone(780, 480, 0.25, 'sawtooth', 0.12, 0.25);
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      this._tone(f, f, 0.24, 'triangle', 0.16, idx * 0.13);
    });
  }
}
