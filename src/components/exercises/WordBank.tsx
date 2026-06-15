"use client";

import { useMemo, useState } from "react";
import type { WordBankExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";
import { lessonAnswerClass } from "@/components/lesson/lessonStyles";

type Props = {
  exercise: WordBankExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function WordBank({ exercise, onAnswer, disabled }: Props) {
  const tiles = useMemo(() => {
    const extra = exercise.tiles.filter((t) => t !== exercise.answer);
    const pool = exercise.answer.includes(" ")
      ? exercise.answer.split(" ").concat(extra.slice(0, 2))
      : [exercise.answer, ...extra.slice(0, 3)];
    const shuffled = [...new Set(pool)];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [exercise]);

  const [picked, setPicked] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const isCorrect =
    revealed && normalize(picked.join(" ")) === normalize(exercise.answer);

  function tap(tile: string) {
    if (disabled || revealed) return;
    playTap();
    const next = [...picked, tile];
    setPicked(next);
    const built = next.join(" ");
    const targetWords = exercise.answer.split(" ").length;

    if (normalize(built) === normalize(exercise.answer)) {
      setRevealed(true);
      onAnswer(true);
    } else if (next.length >= targetWords) {
      setRevealed(true);
      onAnswer(false);
    }
  }

  function resetPick() {
    if (revealed) return;
    setPicked([]);
  }

  return (
    <div className="lesson-exercise">
      <p className="lesson-instruction">{exercise.instruction}</p>
      <p className="lesson-prompt">{exercise.prompt}</p>

      <div
        className={`lesson-slot ${revealed ? (isCorrect ? "lesson-slot--correct" : "lesson-slot--wrong") : ""}`}
      >
        {picked.length > 0 ? (
          picked.map((t, i) => (
            <span key={i} className="lesson-tile">
              {t}
            </span>
          ))
        ) : (
          <span className="text-sm font-semibold text-earth-muted">Toca las palabras…</span>
        )}
      </div>

      {!revealed && (
        <>
          <div className="lesson-answers lesson-answers--grid-2">
            {tiles.map((tile) => (
              <button
                key={tile}
                type="button"
                disabled={disabled || picked.includes(tile)}
                onClick={() => tap(tile)}
                className={lessonAnswerClass("default", picked.includes(tile) ? "opacity-40" : "")}
              >
                {tile}
              </button>
            ))}
          </div>
          {picked.length > 0 && (
            <button type="button" onClick={resetPick} className="text-sm font-bold text-teal">
              Borrar selección
            </button>
          )}
        </>
      )}
    </div>
  );
}
