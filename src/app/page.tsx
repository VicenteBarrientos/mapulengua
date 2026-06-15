"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChileJourneyMap, KumeTravelBanner } from "@/components/journey/ChileMap";
import { KumeOnboarding, KumeStreak } from "@/components/kume/KumeScenes";
import {
  regions,
  getPlayableRegion,
  isRegionComplete,
  isRegionUnlocked,
} from "@/lib/data/regions";
import { getJourneyBanner } from "@/lib/kume-messages";
import { useProgress } from "@/lib/store/progress";
import { playUnlock, preloadSounds } from "@/lib/sounds";

const UNLOCK_KEY = "mapulengua-seen-unlocks";

export default function HomePage() {
  const { loaded, isLessonCompleted, recordActivity, progress } = useProgress();
  const unlockPlayed = useRef(false);

  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    if (loaded) recordActivity();
  }, [loaded, recordActivity]);

  useEffect(() => {
    if (!loaded || unlockPlayed.current) return;

    const unlockedIds = regions
      .filter((r) => isRegionUnlocked(r.id, isLessonCompleted))
      .map((r) => r.id);

    let seen: string[] = [];
    try {
      seen = JSON.parse(localStorage.getItem(UNLOCK_KEY) ?? "[]");
    } catch {
      seen = [];
    }

    const newlyUnlocked = unlockedIds.filter((id) => !seen.includes(id) && id !== "arica");
    if (newlyUnlocked.length > 0) {
      playUnlock();
      unlockPlayed.current = true;
      localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlockedIds));
    } else if (seen.length === 0) {
      localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlockedIds));
    }
  }, [loaded, isLessonCompleted]);

  const playableRegion = getPlayableRegion(isLessonCompleted);

  const currentRegion =
    playableRegion ??
    regions.find(
      (r) =>
        isRegionUnlocked(r.id, isLessonCompleted) &&
        !isRegionComplete(r.id, isLessonCompleted)
    ) ??
    regions[0];

  const banner = getJourneyBanner({
    currentRegion,
    playableRegion,
    isLessonCompleted,
    streak: progress.streak,
  });

  return (
    <AppShell fullBleed>
      <KumeOnboarding />
      <header className="border-b border-sand-dark/30 bg-gradient-to-b from-sky/20 to-cream px-4 pb-4 pt-2">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-teal">
          Mapulengua
        </p>
        <h1 className="text-center text-xl font-extrabold text-charcoal">
          Viaje por Chile con Küme
        </h1>
        <p className="mt-1 text-center text-sm text-earth-muted">
          Diez paradas del norte al sur — solo toca la pantalla
        </p>
      </header>

      {loaded && progress.streak >= 3 && (
        <div className="mx-4 mb-2 mt-3 flex items-center gap-3 rounded-2xl border-2 border-gem/30 bg-gem/10 px-4 py-3">
          <KumeStreak streak={progress.streak} size={56} />
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gem">
              Racha de {progress.streak} días
            </p>
            <p className="text-sm font-semibold text-charcoal">
              {progress.streak >= 7
                ? "¡Küme está orgulloso de tu constancia!"
                : "Küme celebra que sigues en el camino."}
            </p>
          </div>
        </div>
      )}

      {loaded && (
        <div className="py-4">
          <KumeTravelBanner message={banner.message} emotion={banner.emotion} />
        </div>
      )}

      {loaded && (
        <ChileJourneyMap
          regions={regions}
          isUnlocked={(id) => isRegionUnlocked(id, isLessonCompleted)}
          isComplete={(id) => isRegionComplete(id, isLessonCompleted)}
          currentRegionId={currentRegion?.id}
        />
      )}

      {loaded && playableRegion && (
        <div className="sticky bottom-20 z-40 px-4 pb-2">
          <Link
            href={`/region/${playableRegion.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta py-4 text-base font-extrabold text-white shadow-lg shadow-terracotta/30 active:scale-[0.98]"
          >
            Continuar viaje → {playableRegion.name}
          </Link>
        </div>
      )}

      <footer className="px-4 pb-6 text-center">
        <p className="text-[11px] leading-relaxed text-earth-muted">
          Honramos la lengua mapuche en cada parada del camino.
        </p>
      </footer>
    </AppShell>
  );
}
