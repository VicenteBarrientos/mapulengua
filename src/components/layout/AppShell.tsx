"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KumeGame } from "@/components/kume/KumeCharacter";
import { useProgress } from "@/lib/store/progress";

const tabs = [
  { href: "/", label: "Ruta", icon: "🗺️" },
  { href: "/review", label: "Diario", icon: "📔" },
  { href: "/leagues", label: "Huellas", icon: "👣" },
  { href: "/profile", label: "Mochila", icon: "🎒" },
];

export function TopBar() {
  const { progress, loaded } = useProgress();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-terracotta/30 bg-cream"
          aria-label="Mochila"
        >
          <KumeGame size={40} emotion="happy" action="idle" />
        </Link>

        {loaded ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-charcoal" title="Días de viaje">
              <span className="text-xl">🔥</span>
              <span>{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-gem" title="Recuerdos">
              <span className="text-xl">💎</span>
              <span>{progress.xp}</span>
            </div>
          </div>
        ) : (
          <div className="h-6 w-24 animate-pulse rounded-full bg-sand" />
        )}

        <div className="flex h-10 w-10 items-center justify-center gap-0.5 font-bold text-coral" title="Energía">
          <span className="text-lg">❤️</span>
          {loaded && <span className="text-sm">{progress.hearts}</span>}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 border-t border-sand-dark/40 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/" ||
                pathname.startsWith("/region") ||
                pathname.startsWith("/lesson") ||
                pathname.startsWith("/course")
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors ${
                active ? "text-terracotta" : "text-earth-muted"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
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
  fullBleed = false,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
  fullBleed?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <TopBar />
      <main
        className={`mx-auto w-full max-w-lg flex-1 ${fullBleed ? "" : "px-4 pb-4"} ${hideNav ? "" : "pb-2"}`}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
