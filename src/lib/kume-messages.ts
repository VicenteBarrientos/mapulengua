import type { JourneyKumeVariant } from "@/components/kume/JourneyKume";
import type { KumeEmotion } from "@/components/kume/tokens";
import type { Region, UserProgress } from "@/lib/types";
import { getPlayableRegion, isRegionComplete, isRegionUnlocked, regions } from "@/lib/data/regions";

type BannerContext = {
  currentRegion?: Region;
  playableRegion?: Region;
  isLessonCompleted: (id: string) => boolean;
  streak: number;
};

export function getJourneyBanner(context: BannerContext): {
  message: string;
  variant: JourneyKumeVariant;
} {
  const { playableRegion, currentRegion, isLessonCompleted, streak } = context;

  if (!playableRegion) {
    const lastComplete = [...regions]
      .reverse()
      .find((r) => r.lessons.length > 0 && isRegionComplete(r.id, isLessonCompleted));

    if (lastComplete) {
      const next = regions.find((r) => r.order === lastComplete.order + 1);
      if (next) {
        return {
          message: `¡Welu! ${lastComplete.name} quedó atrás. ${next.name} nos espera: ${next.topic}.`,
          variant: "happy",
        };
      }
    }
    return {
      message: "Cada palabra te acerca más al Wallmapu. Pudu camina contigo.",
      variant: "happy",
    };
  }

  if (playableRegion.order === 1 && !isRegionComplete("arica", isLessonCompleted)) {
    return {
      message: "Mari mari. Empezamos el viaje en Arica.",
      variant: "excited",
    };
  }

  if (streak >= 7) {
    return {
      message: "Has avanzado hacia el sur. Pudu celebra tu racha de viaje.",
      variant: "excited",
    };
  }

  if (currentRegion && currentRegion.lessons.length === 0 && isRegionUnlocked(currentRegion.id, isLessonCompleted)) {
    return {
      message: `Nueva parada desbloqueada: ${currentRegion.name}. Pronto: ${currentRegion.topic}.`,
      variant: "excited",
    };
  }

  return {
    message: playableRegion.theme.kumeWelcome,
    variant: "happy",
  };
}

export function getStopKumeEmotion(
  region: Region,
  unlocked: boolean,
  complete: boolean,
  isCurrent: boolean
): KumeEmotion {
  if (!unlocked) return "thinking";
  if (complete) return "proud";
  if (isCurrent) return "excited";
  if (region.lessons.length === 0) return "thinking";
  return "happy";
}

export function getPlayableRegionForUser(
  isLessonCompleted: (id: string) => boolean
): Region | undefined {
  return getPlayableRegion(isLessonCompleted);
}

/** Nav avatar mood from journey state — Finch-inspired gentle persistence */
export function getKumeNavEmotion(progress: UserProgress): KumeEmotion {
  if (progress.hearts === 0) return "sad";
  if (progress.streak >= 7) return "celebrating";
  if (progress.streak >= 3) return "excited";

  const todayStr = new Date().toISOString().slice(0, 10);
  if (progress.lastActiveDate && progress.lastActiveDate !== todayStr) {
    const last = new Date(progress.lastActiveDate);
    const now = new Date(todayStr);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
    if (diffDays >= 2) return "thinking";
  }

  return "happy";
}
