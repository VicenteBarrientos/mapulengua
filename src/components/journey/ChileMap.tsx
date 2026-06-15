"use client";

import Link from "next/link";
import type { Region } from "@/lib/types";
import type { KumeEmotion } from "@/components/kume/tokens";
import { getStopKumeEmotion } from "@/lib/kume-messages";
import { RegionLandscape } from "./RegionLandscape";
import { Kume } from "@/components/kume/Kume";

type Props = {
  regions: Region[];
  isUnlocked: (id: string) => boolean;
  isComplete: (id: string) => boolean;
  currentRegionId?: string;
};

export function ChileJourneyMap({
  regions,
  isUnlocked,
  isComplete,
  currentRegionId,
}: Props) {
  const sorted = [...regions].sort((a, b) => a.order - b.order);

  return (
    <div className="relative px-4 pb-8 pt-2">
      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-widest text-earth-muted">
          ↑ Norte
        </span>
        <span className="rounded-full bg-terracotta/15 px-3 py-1 text-xs font-extrabold text-terracotta">
          Ruta hacia el sur
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-earth-muted">
          Sur ↓
        </span>
      </div>

      <div className="absolute bottom-16 left-1/2 top-16 w-1 -translate-x-1/2 rounded-full bg-sand-dark/40" />

      <div className="relative space-y-4">
        {sorted.map((region, i) => {
          const unlocked = isUnlocked(region.id);
          const complete = isComplete(region.id);
          const current = region.id === currentRegionId;
          const offset = i % 2 === 0 ? "mr-auto pl-2" : "ml-auto pr-2";

          return (
            <div key={region.id} className={`relative w-[88%] ${offset}`}>
              <div
                className={`absolute top-8 z-10 h-4 w-4 rounded-full border-2 ${
                  complete
                    ? "border-sage bg-sage"
                    : current
                      ? "border-terracotta bg-terracotta animate-pulse-soft"
                      : unlocked
                        ? "border-teal bg-white"
                        : "border-sand-dark bg-sand"
                } ${i % 2 === 0 ? "-right-2" : "-left-2"}`}
              />

              {unlocked ? (
                <Link href={`/region/${region.id}`} className="block">
                  <RegionMapCard
                    region={region}
                    complete={complete}
                    current={current}
                    locked={false}
                  />
                </Link>
              ) : (
                <RegionMapCard
                  region={region}
                  complete={false}
                  current={false}
                  locked
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <Kume size={88} emotion="happy" animation="idle" className="mb-2" />
        <p className="max-w-xs text-sm font-semibold text-earth-muted">
          Cada parada es una ciudad chilena. Küme te guía hacia el Wallmapu.
        </p>
      </div>
    </div>
  );
}

function RegionMapCard({
  region,
  complete,
  current,
  locked,
}: {
  region: Region;
  complete: boolean;
  current: boolean;
  locked: boolean;
}) {
  const comingSoon = !locked && region.lessons.length === 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 shadow-md transition-transform active:scale-[0.98] ${
        locked
          ? "border-sand-dark/50 opacity-60"
          : current
            ? "border-terracotta shadow-terracotta/20"
            : complete
              ? "border-sage/50"
              : comingSoon
                ? "border-sand-dark/70"
                : "border-sand-dark"
      }`}
    >
      <div className="relative h-24 overflow-hidden">
        <RegionLandscape kind={region.theme.landscape} className="h-full w-full" />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
            <span className="text-3xl">🔒</span>
          </div>
        )}
        <div className="absolute left-3 top-2 rounded-full bg-terracotta/90 px-2 py-0.5 text-[10px] font-bold text-white">
          {region.topic}
        </div>
        <div className="absolute bottom-2 left-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">
          {region.latitude}
        </div>
      </div>
      <div className="bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-charcoal">{region.name}</h3>
            <p className="text-xs text-earth-muted">{region.subtitle}</p>
          </div>
          {complete && <span className="text-xl">✓</span>}
          {current && !complete && (
            <span className="rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-bold text-white">
              Aquí
            </span>
          )}
          {locked && <span className="text-lg">🔒</span>}
        </div>
        {!locked && region.lessons.length > 0 && (
          <p className="mt-2 text-xs font-bold text-terracotta">
            {region.lessons.length} paradas →
          </p>
        )}
        {comingSoon && (
          <p className="mt-2 text-xs font-semibold text-earth-muted">
            Próximamente — Küme prepara esta parada
          </p>
        )}
        {locked && (
          <p className="mt-2 text-xs text-earth-muted">Completa la parada anterior</p>
        )}
      </div>
    </div>
  );
}

export function KumeTravelBanner({
  message,
  emotion = "excited",
}: {
  message: string;
  emotion?: KumeEmotion;
}) {
  return (
    <div className="mx-4 flex items-center gap-3 rounded-2xl border-2 border-teal/20 bg-gradient-to-r from-sky/20 to-cream px-4 py-3">
      <Kume size={64} emotion={emotion} animation="wingFlap" />
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
          Küme, tu guía
        </p>
        <p className="text-sm font-semibold leading-snug text-charcoal">{message}</p>
      </div>
    </div>
  );
}

export function KumeStopGuide({
  region,
  unlocked,
  complete,
  isCurrent,
}: {
  region: Region;
  unlocked: boolean;
  complete: boolean;
  isCurrent: boolean;
}) {
  const emotion = getStopKumeEmotion(region, unlocked, complete, isCurrent);
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-teal/20 bg-white px-4 py-3 shadow-sm">
      <Kume size={72} emotion={emotion} animation={isCurrent ? "idle" : "none"} />
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
          {region.name} · {region.topic}
        </p>
        <p className="text-sm font-semibold leading-snug text-charcoal">
          {region.theme.kumeWelcome}
        </p>
      </div>
    </div>
  );
}
