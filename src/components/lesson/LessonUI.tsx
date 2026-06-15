"use client";

import { KumeFeedback } from "@/components/kume/KumeScenes";

type Props = {
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
}: Props) {
  return (
    <div
      className={`animate-slide-up-feedback fixed inset-x-0 bottom-0 z-50 border-t-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 ${
        correct ? "border-sage bg-sage/10" : "border-coral bg-coral/10"
      }`}
    >
      <div className="mx-auto max-w-lg overflow-visible">
        <KumeFeedback
          correct={correct}
          size={72}
          message={
            correct ? "¡Bien hecho, viajero!" : "Küme te anima a intentar de nuevo"
          }
        />
        {correct && xpGained ? (
          <p className="animate-xp-pop mt-2 text-center text-sm font-bold text-gem">
            +{xpGained} recuerdos
          </p>
        ) : (
          explanation && (
            <p className="mt-2 text-center text-xs font-medium text-earth-muted">
              {explanation}
            </p>
          )
        )}
      </div>
      <button
        type="button"
        onClick={onContinue}
        className={`mt-4 w-full min-h-[52px] rounded-2xl text-base font-extrabold text-white shadow-md active:scale-[0.98] ${
          correct ? "bg-sage" : "bg-coral"
        }`}
      >
        {isLast ? "Llegar a la parada" : "Seguir caminando"}
      </button>
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
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current || (i === current && answered);
        const active = i === current;
        return (
          <div
            key={i}
            className={`h-2.5 flex-1 overflow-hidden rounded-full transition-all duration-300 ${
              filled ? "bg-terracotta" : "bg-sand-dark/60"
            } ${active && !answered ? "animate-pulse-soft" : ""}`}
          />
        );
      })}
    </div>
  );
}
