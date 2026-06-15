"use client";

import { AppShell } from "@/components/layout/AppShell";
import { XpBar } from "@/components/ui/Stats";
import { KumeHero } from "@/components/kume/KumeHero";
import { ACHIEVEMENTS, getAchievement } from "@/lib/achievements";
import { regions } from "@/lib/data/regions";
import { useProgress } from "@/lib/store/progress";
import { ShareProgressButton } from "@/components/journey/ShareProgress";
import type { AchievementId } from "@/lib/types";

export default function ProfilePage() {
  const { progress, loaded, isLessonCompleted, getDueReviews } = useProgress();

  const regionsVisited = regions.filter((r) =>
    r.lessons.some((l) => isLessonCompleted(l.id))
  ).length;

  const dueReviews = loaded ? getDueReviews().length : 0;
  const level = Math.floor(progress.xp / 100) + 1;

  return (
    <AppShell>
      <div className="py-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <KumeHero emotion="proud" animation="bounce" size={140} className="mb-3" />
          <h1 className="text-xl font-extrabold text-charcoal">Tu mochila</h1>
          <p className="text-sm text-earth-muted">Viajero del mapudungun · Nivel {level}</p>
        </div>

        {loaded && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-sand-dark/50 bg-white shadow-sm">
              <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-light to-gem" />
              <div className="p-4">
                <XpBar xp={progress.xp} />
                <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                  <StatCard value={progress.xp} label="Recuerdos" icon={<GemIcon />} />
                  <StatCard value={progress.streak} label="Días" icon={<FlameIcon />} />
                  <StatCard value={regionsVisited} label="Regiones" icon={<MapIcon />} />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-teal/25 bg-teal/5 shadow-sm">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
                    Diario de viaje
                  </p>
                  <p className="mt-1 text-sm font-semibold text-charcoal">
                    {progress.review.length} palabras coleccionadas
                  </p>
                  {dueReviews > 0 && (
                    <p className="mt-0.5 text-xs font-bold text-terracotta">
                      {dueReviews} listas para repasar
                    </p>
                  )}
                </div>
                <BookIcon />
              </div>
            </div>

            <ShareProgressButton progress={progress} regionsVisited={regionsVisited} />

            <div>
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-earth-muted">
                Logros del camino
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {ACHIEVEMENTS.map((def) => {
                  const earned = progress.achievements.includes(def.id);
                  return (
                    <AchievementCard key={def.id} id={def.id} earned={earned} />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function GemIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L2 9l10 13L22 9 12 2z" fill="#5B4FC8" opacity="0.85"/>
      <path d="M2 9h20M7 2l-5 7M17 2l5 7M12 2L7 9M12 2l5 7" stroke="#5B4FC8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2C10 5.5 7.5 7 7.5 10.5C7.5 12.5 8.5 14 9.5 15C9 13 10 11.5 11.5 11C10.5 13.5 11 16 13.5 17.5C12 15.5 12.5 13 14 12C13.5 14.5 14.5 17 12.5 19C15.5 18 17 15.5 17 13C17 10.5 15.5 8.5 15.5 8.5C15 10 14 10.5 13.5 10C14 8 14.5 5 12 2Z" fill="#E24A2B"/>
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" stroke="#c8542a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3v15M15 6v15" stroke="#c8542a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 4h7a1 1 0 011 1v14a1 1 0 01-1-1H4V4z" fill="#2A9D8F" opacity="0.2"/>
      <path d="M20 4h-7a1 1 0 00-1 1v14a1 1 0 001-1h7V4z" fill="#2A9D8F" opacity="0.12"/>
      <path d="M4 4h7a1 1 0 011 1v14a1 1 0 01-1-1H4V4zM20 4h-7a1 1 0 00-1 1v14a1 1 0 001-1h7V4z" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5v14" stroke="#2A9D8F" strokeWidth="1.5"/>
    </svg>
  );
}

function StatCard({ value, label, icon }: { value: number | string; label: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-sand-dark/30 bg-sand/40 py-3 flex flex-col items-center gap-1">
      {icon}
      <p className="text-xl font-extrabold text-charcoal leading-none">{value}</p>
      <p className="text-[11px] font-semibold text-earth-muted">{label}</p>
    </div>
  );
}

function AchievementCard({ id, earned }: { id: AchievementId; earned: boolean }) {
  const def = getAchievement(id);
  if (!def) return null;

  return (
    <div
      className={`overflow-hidden rounded-xl border p-3 transition-all ${
        earned
          ? "achievement-earned border-gem/35 bg-gradient-to-br from-gem/12 to-gold/8 shadow-sm"
          : "border-sand-dark/40 bg-sand/25 opacity-45 grayscale"
      }`}
    >
      <p className="text-2xl">{def.icon}</p>
      <p className="mt-1.5 text-xs font-extrabold text-charcoal">{def.title}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-earth-muted">{def.description}</p>
      {earned && (
        <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-widest text-gem">
          Obtenido
        </p>
      )}
    </div>
  );
}
