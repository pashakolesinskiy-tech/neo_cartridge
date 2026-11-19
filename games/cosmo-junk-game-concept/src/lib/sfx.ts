// ====== Procedural 8-bit SFX + chiptune music (WebAudio, no assets) ======

type SfxName =
  | "click" | "confirm" | "laser" | "boom" | "bigboom" | "shield" | "hit"
  | "alarm" | "resolve" | "fail" | "jump" | "ui_hover" | "count" | "go"
  | "trip" | "extinguish" | "reboot" | "cheer" | "denied" | "engine";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private alarmOsc: { stop: () => void } | null = null;
  muted = false;

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.16;
    this.musicGain.connect(this.master);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.5;
  }

  private tone(opts: {
    freq: number; freqEnd?: number; dur: number; type?: OscillatorType;
    vol?: number; delay?: number; dest?: GainNode | null;
  }) {
    if (!this.ctx || !this.master || this.muted) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = opts.type ?? "square";
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), t0 + opts.dur);
    g.gain.setValueAtTime(opts.vol ?? 0.2, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + opts.dur);
    osc.connect(g).connect(opts.dest ?? this.master);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.05);
  }

  private noise(opts: { dur: number; vol?: number; delay?: number; low?: boolean }) {
    if (!this.ctx || !this.master || this.muted) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const len = Math.floor(this.ctx.sampleRate * opts.dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.value = opts.vol ?? 0.25;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = opts.low ? 900 : 5200;
    src.connect(filter).connect(g).connect(this.master);
    src.start(t0);
  }

  play(name: SfxName) {
    this.ensure();
    if (!this.ctx || this.muted) return;
    switch (name) {
      case "click": this.tone({ freq: 880, dur: 0.05, type: "square", vol: 0.12 }); break;
      case "confirm":
        this.tone({ freq: 520, dur: 0.07, vol: 0.14 });
        this.tone({ freq: 780, dur: 0.09, vol: 0.14, delay: 0.07 });
        break;
      case "ui_hover": this.tone({ freq: 1200, dur: 0.03, vol: 0.05 }); break;
      case "laser": this.tone({ freq: 1600, freqEnd: 240, dur: 0.14, type: "sawtooth", vol: 0.15 }); break;
      case "boom": this.noise({ dur: 0.35, vol: 0.3, low: true }); this.tone({ freq: 120, freqEnd: 40, dur: 0.3, type: "triangle", vol: 0.25 }); break;
      case "bigboom":
        this.noise({ dur: 0.8, vol: 0.42, low: true });
        this.tone({ freq: 90, freqEnd: 28, dur: 0.8, type: "triangle", vol: 0.4 });
        this.noise({ dur: 0.4, vol: 0.3, delay: 0.15, low: true });
        break;
      case "shield": this.tone({ freq: 340, freqEnd: 700, dur: 0.12, type: "triangle", vol: 0.18 }); break;
      case "hit": this.noise({ dur: 0.22, vol: 0.3, low: true }); this.tone({ freq: 200, freqEnd: 70, dur: 0.2, type: "square", vol: 0.18 }); break;
      case "alarm":
        this.tone({ freq: 660, dur: 0.16, type: "square", vol: 0.16 });
        this.tone({ freq: 495, dur: 0.16, type: "square", vol: 0.16, delay: 0.18 });
        break;
      case "resolve":
        this.tone({ freq: 523, dur: 0.08, type: "square", vol: 0.14 });
        this.tone({ freq: 659, dur: 0.08, type: "square", vol: 0.14, delay: 0.08 });
        this.tone({ freq: 784, dur: 0.14, type: "square", vol: 0.16, delay: 0.16 });
        break;
      case "fail":
        this.tone({ freq: 320, freqEnd: 140, dur: 0.35, type: "sawtooth", vol: 0.2 });
        this.tone({ freq: 160, freqEnd: 60, dur: 0.4, type: "square", vol: 0.16, delay: 0.1 });
        break;
      case "jump":
        this.tone({ freq: 220, freqEnd: 1400, dur: 0.4, type: "sawtooth", vol: 0.16 });
        this.noise({ dur: 0.3, vol: 0.12 });
        break;
      case "count": this.tone({ freq: 440, dur: 0.1, vol: 0.16 }); break;
      case "go": this.tone({ freq: 880, dur: 0.3, vol: 0.2 }); break;
      case "trip": this.tone({ freq: 180, freqEnd: 60, dur: 0.18, type: "square", vol: 0.2 }); this.noise({ dur: 0.1, vol: 0.12, low: true }); break;
      case "extinguish": this.noise({ dur: 0.5, vol: 0.16 }); break;
      case "reboot":
        this.tone({ freq: 300, dur: 0.1, vol: 0.12 });
        this.tone({ freq: 450, dur: 0.1, vol: 0.12, delay: 0.12 });
        this.tone({ freq: 600, dur: 0.16, vol: 0.14, delay: 0.24 });
        break;
      case "cheer":
        this.tone({ freq: 700, dur: 0.06, vol: 0.1 });
        this.tone({ freq: 900, dur: 0.06, vol: 0.1, delay: 0.06 });
        break;
      case "denied": this.tone({ freq: 160, dur: 0.14, type: "square", vol: 0.14 }); break;
      case "engine": /* handled by alarm loop slot if needed */ break;
    }
  }

  setAlarmLoop(on: boolean) {
    this.ensure();
    if (on && !this.alarmOsc && this.ctx && this.master && !this.muted) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 620;
      lfo.type = "square";
      lfo.frequency.value = 2.2;
      lfoG.gain.value = 0.06;
      g.gain.value = 0;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      osc.connect(g).connect(this.master);
      osc.start();
      lfo.start();
      this.alarmOsc = {
        stop: () => {
          try { osc.stop(); lfo.stop(); } catch { /* noop */ }
          osc.disconnect(); lfo.disconnect(); g.disconnect();
        },
      };
    } else if ((!on || this.muted) && this.alarmOsc) {
      this.alarmOsc.stop();
      this.alarmOsc = null;
    }
  }

  startMusic() {
    this.ensure();
    if (this.musicTimer || !this.ctx) return;
    // Am — F — C — G, chiptune bass + arp
    const bass = [110, 87.31, 130.81, 98];
    const arp = [220, 261.63, 329.63, 440, 329.63, 261.63];
    this.step = 0;
    this.musicTimer = setInterval(() => {
      if (!this.ctx || this.muted) return;
      const bar = Math.floor(this.step / 8) % 4;
      const sub = this.step % 8;
      const root = bass[bar];
      if (sub === 0 || sub === 4) {
        this.tone({ freq: root, dur: 0.16, type: "triangle", vol: 0.5, dest: this.musicGain });
      }
      if (sub === 3 || sub === 6) {
        this.tone({ freq: root / 2, dur: 0.1, type: "square", vol: 0.2, dest: this.musicGain });
      }
      if (sub % 2 === 1) {
        const n = arp[(this.step * 3) % arp.length] * (bar === 1 ? 0.941 : 1);
        this.tone({ freq: n, dur: 0.07, type: "square", vol: 0.08, dest: this.musicGain });
      }
      if (sub === 2 || sub === 6) {
        this.noise({ dur: 0.03, vol: 0.05 });
      }
      this.step++;
    }, 150);
  }

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
  }
}

export const sfx = new SoundEngine();

export function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch { /* unsupported */ }
}
