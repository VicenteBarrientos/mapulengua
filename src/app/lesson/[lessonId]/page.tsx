"use client";

import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import {
  LessonFeedbackBar,
  LessonHeader,
} from "@/components/lesson/LessonUI";
import { KumeHero } from "@/components/kume/KumeHero";
import { KumeLessonComplete } from "@/components/kume/KumeScenes";
import { useScreenFlash } from "@/components/ui/ScreenFlash";
import { getLesson, getNextLesson } from "@/lib/data/regions";
import { useProgress } from "@/lib/store/progress";
import {
  playComplete,
  playHeartLost,
  playMistake,
  playSuccess,
} from "@/lib/sounds";
import { music } from "@/lib/music";
import { XP_PER_CORRECT } from "@/lib/types";
import type { Exercise, MultipleChoiceExercise } from "@/lib/types";

function extractWords(exercises: Exercise[]): { arn: string; es: string }[] {
  return (exercises as MultipleChoiceExercise[])
    .filter((e) => e.type === "multiple-choice" && e.phase === "intro" && e.promptLang === "arn")
    .map((e) => ({ arn: e.prompt, es: e.options[e.correctIndex] }))
    .slice(0, 5);
}

const CONFETTI_COLORS = [
  "var(--color-terracotta)",
  "var(--color-sage)",
  "var(--color-gold)",
  "var(--color-teal)",
  "var(--color-gem)",
  "var(--color-gold-light)",
  "var(--color-coral)",
  "var(--color-sky)",
];

const CONFETTI_DIRS = [
  { x: 0, y: -120 },
  { x: 85, y: -85 },
  { x: 120, y: 0 },
  { x: 85, y: 85 },
  { x: 0, y: 120 },
  { x: -85, y: 85 },
  { x: -120, y: 0 },
  { x: -85, y: -85 },
];

function Confetti() {
  return (
    <div className="confetti-wrap" aria-hidden>
      {CONFETTI_DIRS.map((dir, i) => (
        <div
          key={i}
          style={{ position: "absolute", top: "45%", left: "50%", width: 0, height: 0 }}
        >
          <div
            className="confetti-particle"
            style={{
              ["--tx" as string]: `${dir.x}px`,
              ["--ty" as string]: `${dir.y}px`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${i * 28}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function getExplanation(exercise: Exercise): string | undefined {
  if ("explanation" in exercise) return exercise.explanation;
  return undefined;
}

function getCorrectAnswer(exercise: Exercise): string | undefined {
  if (
    exercise.type === "multiple-choice" ||
    exercise.type === "listening" ||
    exercise.type === "missing-word"
  ) {
    return exercise.options[exercise.correctIndex];
  }
  if (exercise.type === "word-bank") return exercise.answer;
  return undefined;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);
  const result = getLesson(lessonId);
  const { progress, loseHeart, addXp, completeLesson, recordActivity } = useProgress();
  const flash = useScreenFlash();

  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXp, setLastXp] = useState(0);
  const [finished, setFinished] = useState(false);
  const [regionJustCompleted, setRegionJustCompleted] = useState(false);
  const [comboStreak, setComboStreak] = useState(0);

  // Switch to energetic lesson music; restore ambient when leaving
  useEffect(() => {
    music.setMode("lesson");
    return () => { music.setMode("ambient"); };
  }, []);

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
        flash("correct");
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(12);
        setCorrectCount((c) => c + 1);
        setComboStreak((s) => s + 1);
        setLastXp(XP_PER_CORRECT);
        setSessionXp((x) => x + XP_PER_CORRECT);
        addXp(XP_PER_CORRECT);
      } else {
        playMistake();
        flash("wrong");
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([40, 20, 40]);
        setComboStreak(0);
        setLastXp(0);
        loseHeart();
        playHeartLost();
      }
    },
    [addXp, loseHeart, flash]
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
      const score = Math.round((correctCount / total) * 100);
      const wasLastInRegion =
        !nextLesson && lesson.order === region.lessons.length;
      completeLesson(lessonId, score, lesson.xpReward);
      recordActivity();
      setRegionJustCompleted(wasLastInRegion);
      setFinished(true);
    }
  }

  if (finished) {
    const totalXp = sessionXp + lesson.xpReward;
    const words = extractWords(lesson.exercises);
    const accuracy = Math.round((correctCount / total) * 100);

    return (
      <AppShell hideNav hideTopBar>
        <div className="relative flex min-h-[85dvh] flex-col items-center justify-center px-4 py-8 text-center animate-celebrate">
          <Confetti />
          <KumeLessonComplete size={150} />

          <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
            {region.name}
          </p>
          <h1 className="mb-1 text-3xl font-extrabold text-terracotta">
            {regionJustCompleted ? `¡${region.name} completada!` : "¡Parada completada!"}
          </h1>
          <p className="mb-5 font-medium text-earth-muted">{lesson.title}</p>

          {/* Stats row */}
          <div className="mb-5 flex gap-4">
            <div className="rounded-2xl border border-gem/30 bg-gem/10 px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-gem">+{totalXp}</p>
              <p className="text-[11px] font-bold text-earth-muted">Recuerdos</p>
            </div>
            <div className="rounded-2xl border border-sage/30 bg-sage/10 px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-sage">{accuracy}%</p>
              <p className="text-[11px] font-bold text-earth-muted">Camino</p>
            </div>
          </div>

          {/* Words learned */}
          {words.length > 0 && (
            <div className="mb-6 w-full max-w-sm rounded-2xl border border-sand-dark/20 bg-white/70 px-4 py-4 text-left">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-earth-muted">
                Palabras aprendidas
              </p>
              <div className="flex flex-col gap-2">
                {words.map((w) => (
                  <div key={w.arn} className="flex items-center justify-between">
                    <span className="font-extrabold text-terracotta">{w.arn}</span>
                    <span className="mx-2 text-sand-dark/50">→</span>
                    <span className="font-semibold text-charcoal">{w.es}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Region complete message */}
          {regionJustCompleted && (
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-earth-muted">
              Has recorrido toda la parada de {region.name}. La siguiente región se ha desbloqueado en tu ruta.
            </p>
          )}

          <div className="flex w-full max-w-sm flex-col gap-3">
            {regionJustCompleted ? (
              <LinkButton href="/" fullWidth size="lg">
                Ver la ruta →
              </LinkButton>
            ) : nextLesson ? (
              <LinkButton href={`/lesson/${nextLesson.id}`} fullWidth size="lg">
                Siguiente parada →
              </LinkButton>
            ) : (
              <LinkButton href={`/region/${region.id}`} fullWidth size="lg">
                Explorar {region.name}
              </LinkButton>
            )}
            <LinkButton href="/" variant="outline" fullWidth>
              Volver a la ruta
            </LinkButton>
          </div>
        </div>
      </AppShell>
    );
  }

  if (progress.hearts === 0 && answered && !lastCorrect) {
    return (
      <AppShell hideNav hideTopBar>
        <div className="flex min-h-[85dvh] flex-col items-center justify-center px-4 text-center">
          <KumeHero emotion="thinking" animation="float" size={140} className="mb-4" />
          <h1 className="mb-2 text-xl font-extrabold">Necesitas descansar</h1>
          <p className="mb-2 max-w-xs text-sm text-earth-muted">
            Pudu te espera mañana con energía renovada. Tu energía se recarga cada día al amanecer.
          </p>
          <p className="mb-6 text-xs font-semibold text-teal">
            Mientras tanto, repasa palabras en el Diario — sin perder energía.
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <LinkButton href="/review" fullWidth size="lg">
              Abrir Diario de viaje
            </LinkButton>
            <LinkButton href={`/region/${region.id}`} variant="outline" fullWidth>
              Volver a {region.name}
            </LinkButton>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav hideTopBar fullBleed>
      <div className={`lesson-shell ${answered ? "lesson-shell--feedback" : ""}`}>
        <LessonHeader
          regionName={region.name}
          lessonTitle={lesson.title}
          closeHref={`/region/${region.id}`}
          total={total}
          current={step}
          answered={answered}
        />

        <div className="lesson-body">
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
            correctAnswer={!lastCorrect && exercise ? getCorrectAnswer(exercise) : undefined}
            xpGained={lastXp}
            streak={comboStreak}
            onContinue={handleContinue}
            isLast={step >= total - 1}
          />
        )}
      </div>
    </AppShell>
  );
}
