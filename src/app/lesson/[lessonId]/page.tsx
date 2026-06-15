"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useCallback, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { HeartsDisplay } from "@/components/ui/Stats";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import {
  LessonFeedbackBar,
  SegmentedProgress,
} from "@/components/lesson/LessonUI";
import { KumeHero } from "@/components/kume/KumeHero";
import { KumeLessonComplete } from "@/components/kume/KumeScenes";
import { getLesson, getNextLesson } from "@/lib/data/regions";
import { useProgress } from "@/lib/store/progress";
import { playComplete, playHeartLost, playMistake, playSuccess, playUnlock, playXp } from "@/lib/sounds";
import { regions } from "@/lib/data/regions";
import { XP_PER_CORRECT } from "@/lib/types";
import type { Exercise } from "@/lib/types";

function getExplanation(exercise: Exercise): string | undefined {
  if ("explanation" in exercise) return exercise.explanation;
  return undefined;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);
  const result = getLesson(lessonId);
  const { progress, loseHeart, addXp, completeLesson, recordActivity, isLessonCompleted } =
    useProgress();

  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXp, setLastXp] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!result) notFound();

  const { region, lesson } = result;
  const exercise = lesson.exercises[step];
  const total = lesson.exercises.length;
  const nextLesson = getNextLesson(lessonId);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setAnswered(true);
      setLastCorrect(correct);
      if (correct) {
        playSuccess();
        playXp();
        setCorrectCount((c) => c + 1);
        setLastXp(XP_PER_CORRECT);
        setSessionXp((x) => x + XP_PER_CORRECT);
        addXp(XP_PER_CORRECT);
      } else {
        playMistake();
        setLastXp(0);
        loseHeart();
        playHeartLost();
      }
    },
    [addXp, loseHeart]
  );

  const handleMiss = useCallback(() => {
    loseHeart();
    playHeartLost();
  }, [loseHeart]);

  function handleContinue() {
    if (step < total - 1) {
      setStep((s) => s + 1);
      setAnswered(false);
    } else {
      playComplete();
      const isLastInRegion = region.lessons.every(
        (l) => l.id === lessonId || isLessonCompleted(l.id)
      );
      const score = Math.round((correctCount / total) * 100);
      completeLesson(lessonId, score, lesson.xpReward);
      recordActivity();
      if (isLastInRegion) {
        const nextStop = regions.find((r) => r.order === region.order + 1);
        if (nextStop) playUnlock();
      }
      setFinished(true);
    }
  }

  if (finished) {
    const totalXp = sessionXp + lesson.xpReward;
    return (
      <AppShell hideNav>
        <div className="flex min-h-[85dvh] flex-col items-center justify-center px-4 py-8 text-center animate-celebrate">
          <KumeLessonComplete size={160} />
          <p className="text-xs font-extrabold uppercase tracking-widest text-teal">
            {region.name}
          </p>
          <h1 className="mb-1 text-3xl font-extrabold text-terracotta">
            ¡Parada completada!
          </h1>
          <p className="mb-6 text-earth-muted">{lesson.title}</p>
          <div className="mb-8 flex gap-8">
            <div>
              <p className="text-2xl font-extrabold text-gem">+{totalXp}</p>
              <p className="text-xs font-bold text-earth-muted">Recuerdos</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-sage">
                {Math.round((correctCount / total) * 100)}%
              </p>
              <p className="text-xs font-bold text-earth-muted">Camino</p>
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3">
            {nextLesson ? (
              <LinkButton href={`/lesson/${nextLesson.id}`} fullWidth size="lg">
                Siguiente parada →
              </LinkButton>
            ) : (
              <LinkButton href={`/region/${region.id}`} fullWidth size="lg">
                Explorar {region.name}
              </LinkButton>
            )}
            <LinkButton href="/" variant="outline" fullWidth>
              Ver la ruta
            </LinkButton>
          </div>
        </div>
      </AppShell>
    );
  }

  if (progress.hearts === 0 && answered && !lastCorrect) {
    return (
      <AppShell hideNav>
        <div className="flex min-h-[85dvh] flex-col items-center justify-center px-4 text-center">
          <KumeHero emotion="thinking" animation="float" size={140} className="mb-4" />
          <h1 className="mb-2 text-xl font-extrabold">Necesitas descansar</h1>
          <p className="mb-6 text-sm text-earth-muted">
            Küme te espera mañana con energía renovada para seguir al sur.
          </p>
          <LinkButton href={`/region/${region.id}`} fullWidth>
            Volver a {region.name}
          </LinkButton>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <div className="flex min-h-[100dvh] flex-col pb-40">
        <div className="px-4 pt-3">
          <div className="mb-3 flex items-center gap-3">
            <Link
              href={`/region/${region.id}`}
              className="text-lg font-bold text-earth-muted"
            >
              ✕
            </Link>
            <div className="flex-1">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-teal">
                {region.name} · {lesson.title}
              </p>
              <SegmentedProgress total={total} current={step} answered={answered} />
            </div>
            <HeartsDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pt-2">
          {exercise && (
            <ExerciseRenderer
              key={exercise.id}
              exercise={exercise}
              onAnswer={handleAnswer}
              onMiss={handleMiss}
              disabled={progress.hearts === 0}
            />
          )}
        </div>

        {answered && (
          <LessonFeedbackBar
            correct={lastCorrect}
            explanation={exercise ? getExplanation(exercise) : undefined}
            xpGained={lastXp}
            onContinue={handleContinue}
            isLast={step >= total - 1}
          />
        )}
      </div>
    </AppShell>
  );
}
