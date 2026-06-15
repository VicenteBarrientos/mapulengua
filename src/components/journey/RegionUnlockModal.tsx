"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Region } from "@/lib/types";
import { KumeHero } from "@/components/kume/KumeHero";
import { playUnlock } from "@/lib/sounds";

type Props = {
  region: Region;
  onDismiss: () => void;
};

export function RegionUnlockModal({ region, onDismiss }: Props) {
  useEffect(() => {
    playUnlock();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm animate-slide-up"
      role="dialog"
      aria-labelledby="unlock-title"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-teal/40 bg-cream shadow-2xl animate-modal-spring">
        <div
          className="px-6 py-5 text-center"
          style={{
            background: `linear-gradient(180deg, ${region.theme.skyFrom}33 0%, transparent 100%)`,
          }}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-teal">
            Nueva parada desbloqueada
          </p>
          <KumeHero emotion="celebrating" animation="unlock" size={130} className="my-3" />
          <h2 id="unlock-title" className="text-2xl font-extrabold text-terracotta">
            {region.name}
          </h2>
          <p className="mt-1 text-sm font-semibold text-charcoal">{region.topic}</p>
          <p className="mt-2 text-sm leading-relaxed text-earth-muted">{region.subtitle}</p>
          <p className="mt-3 rounded-xl bg-sand/60 px-3 py-2 text-sm italic text-earth-muted">
            {region.theme.kumeWelcome}
          </p>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          <Link
            href={`/region/${region.id}`}
            onClick={onDismiss}
            className="rounded-2xl bg-terracotta py-4 text-center text-base font-extrabold text-white shadow-lg shadow-terracotta/25 active:scale-[0.98]"
          >
            Explorar {region.name} →
          </Link>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-2xl border-2 border-sand-dark py-3 text-sm font-bold text-earth-muted active:scale-[0.98]"
          >
            Seguir en la ruta
          </button>
        </div>
      </div>
    </div>
  );
}
