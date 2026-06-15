"use client";

import { useState } from "react";
import type { UserProgress } from "@/lib/types";

type Props = {
  progress: UserProgress;
  regionsVisited: number;
};

function buildShareText(progress: UserProgress, regionsVisited: number): string {
  const { streak, xp } = progress;
  const lessons = Object.values(progress.lessons).filter((l) => l.completed).length;
  const words = progress.review.length;

  const streakLine =
    streak >= 7
      ? `Llevo ${streak} días seguidos aprendiendo mapudungun con Pudu.`
      : streak >= 2
      ? `Llevo ${streak} días aprendiendo mapudungun con Pudu.`
      : `Empecé a aprender mapudungun con Pudu.`;

  const statsLine =
    regionsVisited >= 5
      ? `Ya recorrí ${regionsVisited} regiones de Chile y coleccioné ${words} palabras en ${lessons} lecciones.`
      : `Ya recorrí ${regionsVisited} región${regionsVisited !== 1 ? "es" : ""} de Chile y completé ${lessons} lección${lessons !== 1 ? "es" : ""}.`;

  return `${streakLine} ${statsLine} (${xp} XP)`;
}

export function ShareProgressButton({ progress, regionsVisited }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "shared" | "copied">("idle");

  const text = buildShareText(progress, regionsVisited);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  async function handleShare() {
    if (typeof navigator === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mapulengua — Aprende Mapudungun",
          text,
          url,
        });
        setStatus("shared");
      } catch {
        // user cancelled — no error needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2500);
      } catch {
        // clipboard blocked
      }
    }
  }

  const { streak, xp } = progress;
  const lessons = Object.values(progress.lessons).filter((l) => l.completed).length;
  const words = progress.review.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-terracotta/30 py-3.5 text-sm font-extrabold text-terracotta transition-transform active:scale-[0.98]"
      >
        Compartir mi progreso
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 pb-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#c8542a] to-[#8c3218] px-6 py-8 text-white">
              <div className="nimin-pattern-top pointer-events-none absolute inset-x-0 top-0 opacity-15" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] opacity-80">
                Mapulengua
              </p>
              <p className="mt-1 text-xl font-extrabold leading-tight">
                Viaje por Chile con Pudu
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="Días de racha" value={streak} />
                <Stat label="Regiones" value={`${regionsVisited}/10`} />
                <Stat label="Lecciones" value={lessons} />
                <Stat label="Palabras" value={words} />
              </div>

              <p className="mt-4 text-xs opacity-60">
                {xp} XP · mapudungun · Chile
              </p>
            </div>

            {/* Share text preview */}
            <div className="border-b border-sand-dark/20 px-5 py-4">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-earth-muted">
                Texto a compartir
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{text}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 px-5 py-4">
              <button
                type="button"
                onClick={handleShare}
                className="w-full rounded-2xl bg-terracotta py-3.5 text-base font-extrabold text-white shadow-sm shadow-terracotta/30 transition-transform active:scale-[0.98]"
              >
                {status === "shared"
                  ? "¡Compartido!"
                  : status === "copied"
                  ? "¡Copiado al portapapeles!"
                  : typeof navigator !== "undefined" && "share" in navigator
                  ? "Compartir"
                  : "Copiar texto"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl py-3 text-sm font-bold text-earth-muted"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2.5">
      <p className="text-lg font-extrabold leading-none">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold opacity-75">{label}</p>
    </div>
  );
}
