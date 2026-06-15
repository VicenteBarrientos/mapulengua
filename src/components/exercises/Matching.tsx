"use client";

import { useMemo, useRef, useState } from "react";
import type { MatchingExercise } from "@/lib/types";
import { lessonMatchClass } from "@/components/lesson/lessonStyles";

type Props = {
  exercise: MatchingExercise;
  onAnswer: (correct: boolean) => void;
  onMiss?: () => void;
  disabled?: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Matching({ exercise, onAnswer, onMiss, disabled }: Props) {
  const rights = useMemo(
    () => shuffle(exercise.pairs.map((p) => p.right)),
    [exercise.pairs]
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const heartLost = useRef(false);

  function tryMatch(leftId: string, rightText: string) {
    if (disabled || done) return;
    const pair = exercise.pairs.find((p) => p.id === leftId);
    if (!pair || matched.has(leftId)) return;

    if (pair.right === rightText) {
      const next = new Set(matched);
      next.add(leftId);
      setMatched(next);
      setSelectedLeft(null);
      setWrongId(null);
      if (next.size === exercise.pairs.length) {
        setDone(true);
        onAnswer(true);
      }
    } else {
      setWrongId(leftId);
      if (!heartLost.current) {
        heartLost.current = true;
        onMiss?.();
      }
      setTimeout(() => {
        setWrongId(null);
        setSelectedLeft(null);
      }, 500);
    }
  }

  function handleLeft(id: string) {
    if (matched.has(id)) return;
    setSelectedLeft(id);
  }

  function handleRight(text: string) {
    if (!selectedLeft) return;
    tryMatch(selectedLeft, text);
  }

  return (
    <div className="lesson-exercise">
      <p className="lesson-instruction">{exercise.instruction}</p>
      <p className="lesson-prompt text-lg">Toca una palabra y luego su pareja</p>

      <div className="grid flex-1 grid-cols-2 gap-2.5 content-start">
        <div className="space-y-2">
          {exercise.pairs.map((pair) => {
            const isMatched = matched.has(pair.id);
            const isSelected = selectedLeft === pair.id;
            const isWrong = wrongId === pair.id;
            const kind = isMatched
              ? "matched"
              : isWrong
                ? "wrong"
                : isSelected
                  ? "selected"
                  : "idle";
            return (
              <button
                key={pair.id}
                type="button"
                disabled={disabled || isMatched || done}
                onClick={() => handleLeft(pair.id)}
                className={lessonMatchClass(kind)}
              >
                {pair.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((text) => {
            const pairId = exercise.pairs.find((p) => p.right === text)?.id ?? "";
            const isMatched = matched.has(pairId);
            const kind = isMatched
              ? "matched"
              : selectedLeft
                ? "idle"
                : "disabled";
            return (
              <button
                key={text}
                type="button"
                disabled={disabled || isMatched || done || !selectedLeft}
                onClick={() => handleRight(text)}
                className={lessonMatchClass(kind)}
              >
                {text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
