import type { KumeEmotion } from "@/components/kume/tokens";
import type { Region } from "@/lib/types";
import { getPlayableRegion, isRegionComplete, isRegionUnlocked, regions } from "@/lib/data/regions";

type BannerContext = {
  currentRegion?: Region;
  playableRegion?: Region;
  isLessonCompleted: (id: string) => boolean;
  streak: number;
};

export function getJourneyBanner(context: BannerContext): {
  message: string;
  emotion: KumeEmotion;
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
          emotion: "proud",
        };
      }
    }
    return {
      message: "Cada palabra te acerca más al Wallmapu. Küme camina contigo.",
      emotion: "happy",
    };
  }

  if (playableRegion.order === 1 && !isRegionComplete("arica", isLessonCompleted)) {
    return {
      message: "Mari mari. Empezamos el viaje en Arica.",
      emotion: "excited",
    };
  }

  if (streak >= 7) {
    return {
      message: "Has avanzado hacia el sur. Küme celebra tu racha de viaje.",
      emotion: "celebrating",
    };
  }

  if (currentRegion && currentRegion.lessons.length === 0 && isRegionUnlocked(currentRegion.id, isLessonCompleted)) {
    return {
      message: `Nueva parada desbloqueada: ${currentRegion.name}. Pronto: ${currentRegion.topic}.`,
      emotion: "excited",
    };
  }

  return {
    message: playableRegion.theme.kumeWelcome,
    emotion: "happy",
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
