/** Pudu design tokens — from official Pudu mascot design guide */

export const KUME_COLORS = {
  feather: "#A67C52",        // warm brown — main fur
  featherSoft: "#7A5030",    // mid brown
  neckRuff: "#F5E9D6",       // cream belly/muzzle
  neckRuffLight: "#FAF3EA",  // lighter cream
  beak: "#F2C94C",           // gold (kultrun)
  beakLight: "#F5D66A",      // lighter gold
  beakDark: "#D4A832",       // dark gold
  tongue: "#C98070",         // ear pink / blush
  wingTip: "#F5E9D6",        // cream spots
  shadow: "#9A9A9A",
  talon: "#4B2E1E",          // dark hooves
  poncho: "#E24A2B",         // vibrant red — headband + bandana
  ponchoDark: "#BF3820",     // dark red — kultrun lines
  ponchoBorder: "#F5E9D6",   // cream — headband diamonds
  ponchoPattern: "#4B2E1E",  // dark brown
  trarilonko: "#E24A2B",     // headband red
  medallion: "#F2C94C",      // kultrun gold
  medallionInner: "#F5D66A",
  eyeWhite: "#FFFFFF",
  eyeBrown: "#1A0A00",       // very dark eyes
  eyeHighlight: "#FFFFFF",
  cheek: "#E24A2B",
  sparkle: "#F2C94C",
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
