/** Küme design tokens — colors, proportions, personality (internal reference) */

export const KUME_COLORS = {
  feather: "#1a1a1a",
  featherSoft: "#2a2a2a",
  neckRuff: "#f5f2e9",
  neckRuffLight: "#faf8f3",
  beak: "#f0b84a",
  beakLight: "#f5cc6a",
  beakDark: "#d9a03a",
  tongue: "#c44a4a",
  wingTip: "#f5f2e9",
  shadow: "#9a9a9a",
  talon: "#1a1a1a",
  poncho: "#b33a27",
  ponchoDark: "#8f2e1f",
  ponchoBorder: "#f5f2e9",
  ponchoPattern: "#1a1a1a",
  trarilonko: "#b33a27",
  medallion: "#c5944e",
  medallionInner: "#d4a853",
  eyeWhite: "#faf6f0",
  eyeBrown: "#6b4423",
  eyeHighlight: "#ffffff",
  cheek: "#c8542a",
  sparkle: "#d4a853",
} as const;

/** Head ≈ 35% of total height; body pear-shaped; wings as arms */
export const KUME_PROPORTIONS = {
  headToBody: 0.35,
  eyeSizeRatio: 0.12,
  beakWidthRatio: 0.18,
  wingReachRatio: 0.45,
} as const;

export const KUME_PERSONALITY = {
  role: "Guía de viaje — sabio, curioso y cercano",
  tone: "Warm, encouraging, never academic or scolding",
  voice: "Uses travel metaphors: camino, parada, recuerdos",
} as const;

export const KUME_CLOTHING = {
  trarilonko: "Mapuche headband — terracotta with white/black diamond ñimin",
  makun: "Terracotta poncho with geometric stepped border",
  kultrun: "Bronze chest medallion with kultrun (four-fold drum) symbol",
} as const;

export type KumeEmotion =
  | "happy"       // Feliz
  | "excited"     // Motivado / ¡Tú puedes!
  | "thinking"    // Pensativo
  | "proud"       // Orgulloso
  | "sad"         // Derived — gentle concern (no guide frame)
  | "celebrating"; // Orgulloso + Motivado energy

export type KumeAnimation =
  | "idle"
  | "blink"
  | "wingFlap"
  | "celebrate"
  | "heartLoss"
  | "lessonComplete"
  | "none";

export const EMOTION_LABELS: Record<KumeEmotion, string> = {
  happy: "Feliz",
  excited: "Motivado",
  thinking: "Pensativo",
  proud: "Orgulloso",
  sad: "Preocupado",
  celebrating: "Celebrando",
};
