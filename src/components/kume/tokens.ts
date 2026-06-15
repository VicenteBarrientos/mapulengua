/** Küme design bible — extracted from kume-design-guide.png */

export const KUME_COLORS = {
  feather: "#1a1a1a",
  featherSoft: "#2d2d2d",
  neckRuff: "#f5f0e8",
  beak: "#c4956a",
  beakDark: "#a67c52",
  talon: "#1a1a1a",
  poncho: "#c8542a",
  ponchoDark: "#a8431f",
  ponchoBorder: "#f5f0e8",
  ponchoPattern: "#1a1a1a",
  trarilonko: "#c8542a",
  medallion: "#b8860b",
  medallionInner: "#d4a853",
  eyeWhite: "#faf6f0",
  eyeBrown: "#5c3d2e",
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

/** Sprite crops on /kume/kume-design-guide.png (% position, scale multiplier) */
export const KUME_SPRITES: Record<
  KumeEmotion | "hero" | "blink",
  { x: string; y: string; scale: number }
> = {
  hero: { x: "11%", y: "42%", scale: 5.4 },
  happy: { x: "43%", y: "24%", scale: 7.8 },
  excited: { x: "57%", y: "24%", scale: 7.8 },
  thinking: { x: "43%", y: "38%", scale: 7.8 },
  proud: { x: "71%", y: "38%", scale: 7.8 },
  sad: { x: "43%", y: "38%", scale: 7.8 },
  celebrating: { x: "57%", y: "38%", scale: 7.8 },
  blink: { x: "71%", y: "38%", scale: 7.8 },
};

export const EMOTION_LABELS: Record<KumeEmotion, string> = {
  happy: "Feliz",
  excited: "Motivado",
  thinking: "Pensativo",
  proud: "Orgulloso",
  sad: "Preocupado",
  celebrating: "Celebrando",
};
