"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KumeFeedback } from "@/components/kume/KumeScenes";
import { useProgress } from "@/lib/store/progress";

// ─── Feedback messages ────────────────────────────────────────────────────────

const CORRECT_MSGS = [
  "¡Bien hecho, viajero!",
  "¡Excelente! Pudu está orgulloso.",
  "¡Eso es! La ruta se abre.",
  "¡Perfecto, sigue caminando!",
  "¡Correcto! El sur te llama.",
  "¡Increíble! Una palabra más en tu diario.",
  "¡Muy bien! El mapudungun vive en ti.",
  "¡Genial! Pudu baila de alegría.",
  "¡Exacto! Cada palabra es un paso.",
  "¡Súper! El camino se hace al andar.",
];

const COMBO_MSGS: Record<number, string> = {
  3: "¡Buena racha! Pudu está contento.",
  5: "¡Eres imparable! 🔥",
  8: "¡Maestro del camino! Increíble.",
};

const WRONG_MSGS = [
  "No te rindas, ¡sigue el camino!",
  "Pudu te anima a intentarlo de nuevo.",
  "Casi… ¡la próxima lo logras!",
  "El viaje tiene tropiezos. ¡Adelante!",
  "No pasa nada, ¡sigue avanzando!",
];

// ─── Feedback bar ─────────────────────────────────────────────────────────────

type FeedbackProps = {
  correct: boolean;
  explanation?: string;
  correctAnswer?: string;
  xpGained?: number;
  streak?: number;
  onContinue: () => void;
  isLast: boolean;
};

export function LessonFeedbackBar({
  correct,
  explanation,
  correctAnswer,
  xpGained,
  streak = 0,
  onContinue,
  isLast,
}: FeedbackProps) {
  // Stable random index per mount — changes each time feedback bar appears
  const [msgIdx] = useState(() => Math.floor(Math.random() * (correct ? CORRECT_MSGS.length : WRONG_MSGS.length)));

  // Combo message overrides random message at streak milestones
  const comboMsg = correct
    ? Object.entries(COMBO_MSGS)
        .filter(([k]) => streak >= Number(k))
        .sort((a, b) => Number(b[0]) - Number(a[0]))[0]?.[1]
    : undefined;

  const message = comboMsg ?? (correct
    ? CORRECT_MSGS[msgIdx % CORRECT_MSGS.length]
    : WRONG_MSGS[msgIdx % WRONG_MSGS.length]);

  // Auto-advance on correct — keeps a ref to always call the latest onContinue
  const onContinueRef = useRef(onContinue);
  useEffect(() => { onContinueRef.current = onContinue; }, [onContinue]);

  useEffect(() => {
    if (!correct) return;
    const t = setTimeout(() => onContinueRef.current(), 1300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`lesson-feedback-sheet animate-slide-up-feedback ${
        correct ? "lesson-feedback-sheet--correct" : "lesson-feedback-sheet--wrong"
      }`}
    >
      <div className="lesson-feedback-sheet-inner">
        <KumeFeedback correct={correct} size={80} message={message} />

        {correct && xpGained ? (
          <p className="lesson-feedback-xp animate-xp-pop">+{xpGained} recuerdos</p>
        ) : !correct && correctAnswer ? (
          <div className="lesson-feedback-reveal">
            <span className="lesson-feedback-reveal-label">Respuesta correcta</span>
            <span className="lesson-feedback-reveal-answer">{correctAnswer}</span>
          </div>
        ) : explanation ? (
          <p className="lesson-feedback-hint">{explanation}</p>
        ) : null}

        <button
          type="button"
          onClick={onContinue}
          className={`lesson-feedback-cta ${correct ? "lesson-feedback-cta--correct" : "lesson-feedback-cta--wrong"}`}
        >
          {isLast ? "Llegar a la parada" : "Seguir caminando"}
        </button>
      </div>
    </div>
  );
}

// ─── Segmented progress bar ───────────────────────────────────────────────────

export function SegmentedProgress({
  total,
  current,
  answered,
}: {
  total: number;
  current: number;
  answered: boolean;
}) {
  return (
    <div className="lesson-progress" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current || (i === current && answered);
        const active = i === current;
        return (
          <div
            key={i}
            className={`lesson-progress-segment ${filled ? "lesson-progress-segment--filled" : ""} ${
              active && !answered ? "lesson-progress-segment--active" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

// ─── Lesson header ────────────────────────────────────────────────────────────

type HeaderProps = {
  regionName: string;
  lessonTitle: string;
  closeHref: string;
  total: number;
  current: number;
  answered: boolean;
};

export function LessonHeader({
  regionName,
  lessonTitle,
  closeHref,
  total,
  current,
  answered,
}: HeaderProps) {
  const { progress, loaded } = useProgress();

  return (
    <header className="lesson-hud">
      <div className="lesson-hud-row">
        <Link href={closeHref} className="lesson-close" aria-label="Salir de la lección">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <SegmentedProgress total={total} current={current} answered={answered} />
        {loaded ? (
          <div className="lesson-hearts" aria-label={`${progress.hearts} de ${progress.maxHearts} vidas`}>
            <span className="lesson-hearts-icon" aria-hidden>❤️</span>
            <span className="lesson-hearts-count">{progress.hearts}</span>
          </div>
        ) : (
          <div className="lesson-hearts lesson-hearts--loading" />
        )}
      </div>

      <div className="lesson-hud-meta">
        <div className="lesson-hud-context">
          <span className="lesson-hud-region">{regionName}</span>
          <span className="lesson-hud-dot" aria-hidden>·</span>
          <span className="lesson-hud-lesson">{lessonTitle}</span>
        </div>
        {loaded && (
          <div className="lesson-hud-stats">
            <span className="lesson-stat-pill" title="Días de viaje">
              <span aria-hidden>🔥</span>
              {progress.streak}
            </span>
            <span className="lesson-stat-pill lesson-stat-pill--gem" title="Recuerdos">
              <span aria-hidden>💎</span>
              {progress.xp}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
