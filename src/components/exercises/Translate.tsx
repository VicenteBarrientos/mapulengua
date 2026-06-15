"use client";

import { useState } from "react";
import type { TranslateExercise } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type Props = {
  exercise: TranslateExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/[¿?]/g, "").replace(/\s+/g, " ");
}

function isCorrect(input: string, accepted: string[]): boolean {
  const normalized = normalize(input);
  return accepted.some((a) => normalize(a) === normalized);
}

export function Translate({ exercise, onAnswer, disabled }: Props) {
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const targetLang =
    exercise.type === "translate-to-mapudungun" ? "mapudungun" : "español";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled || revealed || !input.trim()) return;
    const correct = isCorrect(input, exercise.acceptedAnswers);
    setWasCorrect(correct);
    setRevealed(true);
    onAnswer(correct);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-wide text-earth-muted">
        Traduce al {targetLang}
      </p>
      <p className="font-display text-2xl font-bold text-teal">{exercise.prompt}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || revealed}
          placeholder="Escribe tu respuesta…"
          className="w-full rounded-xl border-2 border-sand bg-white px-4 py-3.5 text-lg text-earth outline-none transition-colors focus:border-teal disabled:opacity-60"
          autoComplete="off"
          autoCapitalize="off"
        />
        {!revealed && (
          <div className="flex gap-2">
            {exercise.hint && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
              >
                Pista
              </Button>
            )}
            <Button type="submit" fullWidth disabled={!input.trim()}>
              Comprobar
            </Button>
          </div>
        )}
      </form>

      {showHint && exercise.hint && !revealed && (
        <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-earth-muted">
          💡 {exercise.hint}
        </p>
      )}

      {revealed && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${wasCorrect ? "bg-sage/10 text-sage" : "bg-coral/10 text-coral"}`}
        >
          {wasCorrect ? (
            "¡Correcto!"
          ) : (
            <>
              Respuesta aceptada:{" "}
              <strong>{exercise.acceptedAnswers[0]}</strong>
            </>
          )}
          {exercise.explanation && (
            <p className="mt-2 text-earth-muted">{exercise.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
