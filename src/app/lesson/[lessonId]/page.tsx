"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useCallback, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button, LinkButton } from "@/components/ui/Button";
import { HeartsDisplay } from "@/components/ui/Stats";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { Kume } from "@/components/kume/Kume";
import { getLesson, getNextLesson } from "@/lib/data/units";
import { useProgress } from "@/lib/store/progress";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);
  const result = getLesson(lessonId);
  const { progress, loseHeart, completeLesson, recordActivity } = useProgress();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!result) notFound();

  const { unit, lesson } = result;
  const exercise = lesson.exercises[exerciseIndex];
  const total = lesson.exercises.length;
  const progressPct = ((exerciseIndex + (answered ? 1 : 0)) / total) * 100;
  const nextLesson = getNextLesson(lessonId);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setAnswered(true);
      if (correct) {
        setCorrectCount((c) => c + 1);
      } else {
        loseHeart();
      }
    },
    [loseHeart]
  );

  function handleContinue() {
    if (progress.hearts === 0 && !answered) return;

    if (exerciseIndex < total - 1) {
      setExerciseIndex((i) => i + 1);
      setAnswered(false);
    } else {
      const score = Math.round((correctCount / total) * 100);
      completeLesson(lessonId, score, lesson.xpReward);
      recordActivity();
      setFinished(true);
    }
  }

  if (finished) {
    const score = Math.round((correctCount / total) * 100);
    return (
      <AppShell hideNav>
        <div className="flex flex-col items-center px-4 py-8 text-center animate-celebrate">
          <Kume size={140} mood="celebrating" className="mb-6" />
          <h1 className="mb-2 text-2xl font-extrabold text-terracotta">
            ¡Lección completada!
          </h1>
          <p className="mb-1 text-earth-muted">{lesson.title}</p>
          <p className="mb-6 text-lg font-extrabold text-gem">
            +{lesson.xpReward} 💎 · {score}% aciertos
          </p>

          <div className="flex w-full flex-col gap-3">
            {nextLesson ? (
              <LinkButton href={`/lesson/${nextLesson.id}`} fullWidth>
                Siguiente lección
              </LinkButton>
            ) : (
              <LinkButton href="/" fullWidth>
                Volver al camino
              </LinkButton>
            )}
            <LinkButton href="/" variant="outline" fullWidth>
              Inicio
            </LinkButton>
          </div>
        </div>
      </AppShell>
    );
  }

  if (progress.hearts === 0 && answered) {
    return (
      <AppShell hideNav>
        <div className="flex flex-col items-center px-4 py-8 text-center">
          <Kume size={120} mood="encouraging" className="mb-4" />
          <h1 className="mb-2 text-xl font-extrabold text-charcoal">Sin vidas</h1>
          <p className="mb-6 text-sm text-earth-muted">
            Küme te anima a descansar y volver mañana con energía renovada.
          </p>
          <LinkButton href="/" fullWidth>
            Volver al camino
          </LinkButton>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <div className="px-4">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-teal">
            ✕ Salir
          </Link>
          <HeartsDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} />
        </div>

        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs font-semibold text-earth-muted">
            <span>
              {unit.title} · {lesson.title}
            </span>
            <span>
              {exerciseIndex + 1}/{total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-terracotta transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="mb-6 min-h-[280px] rounded-2xl border-2 border-sand-dark bg-white p-5 shadow-sm">
          {exercise && (
            <ExerciseRenderer
              key={exercise.id}
              exercise={exercise}
              onAnswer={handleAnswer}
              disabled={progress.hearts === 0}
            />
          )}
        </div>

        {answered && (
          <div className="sticky bottom-4 pb-4">
            <Button fullWidth onClick={handleContinue} size="lg">
              {exerciseIndex < total - 1 ? "Continuar" : "Finalizar lección"}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
