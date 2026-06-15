"use client";

import type { UserProgress } from "@/lib/types";

function FlameIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C10 5.5 7.5 7 7.5 10.5C7.5 12.5 8.5 14 9.5 15C9 13 10 11.5 11.5 11C10.5 13.5 11 16 13.5 17.5C12 15.5 12.5 13 14 12C13.5 14.5 14.5 17 12.5 19C15.5 18 17 15.5 17 13C17 10.5 15.5 8.5 15.5 8.5C15 10 14 10.5 13.5 10C14 8 14.5 5 12 2Z"
        fill={lit ? "#E24A2B" : "#C9B09A"}
      />
    </svg>
  );
}

function CheckRing({ done }: { done: boolean }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
        done
          ? "border-green-500 bg-green-50"
          : "border-sand-dark/30 bg-white/60"
      }`}
    >
      {done && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8L6.5 11.5L13 5"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

export function DailyGoal({ progress }: { progress: UserProgress }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const streak = progress.streak;

  const lessonDoneToday = Object.values(progress.lessons).some((l) =>
    l.completedAt?.startsWith(todayStr)
  );

  const hasStreak = streak >= 2;
  const isAtRisk = hasStreak && !lessonDoneToday;

  let label = "";
  let headline = "";
  let message = "";

  if (!hasStreak && !lessonDoneToday) {
    label = "Meta diaria";
    headline = "Comienza tu racha";
    message = "Una lección al día es todo lo que necesitas.";
  } else if (!hasStreak && lessonDoneToday) {
    label = "Racha diaria";
    headline = "Primer día completado";
    message = "Vuelve mañana para empezar tu racha. ¡Pudu te espera!";
  } else if (lessonDoneToday) {
    label = "Racha diaria";
    headline = `${streak} día${streak !== 1 ? "s" : ""} seguidos`;
    message =
      streak >= 14
        ? "¡Constancia admirable! Pudu está muy orgulloso."
        : streak >= 7
        ? "¡Una semana completa! Pudu celebra contigo."
        : "¡Racha asegurada por hoy! Vuelve mañana.";
  } else {
    label = "Racha en riesgo";
    headline = `${streak} días seguidos`;
    message = "Completa una lección hoy para no perder la racha.";
  }

  return (
    <div
      className={`mx-4 rounded-2xl border px-4 py-3 transition-colors ${
        isAtRisk
          ? "border-amber-300/60 bg-amber-50/80"
          : lessonDoneToday
          ? "border-green-300/40 bg-green-50/60"
          : "border-sand-dark/20 bg-white/60"
      }`}
    >
      <div className="flex items-center gap-3">
        <FlameIcon lit={hasStreak && lessonDoneToday} />
        <div className="flex-1 min-w-0">
          <p
            className={`text-[10px] font-extrabold uppercase tracking-widest ${
              isAtRisk ? "text-amber-600" : "text-terracotta"
            }`}
          >
            {label}
          </p>
          <p className="text-base font-extrabold text-charcoal">{headline}</p>
        </div>
        <CheckRing done={lessonDoneToday} />
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-earth-muted">{message}</p>
    </div>
  );
}
