"use client";

import Link from "next/link";
import type { Region } from "@/lib/types";
import type { JourneyKumeVariant } from "@/components/kume/JourneyKume";
import { toJourneyVariant } from "@/components/kume/JourneyKume";
import { KumeSpeechBubble } from "@/components/kume/KumeSpeechBubble";
import { getStopKumeEmotion } from "@/lib/kume-messages";
import { RegionLandscape } from "./RegionLandscape";
import { KumeHero } from "@/components/kume/KumeHero";

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
            <div
              key={region.id}
              className={`relative w-[88%] ${offset} animate-stagger`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
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
        <KumeHero emotion="happy" animation="float" size={100} className="mb-2" />
        <p className="max-w-xs text-sm font-semibold text-earth-muted">
          Cada parada es una ciudad chilena. Pudu te guía hacia el Wallmapu.
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
      className={`overflow-hidden rounded-2xl border shadow-sm transition-all active:scale-[0.98] ${
        locked
          ? "border-sand-dark/40 opacity-55"
          : current
            ? "border-terracotta/70 shadow-terracotta/15 shadow-md"
            : complete
              ? "border-sage/40"
              : comingSoon
                ? "border-sand-dark/50"
                : "border-sand-dark/60"
      }`}
    >
      <div className="relative h-28 overflow-hidden">
        <RegionLandscape kind={region.theme.landscape} className="h-full w-full" />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40 backdrop-blur-[1px]">
            <span className="text-3xl drop-shadow">🔒</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute left-3 top-2.5 rounded-full bg-terracotta/95 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
          {region.topic}
        </div>
        {complete && (
          <div className="absolute right-3 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-sage shadow-sm">
            <span className="text-xs font-extrabold text-white">✓</span>
          </div>
        )}
        <div className="absolute bottom-2 left-3 text-[10px] font-bold text-white/80 drop-shadow">
          {region.latitude}
        </div>
      </div>
      <div className="bg-cream/60 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-charcoal">{region.name}</h3>
            <p className="mt-0.5 text-xs text-earth-muted">{region.subtitle}</p>
          </div>
          {current && !complete && (
            <span className="mt-0.5 rounded-full bg-terracotta px-2.5 py-0.5 text-[10px] font-extrabold text-white">
              Aquí
            </span>
          )}
        </div>
        {!locked && region.lessons.length > 0 && (
          <p className="mt-2 text-xs font-bold text-terracotta">
            {region.lessons.length} paradas →
          </p>
        )}
        {comingSoon && (
          <p className="mt-2 text-xs font-medium text-earth-muted">
            Próximamente — Pudu prepara esta parada
          </p>
        )}
        {locked && (
          <p className="mt-2 text-xs text-earth-muted">Completa la parada anterior</p>
        )}
      </div>
    </div>
  );
}

const VARIANT_HERO_ANIM = {
  happy: "float",
  excited: "unlock",
  thinking: "float",
} as const;

export function KumeTravelBanner({
  message,
  variant = "excited",
}: {
  message: string;
  variant?: JourneyKumeVariant;
}) {
  return (
    <div className="mx-4 overflow-visible px-1">
      <KumeSpeechBubble
        variant="hero"
        emotion={variant}
        heroAnimation={VARIANT_HERO_ANIM[variant]}
        speaking
        size={88}
        layout="beside"
        className="items-end gap-2"
      >
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
          Pudu, tu guía
        </p>
        <p className="text-sm font-semibold leading-snug text-charcoal">{message}</p>
      </KumeSpeechBubble>
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
  const variant = toJourneyVariant(emotion);
  return (
    <KumeSpeechBubble
      variant="hero"
      emotion={variant}
      heroAnimation={isCurrent ? "wave" : VARIANT_HERO_ANIM[variant]}
      speaking={isCurrent}
      size={100}
      layout="beside"
      className="items-end gap-3 rounded-2xl border-2 border-teal/20 bg-white px-4 py-3 shadow-sm"
    >
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
        {region.name} · {region.topic}
      </p>
      <p className="text-sm font-semibold leading-snug text-charcoal">
        {region.theme.kumeWelcome}
      </p>
    </KumeSpeechBubble>
  );
}
