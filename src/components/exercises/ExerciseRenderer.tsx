"use client";

import type { Exercise } from "@/lib/types";
import { MultipleChoice } from "./MultipleChoice";
import { Matching } from "./Matching";
import { Translate } from "./Translate";

type Props = {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function ExerciseRenderer({ exercise, onAnswer, disabled }: Props) {
  switch (exercise.type) {
    case "multiple-choice":
      return (
        <MultipleChoice
          exercise={exercise}
          onAnswer={onAnswer}
          disabled={disabled}
        />
      );
    case "matching":
      return (
        <Matching exercise={exercise} onAnswer={onAnswer} disabled={disabled} />
      );
    case "translate-to-mapudungun":
    case "translate-to-spanish":
      return (
        <Translate exercise={exercise} onAnswer={onAnswer} disabled={disabled} />
      );
    default:
      return null;
  }
}
