"use client";

import { useMemo, useState } from "react";
import type { MatchingExercise } from "@/lib/types";
type Props = {
  exercise: MatchingExercise;
  onAnswer: (correct: boolean) => void;
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

export function Matching({ exercise, onAnswer, disabled }: Props) {
  const rights = useMemo(
    () => shuffle(exercise.pairs.map((p) => p.right)),
    [exercise.pairs]
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState(false);
  const [done, setDone] = useState(false);

  function tryMatch(leftId: string, rightText: string) {
    if (disabled || done) return;
    const pair = exercise.pairs.find((p) => p.id === leftId);
    if (!pair || matched.has(leftId)) return;

    if (pair.right === rightText) {
      const next = new Set(matched);
      next.add(leftId);
      setMatched(next);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (next.size === exercise.pairs.length) {
        setDone(true);
        onAnswer(true);
      }
    } else {
      setWrongPair(true);
      setTimeout(() => {
        setWrongPair(false);
        setSelectedLeft(null);
        setSelectedRight(null);
        onAnswer(false);
      }, 600);
    }
  }

  function handleLeftClick(id: string) {
    if (matched.has(id)) return;
    setSelectedLeft(id);
    if (selectedRight) tryMatch(id, selectedRight);
  }

  function handleRightClick(text: string) {
    if (matched.has(exercise.pairs.find((p) => p.right === text)?.id ?? "")) return;
    setSelectedRight(text);
    if (selectedLeft) tryMatch(selectedLeft, text);
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-earth">{exercise.instruction}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {exercise.pairs.map((pair) => {
            const isMatched = matched.has(pair.id);
            const isSelected = selectedLeft === pair.id;
            return (
              <button
                key={pair.id}
                type="button"
                disabled={disabled || isMatched || done}
                onClick={() => handleLeftClick(pair.id)}
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                  isMatched
                    ? "border-sage/50 bg-sage/10 opacity-60"
                    : isSelected
                      ? "border-teal bg-teal/10"
                      : wrongPair && isSelected
                        ? "border-coral bg-coral/10 animate-shake"
                        : "border-sand bg-white hover:border-teal/40"
                }`}
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
            const isSelected = selectedRight === text;
            return (
              <button
                key={text}
                type="button"
                disabled={disabled || isMatched || done}
                onClick={() => handleRightClick(text)}
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                  isMatched
                    ? "border-sage/50 bg-sage/10 opacity-60"
                    : isSelected
                      ? "border-teal bg-teal/10"
                      : "border-sand bg-white hover:border-teal/40"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
      </div>
      {done && (
        <p className="rounded-xl bg-sage/10 px-4 py-3 text-sm text-sage">
          ¡Excelente! Todas las parejas coinciden.
        </p>
      )}
    </div>
  );
}
