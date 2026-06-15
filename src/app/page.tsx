"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  KumeEncouragementBanner,
  KumeReminderToast,
  LessonPath,
  StreakBanner,
  UnitCard,
} from "@/components/course/CourseUI";
import { MountainScene } from "@/components/scenery/MountainScene";
import { units } from "@/lib/data/units";
import { useProgress } from "@/lib/store/progress";

export default function HomePage() {
  const { progress, loaded, getUnitProgress, isLessonCompleted, recordActivity } =
    useProgress();
  const unit = units[0];

  useEffect(() => {
    if (loaded) recordActivity();
  }, [loaded, recordActivity]);

  if (!unit) return null;

  const { completed, total } = getUnitProgress(unit.lessons.map((l) => l.id));
  const nextLesson =
    unit.lessons.find((l) => !isLessonCompleted(l.id)) ?? unit.lessons[0];

  const encouragement =
    completed === 0
      ? "¡Mari mari! Küme te acompaña en tu camino."
      : completed === total
        ? "¡Welu! Completaste esta unidad con orgullo."
        : "¡Mari mari! Sigue así, vas por buen camino.";

  return (
    <AppShell fullBleed>
      {/* Hero with mountains */}
      <section className="relative overflow-hidden">
        <MountainScene className="h-44 w-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <p className="text-sm font-extrabold uppercase tracking-widest text-teal">
            Mapulengua
          </p>
          <h1 className="text-xl font-extrabold text-charcoal">
            Mapudungun para todos
          </h1>
        </div>
      </section>

      <div className="space-y-4 pt-4">
        {loaded && progress.streak >= 2 && (
          <StreakBanner streak={progress.streak} />
        )}

        <UnitCard unit={unit} completed={completed} total={total} />

        {loaded && completed > 0 && completed < total && (
          <KumeEncouragementBanner message={encouragement} />
        )}

        {loaded && completed === 0 && (
          <KumeReminderToast />
        )}

        {/* Lesson path on mountain backdrop */}
        <section className="relative overflow-hidden rounded-t-3xl bg-gradient-to-b from-sky/30 to-sage/20">
          <MountainScene className="absolute inset-0 h-full w-full opacity-40" />
          <div className="relative">
            {loaded && (
              <LessonPath
                lessons={unit.lessons}
                isCompleted={isLessonCompleted}
                nextLessonId={nextLesson?.id}
                isUnlocked={(lesson, index) => {
                  if (index === 0) return true;
                  return isLessonCompleted(unit.lessons[index - 1].id);
                }}
              />
            )}
          </div>
        </section>

        {nextLesson && loaded && (
          <div className="px-4 pb-2">
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="flex w-full items-center justify-center rounded-2xl bg-terracotta py-3.5 text-base font-extrabold text-white shadow-md shadow-terracotta/25 transition-transform active:scale-[0.98]"
            >
              {completed === 0 ? "Comenzar" : "Continuar"}
            </Link>
          </div>
        )}

        <footer className="px-4 pb-4 text-center">
          <p className="text-[11px] leading-relaxed text-earth-muted">
            Mapulengua honra la lengua mapuche. Contenido provisional — pendiente
            de revisión experta.
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
