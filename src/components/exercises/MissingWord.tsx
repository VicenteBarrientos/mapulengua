"use client";

import { useState } from "react";
import type { MissingWordExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";

type Props = {
  exercise: MissingWordExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function MissingWord({ exercise, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

  function choose(index: number) {
    if (disabled || picked !== null) return;
    playTap();
    setPicked(index);
    onAnswer(index === exercise.correctIndex);
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal">
        {exercise.instruction}
      </p>
      <div className="mb-6 rounded-2xl border-2 border-sand-dark bg-white px-4 py-6 text-center">
        <p className="font-display text-xl font-extrabold leading-relaxed text-charcoal">
          {exercise.sentence[0]}
          <span
            className={`mx-1 inline-block min-w-[4rem] rounded-xl border-2 border-dashed px-3 py-1 ${
              picked === null
                ? "border-terracotta/40 bg-terracotta/5 text-terracotta"
                : picked === exercise.correctIndex
                  ? "border-sage bg-sage/10 text-sage"
                  : "border-coral bg-coral/10 text-coral"
            }`}
          >
            {picked !== null ? exercise.options[picked] : "___"}
          </span>
          {exercise.sentence.slice(1).join("")}
        </p>
      </div>
      <div className="grid gap-3">
        {exercise.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === exercise.correctIndex;
          let style = "border-sand-dark bg-white text-charcoal active:scale-[0.98]";
          if (picked !== null) {
            if (isCorrect) style = "border-sage bg-sage/15 text-sage";
            else if (isPicked) style = "border-coral bg-coral/15 text-coral";
            else style = "border-sand-dark/50 bg-sand/30 text-earth-muted opacity-60";
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled || picked !== null}
              onClick={() => choose(i)}
              className={`min-h-[52px] rounded-2xl border-2 px-4 text-base font-bold transition-all ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && exercise.explanation && (
        <p className="mt-4 text-center text-sm text-earth-muted">{exercise.explanation}</p>
      )}
    </div>
  );
}
