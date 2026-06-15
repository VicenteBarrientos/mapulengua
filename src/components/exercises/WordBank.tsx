"use client";

import { useMemo, useState } from "react";
import type { WordBankExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";

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
    <div className="flex flex-1 flex-col">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-terracotta">
        {exercise.instruction}
      </p>
      <p className="mb-6 text-center text-xl font-extrabold text-charcoal">{exercise.prompt}</p>

      <div
        className={`mb-6 flex min-h-[56px] flex-wrap items-center justify-center gap-2 rounded-2xl border-2 px-4 py-4 ${
          revealed
            ? picked.join(" ").toLowerCase() === exercise.answer.toLowerCase()
              ? "border-sage bg-sage/10"
              : "border-coral bg-coral/10"
            : "border-sand-dark bg-white"
        }`}
      >
        {picked.length > 0 ? (
          picked.map((t, i) => (
            <span key={i} className="rounded-lg bg-terracotta/15 px-3 py-1 text-lg font-bold text-teal">
              {t}
            </span>
          ))
        ) : (
          <span className="text-earth-muted">Toca las palabras…</span>
        )}
      </div>

      {!revealed && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {tiles.map((tile) => (
              <button
                key={tile}
                type="button"
                disabled={disabled || picked.includes(tile)}
                onClick={() => tap(tile)}
                className="min-h-[52px] rounded-2xl border-2 border-sand-dark bg-white text-base font-bold active:scale-95 disabled:opacity-40"
              >
                {tile}
              </button>
            ))}
          </div>
          {picked.length > 0 && (
            <button
              type="button"
              onClick={resetPick}
              className="mt-3 text-sm font-bold text-teal"
            >
              Borrar selección
            </button>
          )}
        </>
      )}
    </div>
  );
}
