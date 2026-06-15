/**
 * Procedural tropical-marimba music engine — C major pentatonic, two moods:
 *   ambient : calm marimba melody, light shaker       (~80 BPM, 16 beats)
 *   lesson  : upbeat marimba arpeggios + light drums  (~100 BPM, 8 beats)
 *
 * Marimba timbre: triangle oscillator + quiet 3.75× harmonic → wooden, bright.
 * Percussion: sine-sweep kick + noise hi-hat + noise shaker.
 * Uses Web Audio API — starts only after a user gesture (browser policy).
 */

type MusicMode = "ambient" | "lesson";

// C major pentatonic: C D E G A
const N: Record<string, number> = {
  C3: 130.81, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
};

type Ev = { beat: number; freq: number; dur: number; gain: number };

// ── AMBIENT MAP ── 80 BPM, 16-beat loop ──────────────────────────────────────
// Calm marimba melody — like a light breeze through market stalls
const MAP_BPM = 80;
const MAP_BEATS = 16;

const MAP_EVENTS: Ev[] = [
  // Bass marimba — root note every 4 beats
  { beat: 0,    freq: N.C3,  dur: 0.80, gain: 0.10 },
  { beat: 4,    freq: N.G3,  dur: 0.80, gain: 0.09 },
  { beat: 8,    freq: N.A3,  dur: 0.80, gain: 0.10 },
  { beat: 12,   freq: N.G3,  dur: 0.80, gain: 0.09 },

  // Mid melody — gentle, pentatonic
  { beat: 0.5,  freq: N.G4,  dur: 0.42, gain: 0.09 },
  { beat: 1,    freq: N.A4,  dur: 0.42, gain: 0.09 },
  { beat: 2,    freq: N.C5,  dur: 0.62, gain: 0.10 },
  { beat: 3,    freq: N.A4,  dur: 0.42, gain: 0.08 },
  { beat: 4.5,  freq: N.G4,  dur: 0.42, gain: 0.09 },
  { beat: 5,    freq: N.E4,  dur: 0.42, gain: 0.08 },
  { beat: 6,    freq: N.G4,  dur: 0.62, gain: 0.09 },
  { beat: 7,    freq: N.C4,  dur: 0.42, gain: 0.08 },
  { beat: 8.5,  freq: N.A4,  dur: 0.42, gain: 0.09 },
  { beat: 9,    freq: N.C5,  dur: 0.42, gain: 0.09 },
  { beat: 10,   freq: N.D5,  dur: 0.62, gain: 0.10 },
  { beat: 11,   freq: N.C5,  dur: 0.42, gain: 0.09 },
  { beat: 12.5, freq: N.A4,  dur: 0.42, gain: 0.08 },
  { beat: 13,   freq: N.G4,  dur: 0.42, gain: 0.08 },
  { beat: 14,   freq: N.E4,  dur: 0.62, gain: 0.09 },
  { beat: 15,   freq: N.G4,  dur: 0.42, gain: 0.08 },
];

// ── LESSON FOCUS ── 100 BPM, 8-beat loop ─────────────────────────────────────
// Upbeat marimba arpeggios + light kick + hi-hat — energetic but not frantic
const LESSON_BPM = 85;
const LESSON_BEATS = 8;

const LESSON_EVENTS: Ev[] = [
  // Bass marimba
  { beat: 0, freq: N.C3, dur: 0.50, gain: 0.11 },
  { beat: 2, freq: N.G3, dur: 0.50, gain: 0.10 },
  { beat: 4, freq: N.A3, dur: 0.50, gain: 0.10 },
  { beat: 6, freq: N.G3, dur: 0.50, gain: 0.10 },

  // Mid arpeggios (8th notes)
  { beat: 0,   freq: N.C4,  dur: 0.30, gain: 0.11 },
  { beat: 0.5, freq: N.E4,  dur: 0.30, gain: 0.10 },
  { beat: 1,   freq: N.G4,  dur: 0.30, gain: 0.10 },
  { beat: 1.5, freq: N.A4,  dur: 0.30, gain: 0.10 },
  { beat: 2,   freq: N.G4,  dur: 0.30, gain: 0.10 },
  { beat: 2.5, freq: N.E4,  dur: 0.30, gain: 0.09 },
  { beat: 3,   freq: N.C4,  dur: 0.30, gain: 0.10 },
  { beat: 3.5, freq: N.D4,  dur: 0.30, gain: 0.09 },
  { beat: 4,   freq: N.E4,  dur: 0.30, gain: 0.10 },
  { beat: 4.5, freq: N.G4,  dur: 0.30, gain: 0.10 },
  { beat: 5,   freq: N.A4,  dur: 0.30, gain: 0.10 },
  { beat: 5.5, freq: N.C5,  dur: 0.30, gain: 0.10 },
  { beat: 6,   freq: N.A4,  dur: 0.30, gain: 0.09 },
  { beat: 6.5, freq: N.G4,  dur: 0.30, gain: 0.09 },
  { beat: 7,   freq: N.E4,  dur: 0.30, gain: 0.10 },
  { beat: 7.5, freq: N.D4,  dur: 0.30, gain: 0.09 },

  // High melody hits
  { beat: 1,   freq: N.C5,  dur: 0.60, gain: 0.10 },
  { beat: 2.5, freq: N.D5,  dur: 0.60, gain: 0.10 },
  { beat: 4,   freq: N.E5,  dur: 0.60, gain: 0.10 },
  { beat: 5.5, freq: N.D5,  dur: 0.60, gain: 0.09 },
  { beat: 7,   freq: N.C5,  dur: 0.60, gain: 0.09 },
];

// ── Engine ────────────────────────────────────────────────────────────────────
class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private loop: ReturnType<typeof setTimeout> | null = null;
  private mode: MusicMode = "ambient";
  private _muted = false;
  private _started = false;
  private _volume = 0.18;

  constructor() {
    if (typeof window !== "undefined") {
      this._muted = localStorage.getItem("mapulengua-music-muted") === "1";
    }
  }

  private ctx_(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Marimba: triangle + quiet 3.75× harmonic, percussive envelope */
  private scheduleMarimba(ev: Ev, t: number, beatSec: number) {
    const ctx = this.ctx_();
    if (!this.master) return;
    const at = t + ev.beat * beatSec;
    const dur = Math.max(ev.dur * beatSec, 0.1);
    const atk = 0.004;
    const dec = Math.min(dur * 0.55, 0.40);

    // Primary triangle oscillator
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = ev.freq;
    const env1 = ctx.createGain();
    env1.gain.setValueAtTime(0, at);
    env1.gain.linearRampToValueAtTime(ev.gain, at + atk);
    env1.gain.exponentialRampToValueAtTime(ev.gain * 0.18, at + atk + dec);
    env1.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc1.connect(env1);
    env1.connect(this.master);
    osc1.start(at);
    osc1.stop(at + dur + 0.05);

    // Harmonic overtone — gives wood character
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = ev.freq * 3.75;
    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0, at);
    env2.gain.linearRampToValueAtTime(ev.gain * 0.14, at + atk);
    env2.gain.exponentialRampToValueAtTime(0.0001, at + atk + dec * 0.5);
    osc2.connect(env2);
    env2.connect(this.master);
    osc2.start(at);
    osc2.stop(at + dec + 0.1);
  }

  /** Kick drum: sine sweep 160 Hz → 35 Hz */
  private scheduleKick(t: number, gain: number) {
    const ctx = this.ctx_();
    if (!this.master) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.09);
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    osc.connect(env);
    env.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  /** Hi-hat: short highpass-filtered noise burst */
  private scheduleHat(t: number, gain: number) {
    const ctx = this.ctx_();
    if (!this.master) return;
    const len = Math.ceil(ctx.sampleRate * 0.045);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);
    src.connect(hp);
    hp.connect(env);
    env.connect(this.master);
    src.start(t);
  }

  /** Shaker: bandpass noise, softer and longer than hat */
  private scheduleShaker(t: number, gain: number) {
    const ctx = this.ctx_();
    if (!this.master) return;
    const len = Math.ceil(ctx.sampleRate * 0.055);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 4500;
    bp.Q.value = 0.6;
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.048);
    src.connect(bp);
    bp.connect(env);
    env.connect(this.master);
    src.start(t);
  }

  private scheduleLoop(loopStart: number) {
    const ctx = this.ctx_();
    const isLesson = this.mode === "lesson";
    const bpm = isLesson ? LESSON_BPM : MAP_BPM;
    const beats = isLesson ? LESSON_BEATS : MAP_BEATS;
    const bs = 60 / bpm;
    const events = isLesson ? LESSON_EVENTS : MAP_EVENTS;

    // Marimba notes
    for (const ev of events) this.scheduleMarimba(ev, loopStart, bs);

    if (isLesson) {
      // Kick on beats 0 and 4
      for (const b of [0, 4]) this.scheduleKick(loopStart + b * bs, 0.11);
      // Hi-hat on every beat
      for (let b = 0; b < beats; b++) this.scheduleHat(loopStart + b * bs, 0.045);
      // Light 8th-note hats on offbeats
      for (let b = 0; b < beats; b++) this.scheduleHat(loopStart + (b + 0.5) * bs, 0.025);
    } else {
      // Shaker on every beat (MAP mode)
      for (let b = 0; b < beats; b++) this.scheduleShaker(loopStart + b * bs, 0.038);
      // Shaker offbeats (lighter)
      for (let b = 0; b < beats; b++) this.scheduleShaker(loopStart + (b + 0.5) * bs, 0.018);
    }

    const nextStart = loopStart + beats * bs;
    const delay = (nextStart - ctx.currentTime - 0.2) * 1000;
    this.loop = setTimeout(() => this.scheduleLoop(nextStart), Math.max(0, delay));
  }

  start(mode: MusicMode = this.mode) {
    if (typeof window === "undefined") return;
    this.mode = mode;
    const ctx = this.ctx_();
    if (ctx.state === "suspended") ctx.resume();
    if (this._started) return;
    this._started = true;
    if (this.master && !this._muted) {
      this.master.gain.setValueAtTime(0, ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(this._volume, ctx.currentTime + 1.5);
    }
    this.scheduleLoop(ctx.currentTime + 0.2);
  }

  setMode(mode: MusicMode) {
    if (this.mode === mode || !this._started || !this.ctx) return;
    this.mode = mode;
    if (this.loop) { clearTimeout(this.loop); this.loop = null; }
    const ctx = this.ctx;
    const restartAt = ctx.currentTime + 0.8;
    if (this.master && !this._muted) {
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      this.master.gain.setTargetAtTime(this._volume, restartAt, 0.4);
    }
    setTimeout(() => this.scheduleLoop(restartAt), 800);
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("mapulengua-music-muted", muted ? "1" : "0");
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : this._volume, this.ctx.currentTime, 0.3);
    }
  }

  toggle() {
    if (!this._started) { this.start(); if (this._muted) this.setMuted(false); return; }
    this.setMuted(!this._muted);
  }

  get muted() { return this._muted; }
  get started() { return this._started; }
}

export const music = new MusicEngine();
