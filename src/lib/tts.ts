/**
 * Smart TTS voice selection.
 * On Edge/Chrome, neural voices are available (Microsoft Camila, Google Natural, etc.)
 * and sound dramatically better than the default. This module finds the best one.
 */

const RATE_NORMAL = 1.0;
const RATE_SLOW = 0.62;

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

/** Score a voice — higher = better for our use case (Spanish, preferably Latin American) */
function scoreVoice(v: SpeechSynthesisVoice): number {
  let s = 0;
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();

  // Language preference
  if (lang === "es-cl") s += 100;
  else if (lang === "es-419" || lang === "es-us" || lang === "es-la") s += 85;
  else if (lang === "es-mx" || lang === "es-ar") s += 70;
  else if (lang.startsWith("es")) s += 45;

  // Neural / premium voice bonus — these are the Duolingo-quality voices
  if (name.includes("natural")) s += 65;  // Microsoft "Online (Natural)" voices
  if (name.includes("neural")) s += 60;
  if (name.includes("online")) s += 50;
  if (name.includes("enhanced")) s += 35;
  if (name.includes("premium")) s += 30;

  // Known high-quality voice names
  if (name.includes("camila")) s += 80;   // Microsoft Camila (es-CL) — near-human quality
  if (name.includes("valentina")) s += 60; // Microsoft Valentina
  if (name.includes("elena")) s += 45;    // Microsoft Elena (es-ES)
  if (name.includes("luciana")) s += 35;
  if (name.includes("google")) s += 28;   // Google voices are decent on Chrome

  return s;
}

function pickBestVoice(): SpeechSynthesisVoice | null {
  const all = window.speechSynthesis.getVoices();
  if (!all.length) return null;
  const spanish = all.filter((v) => v.lang.startsWith("es"));
  const pool = spanish.length ? spanish : all;
  return [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null;
}

/** Call once (e.g. on app load) to warm up voice list before first exercise */
export function loadTtsVoice() {
  if (typeof window === "undefined") return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    cachedVoice = pickBestVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = pickBestVoice();
    };
  }
}

export interface SpeakOpts {
  slow?: boolean;
  onEnd?: () => void;
  onError?: () => void;
}

/** Speak text. Returns a stop() function. */
export function speak(text: string, opts: SpeakOpts = {}): () => void {
  if (typeof window === "undefined") return () => {};

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);

  const voice = cachedVoice ?? pickBestVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = "es-CL";
  }

  u.rate = opts.slow ? RATE_SLOW : RATE_NORMAL;
  u.pitch = 1.0;
  u.volume = 1.0;

  if (opts.onEnd) u.onend = opts.onEnd;
  if (opts.onError) u.onerror = opts.onError;

  window.speechSynthesis.speak(u);

  return () => window.speechSynthesis.cancel();
}

export function stopSpeech() {
  if (typeof window !== "undefined") window.speechSynthesis.cancel();
}
