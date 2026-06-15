"use client";

import type { Exercise } from "@/lib/types";
import { MultipleChoice } from "./MultipleChoice";
import { Matching } from "./Matching";
import { Listening } from "./Listening";
import { WordBank } from "./WordBank";
import { MissingWord } from "./MissingWord";

type Props = {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
  onMiss?: () => void;
  disabled?: boolean;
};

export function ExerciseRenderer({ exercise, onAnswer, onMiss, disabled }: Props) {
  switch (exercise.type) {
    case "multiple-choice":
      return <MultipleChoice exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "matching":
      return (
        <Matching exercise={exercise} onAnswer={onAnswer} onMiss={onMiss} disabled={disabled} />
      );
    case "listening":
      return <Listening exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "word-bank":
      return <WordBank exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "missing-word":
      return <MissingWord exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    default:
      return null;
  }
}
