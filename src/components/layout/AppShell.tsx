"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { KumeGame } from "@/components/kume/KumeCharacter";
import { getKumeNavEmotion } from "@/lib/kume-messages";
import { useProgress } from "@/lib/store/progress";
import { playTap } from "@/lib/sounds";
import { music } from "@/lib/music";

function MusicToggle() {
  const [muted, setMuted] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("mapulengua-music-muted") === "1" : false
  );

  function handleToggle() {
    music.toggle();
    setMuted(music.muted);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={muted ? "Activar música" : "Silenciar música"}
      title={muted ? "Activar música" : "Silenciar música"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-dark/40 bg-white shadow-sm transition-colors active:scale-95"
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" className="text-earth-muted" />
          <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-coral" />
          <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-coral" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" className="text-teal" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45" className="text-teal" />
        </svg>
      )}
    </button>
  );
}

const tabs = [
  { href: "/", label: "Ruta", icon: "🗺️" },
  { href: "/review", label: "Diario", icon: "📔" },
  { href: "/leagues", label: "Huellas", icon: "👣" },
  { href: "/profile", label: "Mochila", icon: "🎒" },
];

export function TopBar() {
  const { progress, loaded } = useProgress();
  const emotion = loaded ? getKumeNavEmotion(progress) : "happy";

  // Auto-start music on first user touch anywhere on the page
  useEffect(() => {
    const startMusic = () => music.start("ambient");
    window.addEventListener("pointerdown", startMusic, { once: true });
    return () => window.removeEventListener("pointerdown", startMusic);
  }, []);

  return (
    <header className="app-topbar sticky top-0 z-50 border-b border-sand-dark/20 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2.5">
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-terracotta/50 bg-cream shadow-sm"
          aria-label="Mochila"
        >
          <KumeGame size={40} emotion={emotion} action="idle" navAvatar />
        </Link>

        {loaded ? (
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 rounded-full border border-sand-dark/40 bg-white px-3 py-1.5 text-sm font-extrabold text-charcoal shadow-sm"
              title="Días de viaje"
            >
              <span className="text-base leading-none">🔥</span>
              <span>{progress.streak}</span>
            </div>
            <div
              className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-extrabold text-earth shadow-sm"
              title="Recuerdos"
            >
              <span className="text-base leading-none">💎</span>
              <span>{progress.xp}</span>
            </div>
          </div>
        ) : (
          <div className="h-8 w-28 animate-pulse rounded-full bg-sand" />
        )}

        <div className="flex items-center gap-1.5">
          <MusicToggle />
          <div
            className="flex items-center gap-1 rounded-full border border-coral/30 bg-coral/10 px-3 py-1.5 text-sm font-extrabold text-coral shadow-sm"
            title="Energía"
          >
            <span className="text-base leading-none">❤️</span>
            {loaded ? (
              <span>{progress.hearts}</span>
            ) : (
              <span className="text-coral/40">—</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { loaded, getDueReviews } = useProgress();
  const dueCount = loaded ? getDueReviews().length : 0;

  return (
    <nav className="app-bottomnav sticky bottom-0 z-50 border-t border-sand-dark/40 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/" ||
                pathname.startsWith("/region") ||
                pathname.startsWith("/lesson") ||
                pathname.startsWith("/course")
              : pathname.startsWith(tab.href);

          const showBadge = tab.href === "/review" && dueCount > 0;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={playTap}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors ${
                active ? "text-terracotta" : "text-earth-muted"
              }`}
            >
              <span className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xl transition-all ${active ? "bg-terracotta/10 scale-110" : ""}`}>
                {tab.icon}
                {showBadge && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-extrabold text-white">
                    {dueCount > 9 ? "9+" : dueCount}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({
  children,
  hideNav = false,
  hideTopBar = false,
  fullBleed = false,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
  hideTopBar?: boolean;
  fullBleed?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {!hideTopBar && <TopBar />}
      <main
        className={`mx-auto w-full max-w-lg flex-1 ${fullBleed ? "" : "px-4 pb-4"} ${hideNav ? "" : "pb-2"}`}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
