"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChileJourneyMap, KumeTravelBanner } from "@/components/journey/ChileMap";
import { RegionUnlockModal } from "@/components/journey/RegionUnlockModal";
import { KumeOnboarding } from "@/components/kume/KumeScenes";
import { DailyGoal } from "@/components/journey/DailyGoal";
import { PwaInstallBanner } from "@/components/ui/PwaInstallBanner";
import {
  regions,
  getPlayableRegion,
  getRegion,
  isRegionComplete,
  isRegionUnlocked,
} from "@/lib/data/regions";
import { getJourneyBanner } from "@/lib/kume-messages";
import { useProgress } from "@/lib/store/progress";
import { preloadSounds } from "@/lib/sounds";
import { loadTtsVoice } from "@/lib/tts";
import type { Region } from "@/lib/types";

const UNLOCK_KEY = "mapulengua-seen-unlocks";

export default function HomePage() {
  const { loaded, isLessonCompleted, recordActivity, progress } = useProgress();
  const [unlockRegion, setUnlockRegion] = useState<Region | null>(null);
  const unlockChecked = useRef(false);

  useEffect(() => {
    preloadSounds();
    loadTtsVoice(); // warm up voice list so first exercise plays instantly
  }, []);

  useEffect(() => {
    if (loaded) recordActivity();
  }, [loaded, recordActivity]);

  useEffect(() => {
    if (!loaded || unlockChecked.current) return;
    unlockChecked.current = true;

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
      const region = getRegion(newlyUnlocked[0]);
      if (region) setUnlockRegion(region);
      localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlockedIds));
    } else if (seen.length === 0) {
      localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlockedIds));
    }
  }, [loaded, isLessonCompleted]);

  function dismissUnlock() {
    setUnlockRegion(null);
  }

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
      <PwaInstallBanner />
      {unlockRegion && <RegionUnlockModal region={unlockRegion} onDismiss={dismissUnlock} />}
      <header className="relative overflow-hidden border-b border-sand-dark/25 bg-gradient-to-b from-sky/30 via-sky/10 to-cream px-4 pb-5 pt-3">
        <div className="nimin-pattern-top absolute inset-x-0 top-0 opacity-30" />
        <p className="mt-1 text-center text-[10px] font-extrabold uppercase tracking-[0.25em] text-teal">
          Mapulengua
        </p>
        <h1 className="text-center text-2xl font-extrabold leading-tight text-charcoal">
          Viaje por Chile con Pudu
        </h1>
        <p className="mt-1 text-center text-sm font-medium text-earth-muted">
          Diez paradas del norte al sur — solo toca la pantalla
        </p>
      </header>

      {loaded && <DailyGoal progress={progress} />}

      {loaded && (
        <div className="py-4">
          <KumeTravelBanner message={banner.message} variant={banner.variant} />
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
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-terracotta py-4 text-base font-extrabold text-white shadow-md shadow-terracotta/35 active:scale-[0.98] active:shadow-sm"
          >
            <span className="nimin-pattern-top pointer-events-none absolute inset-x-0 top-0 opacity-25" />
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
