"use client";

import Link from "next/link";
import { KumeFeedback } from "@/components/kume/KumeScenes";
import { useProgress } from "@/lib/store/progress";

type FeedbackProps = {
  correct: boolean;
  explanation?: string;
  xpGained?: number;
  onContinue: () => void;
  isLast: boolean;
};

export function LessonFeedbackBar({
  correct,
  explanation,
  xpGained,
  onContinue,
  isLast,
}: FeedbackProps) {
  return (
    <div
      className={`lesson-feedback-sheet animate-slide-up-feedback ${
        correct ? "lesson-feedback-sheet--correct" : "lesson-feedback-sheet--wrong"
      }`}
    >
      <div className="lesson-feedback-sheet-inner">
        <KumeFeedback
          correct={correct}
          size={80}
          message={
            correct ? "¡Bien hecho, viajero!" : "Küme te anima a intentar de nuevo"
          }
        />
        {correct && xpGained ? (
          <p className="lesson-feedback-xp animate-xp-pop">+{xpGained} recuerdos</p>
        ) : (
          explanation && <p className="lesson-feedback-hint">{explanation}</p>
        )}
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
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <SegmentedProgress total={total} current={current} answered={answered} />
        {loaded ? (
          <div className="lesson-hearts" aria-label={`${progress.hearts} de ${progress.maxHearts} vidas`}>
            <span className="lesson-hearts-icon" aria-hidden>
              ❤️
            </span>
            <span className="lesson-hearts-count">{progress.hearts}</span>
          </div>
        ) : (
          <div className="lesson-hearts lesson-hearts--loading" />
        )}
      </div>

      <div className="lesson-hud-meta">
        <div className="lesson-hud-context">
          <span className="lesson-hud-region">{regionName}</span>
          <span className="lesson-hud-dot" aria-hidden>
            ·
          </span>
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
