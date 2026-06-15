import Link from "next/link";
import type { Lesson, Unit } from "@/lib/types";
import { Kume } from "@/components/kume/Kume";

type UnitCardProps = {
  unit: Unit;
  completed: number;
  total: number;
};

export function UnitCard({ unit, completed, total }: UnitCardProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mx-4 overflow-hidden rounded-2xl border-2 border-sand-dark bg-white shadow-sm">
      <div className="nimin-pattern-top" />
      <div className="px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-terracotta">
          Unidad {unit.order}
        </p>
        <h2 className="text-base font-extrabold text-charcoal">
          {unit.title}
        </h2>
        <p className="text-xs text-earth-muted">{unit.titleMapudungun}</p>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs font-semibold text-earth-muted">
            <span>Progreso</span>
            <span className="text-sage">
              {completed}/{total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-sage transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type LessonPathProps = {
  lessons: Lesson[];
  isCompleted: (id: string) => boolean;
  nextLessonId?: string;
  isUnlocked?: (lesson: Lesson, index: number) => boolean;
};

const OFFSETS = ["justify-center", "justify-start pl-8", "justify-end pr-8"] as const;

export function LessonPath({
  lessons,
  isCompleted,
  nextLessonId,
  isUnlocked,
}: LessonPathProps) {
  return (
    <div className="relative px-4 py-6">
      <div className="absolute bottom-12 left-1/2 top-12 w-1 -translate-x-1/2 rounded-full bg-sand-dark/50" />

      <div className="relative space-y-6">
        {lessons.map((lesson, i) => {
          const done = isCompleted(lesson.id);
          const isNext = lesson.id === nextLessonId;
          const unlocked = isUnlocked ? isUnlocked(lesson, i) : true;
          const offset = OFFSETS[i % OFFSETS.length];

          const node = (
            <div
              className={`flex h-16 w-16 flex-col items-center justify-center rounded-full border-[3px] shadow-md transition-transform ${
                !unlocked
                  ? "border-sand-dark/60 bg-white/80 text-earth-muted/50"
                  : done
                    ? "border-sage bg-sage text-white group-active:scale-95"
                    : isNext
                      ? "border-terracotta bg-terracotta text-white animate-pulse-soft shadow-terracotta/30 group-active:scale-95"
                      : "border-sand-dark bg-white text-earth-muted group-active:scale-95"
              }`}
            >
              <span className="text-xl">
                {!unlocked ? "🔒" : done ? "⭐" : isNext ? "📖" : "📖"}
              </span>
            </div>
          );

          return (
            <div key={lesson.id} className={`relative flex ${offset}`}>
              {unlocked ? (
                <Link href={`/lesson/${lesson.id}`} className="group relative z-10">
                  {node}
                  <p
                    className={`mt-1.5 max-w-[80px] text-center text-[11px] font-bold leading-tight ${
                      isNext ? "text-terracotta" : "text-earth-muted"
                    }`}
                  >
                    {lesson.title}
                  </p>
                </Link>
              ) : (
                <div className="relative z-10 opacity-60">
                  {node}
                  <p className="mt-1.5 max-w-[80px] text-center text-[11px] font-bold leading-tight text-earth-muted/60">
                    {lesson.title}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function KumeEncouragementBanner({ message }: { message: string }) {
  return (
    <div className="mx-4 flex items-center gap-3 rounded-2xl border-2 border-sand-dark bg-sand/60 px-4 py-3 animate-slide-up">
      <Kume size={72} mood="encouraging" />
      <p className="flex-1 text-sm font-semibold leading-snug text-charcoal">{message}</p>
    </div>
  );
}

export function StreakBanner({ streak }: { streak: number }) {
  if (streak < 2) return null;

  return (
    <div className="mx-4 flex items-center gap-3 overflow-hidden rounded-2xl bg-forest px-4 py-3 text-white animate-slide-up">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold font-extrabold text-forest">
        {streak}
      </div>
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide">
          {streak >= 7 ? `¡Racha de ${streak} días!` : `Racha: ${streak} días`}
        </p>
        <p className="text-xs text-white/80">
          Tu constancia te acerca a tus metas.
        </p>
      </div>
      <span className="ml-auto text-2xl">🔥</span>
    </div>
  );
}

export function KumeReminderToast() {
  return (
    <div className="mx-4 flex items-center gap-2 rounded-full border border-sand-dark bg-white px-3 py-2 shadow-md animate-slide-up">
      <Kume size={40} mood="happy" />
      <p className="text-xs font-semibold text-charcoal">
        Küme te recuerda: ¡No olvides practicar hoy!
      </p>
    </div>
  );
}
