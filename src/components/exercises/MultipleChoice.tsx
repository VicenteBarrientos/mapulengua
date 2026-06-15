"use client";

import { useState } from "react";
import type { MultipleChoiceExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";

type Props = {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function MultipleChoice({ exercise, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isIntro = exercise.phase === "intro";

  function handleSelect(index: number) {
    if (disabled || revealed) return;
    playTap();
    setSelected(index);
    setRevealed(true);
    onAnswer(index === exercise.correctIndex);
  }

  return (
    <div className="flex flex-1 flex-col">
      {exercise.instruction && (
        <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-terracotta">
          {exercise.instruction}
        </p>
      )}

      {isIntro ? (
        <div className="mb-8 animate-pop rounded-2xl border-2 border-terracotta/20 bg-terracotta/5 px-6 py-8 text-center">
          <p className="mb-1 text-xs font-semibold text-earth-muted">Mapudungun</p>
          <p className="font-display text-3xl font-extrabold text-teal">{exercise.prompt}</p>
          <p className="mt-3 text-sm text-earth-muted">¿Qué significa?</p>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-center text-2xl font-extrabold text-charcoal">{exercise.prompt}</p>
        </div>
      )}

      <div className="mt-auto grid gap-3">
        {exercise.options.map((option, i) => {
          let style =
            "border-2 border-sand-dark bg-white text-charcoal active:scale-[0.97] shadow-sm";
          if (revealed && i === exercise.correctIndex) {
            style = "border-2 border-sage bg-sage text-white scale-[1.02] shadow-md";
          } else if (revealed && i === selected && i !== exercise.correctIndex) {
            style = "border-2 border-coral bg-coral/15 text-charcoal animate-shake";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || revealed}
              onClick={() => handleSelect(i)}
              className={`min-h-[56px] rounded-2xl px-5 py-4 text-left text-base font-bold transition-all ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
