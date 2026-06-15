"use client";

import { useState } from "react";
import type { MissingWordExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";
import { lessonAnswerClass, type LessonAnswerState } from "@/components/lesson/lessonStyles";

type Props = {
  exercise: MissingWordExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function optionState(
  picked: number | null,
  index: number,
  correctIndex: number
): LessonAnswerState {
  if (picked === null) return "default";
  if (index === correctIndex) return "correct";
  if (index === picked) return "wrong";
  return "dimmed";
}

export function MissingWord({ exercise, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

  function choose(index: number) {
    if (disabled || picked !== null) return;
    playTap();
    setPicked(index);
    onAnswer(index === exercise.correctIndex);
  }

  const blankClass =
    picked === null
      ? "lesson-blank"
      : picked === exercise.correctIndex
        ? "lesson-blank lesson-blank--correct"
        : "lesson-blank lesson-blank--wrong";

  return (
    <div className="lesson-exercise">
      <p className="lesson-instruction">{exercise.instruction}</p>

      <div className="lesson-card lesson-sentence-card">
        <p className="font-display text-xl font-extrabold leading-relaxed text-charcoal">
          {exercise.sentence[0]}
          <span className={blankClass}>
            {picked !== null ? exercise.options[picked] : "___"}
          </span>
          {exercise.sentence.slice(1).join("")}
        </p>
      </div>

      <div className="lesson-answers">
        {exercise.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={disabled || picked !== null}
            onClick={() => choose(i)}
            className={lessonAnswerClass(optionState(picked, i, exercise.correctIndex))}
          >
            {opt}
          </button>
        ))}
      </div>

      {picked !== null && exercise.explanation && (
        <p className="text-center text-sm font-medium text-earth-muted">{exercise.explanation}</p>
      )}
    </div>
  );
}
