"use client";

import { useState } from "react";
import { KumeGame } from "@/components/kume/KumeCharacter";
import type { MultipleChoiceExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";
import { lessonAnswerClass, type LessonAnswerState } from "@/components/lesson/lessonStyles";

type Props = {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function optionState(
  revealed: boolean,
  index: number,
  selected: number | null,
  correctIndex: number
): LessonAnswerState {
  if (!revealed) return "default";
  if (index === correctIndex) return "correct";
  if (index === selected) return "wrong";
  return "dimmed";
}

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
    <div className="lesson-exercise">
      {exercise.instruction && (
        <p className="lesson-instruction">{exercise.instruction}</p>
      )}

      {isIntro ? (
        <div className="lesson-hero-card animate-pop">
          <div className="lesson-hero-kume">
            <KumeGame emotion="happy" action="idle" speaking size={72} />
          </div>
          <p className="lesson-hero-lang">Mapudungun</p>
          <h2 className="lesson-hero-word">{exercise.prompt}</h2>
          <p className="lesson-hero-hint">¿Qué significa?</p>
        </div>
      ) : (
        <p className="lesson-prompt">{exercise.prompt}</p>
      )}

      <div className="lesson-answers">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled || revealed}
            onClick={() => handleSelect(i)}
            className={lessonAnswerClass(optionState(revealed, i, selected, exercise.correctIndex))}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
