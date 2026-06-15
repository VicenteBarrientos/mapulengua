"use client";

import { useCallback, useState } from "react";
import type { ListeningExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";

type Props = {
  exercise: ListeningExercise;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function Listening({ exercise, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playAudio = useCallback(() => {
    if (typeof window === "undefined") return;
    setPlaying(true);
    const utterance = new SpeechSynthesisUtterance(exercise.audioText);
    utterance.lang = exercise.audioLang === "arn" ? "es-CL" : "es-ES";
    utterance.rate = 0.85;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setTimeout(() => setPlaying(false), 2000);
  }, [exercise.audioText, exercise.audioLang]);

  function handleSelect(index: number) {
    if (disabled || revealed) return;
    playTap();
    setSelected(index);
    setRevealed(true);
    onAnswer(index === exercise.correctIndex);
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-terracotta">
        {exercise.instruction}
      </p>

      <div className="mb-8 flex flex-col items-center py-6">
        <button
          type="button"
          onClick={playAudio}
          disabled={playing}
          className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-terracotta bg-terracotta/10 text-4xl shadow-lg transition-transform active:scale-95 ${playing ? "animate-pulse-soft" : ""}`}
          aria-label="Reproducir audio"
        >
          🔊
        </button>
        <p className="mt-4 text-sm font-semibold text-earth-muted">
          Toca para escuchar
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        {exercise.options.map((option, i) => {
          let style =
            "border-2 border-sand-dark bg-white active:scale-[0.97] shadow-sm";
          if (revealed && i === exercise.correctIndex) {
            style = "border-2 border-sage bg-sage text-white";
          } else if (revealed && i === selected && i !== exercise.correctIndex) {
            style = "border-2 border-coral bg-coral/15 animate-shake";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || revealed}
              onClick={() => handleSelect(i)}
              className={`min-h-[56px] rounded-2xl px-4 py-3 text-sm font-bold ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
