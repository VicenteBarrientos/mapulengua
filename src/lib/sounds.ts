/**
 * Game sound manager — tries /public/sounds/*.mp3 first, falls back to Web Audio.
 * Add real audio files to public/sounds/ to replace procedural placeholders.
 */

export const SOUND_PATHS = {
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  xp: "/sounds/xp.mp3",
  heartLost: "/sounds/heart-lost.mp3",
  lessonComplete: "/sounds/lesson-complete.mp3",
  regionUnlock: "/sounds/region-unlock.mp3",
  tap: "/sounds/tap.mp3",
} as const;

type SoundKey = keyof typeof SOUND_PATHS;

const cache = new Map<string, HTMLAudioElement>();
const failed = new Set<string>();

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  when = 0
) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + when + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime + when);
  osc.stop(c.currentTime + when + duration);
}

function playFile(path: string, volume = 0.5): boolean {
  if (typeof window === "undefined" || failed.has(path)) return false;

  let audio = cache.get(path);
  if (!audio) {
    audio = new Audio(path);
    audio.preload = "auto";
    cache.set(path, audio);
  }

  try {
    const clip = audio.cloneNode() as HTMLAudioElement;
    clip.volume = volume;
    const p = clip.play();
    if (p) {
      void p.catch(() => {
        failed.add(path);
      });
    }
    return true;
  } catch {
    failed.add(path);
    return false;
  }
}

function play(key: SoundKey, fallback: () => void, volume = 0.5) {
  const path = SOUND_PATHS[key];
  const started = playFile(path, volume);
  if (!started) fallback();
}

function fallbackCorrect() {
  tone(523, 0.1, "sine", 0.12, 0);
  tone(659, 0.1, "sine", 0.12, 0.08);
  tone(784, 0.15, "sine", 0.14, 0.16);
}

function fallbackWrong() {
  tone(180, 0.25, "sawtooth", 0.08, 0);
  tone(140, 0.3, "sawtooth", 0.06, 0.1);
}

function fallbackHeartLost() {
  tone(400, 0.15, "triangle", 0.1, 0);
  tone(250, 0.35, "triangle", 0.08, 0.12);
}

function fallbackXp() {
  tone(880, 0.08, "sine", 0.1, 0);
  tone(1047, 0.12, "sine", 0.12, 0.06);
}

function fallbackComplete() {
  [392, 523, 659, 784, 988].forEach((f, i) => tone(f, 0.18, "sine", 0.11, i * 0.1));
}

function fallbackUnlock() {
  tone(440, 0.12, "sine", 0.1, 0);
  tone(554, 0.12, "sine", 0.1, 0.1);
  tone(659, 0.2, "sine", 0.12, 0.2);
}

function fallbackTap() {
  tone(800, 0.04, "sine", 0.06, 0);
}

export function playSuccess() {
  play("correct", fallbackCorrect);
}

export function playMistake() {
  play("wrong", fallbackWrong);
}

export function playHeartLost() {
  play("heartLost", fallbackHeartLost);
}

export function playXp() {
  play("xp", fallbackXp, 0.45);
}

export function playComplete() {
  play("lessonComplete", fallbackComplete);
}

export function playUnlock() {
  play("regionUnlock", fallbackUnlock);
}

export function playTap() {
  play("tap", fallbackTap, 0.35);
}

export function playStreak() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, "sine", 0.1, i * 0.07));
}

/** Preload sound files in the background (optional) */
export function preloadSounds() {
  if (typeof window === "undefined") return;
  Object.values(SOUND_PATHS).forEach((path) => {
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.addEventListener("error", () => failed.add(path), { once: true });
    cache.set(path, audio);
  });
}
