"use client";

import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export function PwaInstallBanner() {
  const { state, visible, dismiss } = usePwaInstall();

  if (!visible || state.type === "unavailable") return null;

  return (
    <div className="fixed bottom-[72px] inset-x-0 z-40 flex justify-center px-3 animate-slide-up">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-terracotta/25 bg-cream shadow-lg shadow-black/10">
        <div className="h-1 w-full bg-gradient-to-r from-terracotta via-gold to-sage" />
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 3v13M12 3l-4 4M12 3l4 4M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1"
                stroke="#c8542a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-terracotta">
              Instalar app
            </p>
            {state.type === "ios" ? (
              <p className="text-xs leading-snug text-charcoal">
                Toca <strong>Compartir</strong> y luego{" "}
                <strong>Agregar a pantalla de inicio</strong>
              </p>
            ) : (
              <p className="text-xs leading-snug text-charcoal">
                Agrega Mapulengua a tu pantalla de inicio
              </p>
            )}
          </div>
          {state.type === "ready" && (
            <button
              type="button"
              onClick={state.trigger}
              className="shrink-0 rounded-xl bg-terracotta px-3 py-1.5 text-xs font-extrabold text-white active:scale-95"
            >
              Instalar
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            className="shrink-0 rounded-full p-1 text-earth-muted active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
