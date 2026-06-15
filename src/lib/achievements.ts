import type { AchievementId, UserProgress } from "./types";
import { isRegionComplete } from "./data/regions";

export type AchievementDef = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-lesson",
    title: "Primera parada",
    description: "Completaste tu primera lección en el camino.",
    icon: "🏔️",
  },
  {
    id: "arica-complete",
    title: "Arica en el corazón",
    description: "Visitaste todas las paradas de Arica.",
    icon: "☀️",
  },
  {
    id: "la-serena-complete",
    title: "Bajo las estrellas",
    description: "Contaste hasta diez bajo el cielo de La Serena.",
    icon: "⭐",
  },
  {
    id: "valparaiso-complete",
    title: "Familia del puerto",
    description: "Aprendiste los lazos de familia en Valparaíso.",
    icon: "🌊",
  },
  {
    id: "santiago-complete",
    title: "Mesa mapuche",
    description: "Conociste los alimentos sagrados en Santiago.",
    icon: "🌿",
  },
  {
    id: "temuco-complete",
    title: "Corazón del Wallmapu",
    description: "Descubriste la naturaleza y el kultrun en Temuco.",
    icon: "🥁",
  },
  {
    id: "valdivia-complete",
    title: "Guardián del bosque",
    description: "Nombraste los animales del bosque valdiviano.",
    icon: "🦊",
  },
  {
    id: "osorno-complete",
    title: "Fuego del hogar",
    description: "Aprendiste la vida diaria junto al kütral en Osorno.",
    icon: "🏠",
  },
  {
    id: "chiloe-complete",
    title: "Palabras del archipiélago",
    description: "Escuchaste los relatos y la memoria de Chiloé.",
    icon: "📖",
  },
  {
    id: "aysen-complete",
    title: "Viento patagónico",
    description: "Dominaste el clima y el territorio de Aysén.",
    icon: "🌬️",
  },
  {
    id: "punta-arenas-complete",
    title: "Fin del camino",
    description: "Llegaste al extremo sur con Pudu. ¡Felicitaciones!",
    icon: "🏁",
  },
  {
    id: "half-journey",
    title: "Mitad del viaje",
    description: "Completaste cinco paradas en la ruta de Chile.",
    icon: "🗺️",
  },
  {
    id: "full-journey",
    title: "El gran viaje",
    description: "Completaste las diez paradas de Arica a Punta Arenas.",
    icon: "🎉",
  },
  {
    id: "streak-3",
    title: "Tres días juntos",
    description: "Pudu celebra tres días de viaje contigo.",
    icon: "🔥",
  },
  {
    id: "streak-7",
    title: "Semana de camino",
    description: "Siete días seguidos aprendiendo mapudungun.",
    icon: "🌟",
  },
  {
    id: "word-collector",
    title: "Coleccionista",
    description: "Tienes al menos 10 palabras en tu diario.",
    icon: "📔",
  },
  {
    id: "review-master",
    title: "Maestro del repaso",
    description: "Veinte repasos correctos en el diario.",
    icon: "✨",
  },
];

export function getAchievement(id: AchievementId): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

const REGION_ACHIEVEMENT_MAP: Record<string, AchievementId> = {
  "arica": "arica-complete",
  "la-serena": "la-serena-complete",
  "valparaiso": "valparaiso-complete",
  "santiago": "santiago-complete",
  "temuco": "temuco-complete",
  "valdivia": "valdivia-complete",
  "osorno": "osorno-complete",
  "chiloe": "chiloe-complete",
  "aysen": "aysen-complete",
  "punta-arenas": "punta-arenas-complete",
};

export function computeAchievements(
  progress: UserProgress,
  isLessonCompleted: (id: string) => boolean
): AchievementId[] {
  const earned = new Set<AchievementId>(progress.achievements);
  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length;

  if (completedCount >= 1) earned.add("first-lesson");
  if (progress.streak >= 3) earned.add("streak-3");
  if (progress.streak >= 7) earned.add("streak-7");
  if (progress.review.length >= 10) earned.add("word-collector");
  if (progress.reviewCorrect >= 20) earned.add("review-master");

  let regionsComplete = 0;
  for (const [regionId, achievementId] of Object.entries(REGION_ACHIEVEMENT_MAP)) {
    if (isRegionComplete(regionId, isLessonCompleted)) {
      earned.add(achievementId);
      regionsComplete++;
    }
  }

  if (regionsComplete >= 5) earned.add("half-journey");
  if (regionsComplete >= 10) earned.add("full-journey");

  return Array.from(earned);
}

export function getNewAchievements(
  before: AchievementId[],
  after: AchievementId[]
): AchievementId[] {
  const set = new Set(before);
  return after.filter((id) => !set.has(id));
}
