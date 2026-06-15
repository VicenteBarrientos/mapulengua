/**
 * Mapulengua sound system.
 * Tries /public/sounds/*.mp3 first; falls back to Web Audio synthesis.
 * Synthesis target: vibraphone-quality pings for success, warm thunks for wrong.
 */

export const SOUND_PATHS = {
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  heartLost: "/sounds/heart-lost.mp3",
  lessonComplete: "/sounds/lesson-complete.mp3",
  regionUnlock: "/sounds/region-unlock.mp3",
  achievement: "/sounds/achievement.mp3",
  streak: "/sounds/streak.mp3",
  tap: "/sounds/tap.mp3",
  reviewReveal: "/sounds/review-reveal.mp3",
} as const;

type SoundKey = keyof typeof SOUND_PATHS;

const audioCache = new Map<string, HTMLAudioElement>();
const failed = new Set<string>();
const lastPlayed = new Map<string, number>();
const DEBOUNCE_MS = 120;

let ctx: AudioContext | null = null;
let masterOut: GainNode | null = null;

function getCtx(): { c: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
    // Dynamics compressor: keeps loud events from peaking, gives a "produced" feel
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 6;
    comp.ratio.value = 4;
    comp.attack.value = 0.002;
    comp.release.value = 0.10;
    comp.connect(ctx.destination);
    masterOut = ctx.createGain();
    masterOut.gain.value = 1.0;
    masterOut.connect(comp);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { c: ctx, out: masterOut! };
}

// ─── Primitive builders ──────────────────────────────────────────────────────

/**
 * Vibraphone-like bell ping: percussive 5ms attack, resonant exponential decay,
 * with an octave harmonic for brightness and ring.
 */
function ping(
  c: AudioContext,
  out: AudioNode,
  freq: number,
  when: number,
  dur: number,
  vol: number
) {
  const osc = c.createOscillator();
  const harmonic = c.createOscillator();
  const hgain = c.createGain();
  const env = c.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  // Octave adds "ring" without changing pitch character
  harmonic.type = "sine";
  harmonic.frequency.value = freq * 2;
  hgain.gain.value = 0.18;

  // Envelope: snap to peak in 5ms, natural resonant decay
  env.gain.setValueAtTime(0, when);
  env.gain.linearRampToValueAtTime(vol, when + 0.005);
  env.gain.setValueAtTime(vol * 0.82, when + 0.022); // short bloom settle
  env.gain.exponentialRampToValueAtTime(0.0008, when + dur);

  osc.connect(env);
  harmonic.connect(hgain);
  hgain.connect(env);
  env.connect(out);

  osc.start(when);
  osc.stop(when + dur + 0.06);
  harmonic.start(when);
  harmonic.stop(when + dur + 0.06);
}

/**
 * Warm "thunk" for wrong answers: triangle wave with slight downward pitch droop,
 * weighted 15ms attack so it feels heavy, not sharp.
 */
function thunk(
  c: AudioContext,
  out: AudioNode,
  freq: number,
  when: number,
  vol: number
) {
  const osc = c.createOscillator();
  const env = c.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, when);
  // Slight pitch sag — makes it feel "wrong" and droopy
  osc.frequency.exponentialRampToValueAtTime(freq * 0.90, when + 0.20);

  env.gain.setValueAtTime(0, when);
  env.gain.linearRampToValueAtTime(vol, when + 0.016); // weighted, not instant
  env.gain.exponentialRampToValueAtTime(0.0008, when + 0.24);

  osc.connect(env);
  env.connect(out);
  osc.start(when);
  osc.stop(when + 0.30);
}

/** Simple sine used for bass note underpinning */
function bass(
  c: AudioContext,
  out: AudioNode,
  freq: number,
  when: number,
  dur: number,
  vol: number
) {
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, when);
  env.gain.linearRampToValueAtTime(vol, when + 0.020);
  env.gain.exponentialRampToValueAtTime(0.0008, when + dur);
  osc.connect(env);
  env.connect(out);
  osc.start(when);
  osc.stop(when + dur + 0.06);
}

// ─── File playback ───────────────────────────────────────────────────────────

function playFile(path: string, volume = 0.55): boolean {
  if (typeof window === "undefined" || failed.has(path)) return false;
  let audio = audioCache.get(path);
  if (!audio) {
    audio = new Audio(path);
    audio.preload = "auto";
    audioCache.set(path, audio);
  }
  try {
    const clip = audio.cloneNode() as HTMLAudioElement;
    clip.volume = volume;
    const p = clip.play();
    if (p) void p.catch(() => { failed.add(path); });
    return true;
  } catch {
    failed.add(path);
    return false;
  }
}

function debounced(key: string, fallback: () => void, fileKey?: SoundKey, volume = 0.55) {
  const now = Date.now();
  if (now - (lastPlayed.get(key) ?? 0) < DEBOUNCE_MS) return;
  lastPlayed.set(key, now);
  if (fileKey && playFile(SOUND_PATHS[fileKey], volume)) return;
  fallback();
}

// ─── Synthesized sounds ──────────────────────────────────────────────────────

function fallbackCorrect() {
  // Bright C major ascending arpeggio: C5 → E5 → G5 → C6
  // Each note is a vibraphone ping, crescendo through the run
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  ping(c, out, 523.25, t + 0.000, 0.30, 0.20); // C5
  ping(c, out, 659.25, t + 0.085, 0.30, 0.22); // E5
  ping(c, out, 783.99, t + 0.162, 0.35, 0.24); // G5
  ping(c, out, 1046.5, t + 0.232, 0.50, 0.19); // C6 — high shimmer tail

  // G5 lingers under C6 for chord fullness
  ping(c, out, 783.99, t + 0.235, 0.42, 0.08);
}

function fallbackWrong() {
  // Two descending thunks: Bb3 → G3 (minor third down)
  // Musically signals "wrong" — classic descending minor
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  thunk(c, out, 233.08, t + 0.000, 0.19); // Bb3
  thunk(c, out, 196.00, t + 0.145, 0.17); // G3 — heavier, conclusive
}

function fallbackHeartLost() {
  // Sad descending minor third: A4 → F#4
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  thunk(c, out, 440.00, t + 0.000, 0.14); // A4
  thunk(c, out, 369.99, t + 0.165, 0.12); // F#4
}

function fallbackComplete() {
  // G major triumphant fanfare: G4 B4 D5 G5 run, then full chord + shimmer
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  // Ascending run
  ping(c, out, 392.00, t + 0.000, 0.24, 0.18); // G4
  ping(c, out, 493.88, t + 0.080, 0.24, 0.20); // B4
  ping(c, out, 587.33, t + 0.155, 0.26, 0.22); // D5
  ping(c, out, 783.99, t + 0.225, 0.55, 0.24); // G5 — big hit

  // Full chord rings out together
  ping(c, out, 783.99, t + 0.345, 0.60, 0.17); // G5
  ping(c, out, 587.33, t + 0.345, 0.60, 0.13); // D5
  ping(c, out, 493.88, t + 0.345, 0.60, 0.10); // B4

  // High sparkle
  ping(c, out, 1568.0, t + 0.375, 0.42, 0.07); // G6

  // Low bass anchors the chord
  bass(c, out, 196.00, t + 0.230, 0.62, 0.12); // G3
}

function fallbackUnlock() {
  // Bell tower: deep E bell then ascending shimmer cascade
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  bass(c, out, 164.81, t + 0.000, 0.65, 0.12); // E3 bass bell
  ping(c, out, 659.25, t + 0.040, 0.58, 0.18); // E5
  ping(c, out, 987.77, t + 0.120, 0.52, 0.15); // B5
  ping(c, out, 1318.5, t + 0.225, 0.46, 0.11); // E6
  ping(c, out, 1975.5, t + 0.325, 0.38, 0.07); // B6 sparkle
}

function fallbackAchievement() {
  // Grand golden G major chord hit + rising shimmer cascade
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  // Deep bass foundation
  bass(c, out, 196.00, t + 0.000, 0.70, 0.14); // G3

  // Full chord strikes together
  ping(c, out, 392.00, t + 0.012, 0.65, 0.16); // G4
  ping(c, out, 493.88, t + 0.012, 0.65, 0.14); // B4
  ping(c, out, 587.33, t + 0.012, 0.65, 0.13); // D5
  ping(c, out, 783.99, t + 0.012, 0.65, 0.15); // G5

  // Shimmer cascade rising up
  ping(c, out, 1174.7, t + 0.230, 0.48, 0.10); // D6
  ping(c, out, 1568.0, t + 0.315, 0.42, 0.08); // G6
  ping(c, out, 1975.5, t + 0.400, 0.36, 0.05); // B6
}

function fallbackStreak() {
  // Rapid punchy triple chirp: C5 E5 G5 — quick celebratory burst
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  ping(c, out, 523.25, t + 0.000, 0.18, 0.21); // C5
  ping(c, out, 659.25, t + 0.058, 0.18, 0.23); // E5
  ping(c, out, 783.99, t + 0.110, 0.25, 0.25); // G5
}

function fallbackReviewReveal() {
  // Gentle "ah-ha": A4 → C#5 (major third up — discovery interval)
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  ping(c, out, 440.00, t + 0.000, 0.22, 0.12); // A4
  ping(c, out, 554.37, t + 0.095, 0.28, 0.10); // C#5
}

function fallbackTap() {
  // Short sine click — physical confirmation, barely audible
  const r = getCtx();
  if (!r) return;
  const { c, out } = r;
  const t = c.currentTime;

  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 1800;
  env.gain.setValueAtTime(0.09, t);
  env.gain.exponentialRampToValueAtTime(0.0008, t + 0.022);
  osc.connect(env);
  env.connect(out);
  osc.start(t);
  osc.stop(t + 0.030);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Correct answer — bright 4-note ascending arpeggio. Do NOT also call playXp(). */
export function playSuccess() {
  debounced("correct", fallbackCorrect, "correct");
}

export function playMistake() {
  debounced("wrong", fallbackWrong, "wrong");
}

export function playHeartLost() {
  debounced("heartLost", fallbackHeartLost, "heartLost", 0.5);
}

/** No-op — XP shimmer is absorbed into playSuccess(). */
export function playXp() {}

export function playComplete() {
  debounced("complete", fallbackComplete, "lessonComplete");
}

export function playUnlock() {
  debounced("unlock", fallbackUnlock, "regionUnlock");
}

export function playAchievement() {
  debounced("achievement", fallbackAchievement, "achievement");
}

export function playStreak() {
  debounced("streak", fallbackStreak, "streak");
}

export function playReviewReveal() {
  debounced("reviewReveal", fallbackReviewReveal, "reviewReveal", 0.4);
}

export function playTap() {
  debounced("tap", fallbackTap, "tap", 0.35);
}

export function preloadSounds() {
  // MP3 files are optional — Web Audio synthesis handles all sounds as fallback.
  // Skipping HTTP preload avoids console 404 noise until actual MP3s are added.
  // To re-enable: drop *.mp3 files into /public/sounds/ and uncomment below.
  //
  // if (typeof window === "undefined") return;
  // Object.values(SOUND_PATHS).forEach((path) => {
  //   const audio = new Audio(path);
  //   audio.preload = "auto";
  //   audio.addEventListener("error", () => failed.add(path), { once: true });
  //   audioCache.set(path, audio);
  // });
}
