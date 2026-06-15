"use client";

import { useState } from "react";
import type { MultipleChoiceExercise } from "@/lib/types";

type Props = {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function MultipleChoice({ exercise, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(index: number) {
    if (disabled || revealed) return;
    setSelected(index);
    setRevealed(true);
    onAnswer(index === exercise.correctIndex);
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-earth">{exercise.prompt}</p>
      <div className="grid gap-3">
        {exercise.options.map((option, i) => {
          let style =
            "border-2 border-sand bg-white text-earth hover:border-teal/40";
          if (revealed && i === exercise.correctIndex) {
            style = "border-2 border-sage bg-sage/10 text-earth";
          } else if (revealed && i === selected && i !== exercise.correctIndex) {
            style = "border-2 border-coral bg-coral/10 text-earth animate-shake";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || revealed}
              onClick={() => handleSelect(i)}
              className={`rounded-xl px-4 py-3.5 text-left font-medium transition-all ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {revealed && exercise.explanation && (
        <p className="rounded-xl bg-sand/80 px-4 py-3 text-sm text-earth-muted">
          {exercise.explanation}
        </p>
      )}
    </div>
  );
}
