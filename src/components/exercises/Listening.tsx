"use client";

import { useCallback, useState } from "react";
import type { ListeningExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";
import { lessonAnswerClass, type LessonAnswerState } from "@/components/lesson/lessonStyles";

type Props = {
  exercise: ListeningExercise;
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
    <div className="lesson-exercise">
      <p className="lesson-instruction">{exercise.instruction}</p>

      <div className="lesson-listen-wrap">
        <button
          type="button"
          onClick={playAudio}
          disabled={playing}
          className={`lesson-listen-btn ${playing ? "animate-pulse-soft" : ""}`}
          aria-label="Reproducir audio"
        >
          🔊
        </button>
        <p className="lesson-listen-hint">Toca para escuchar</p>
      </div>

      <div className="lesson-answers lesson-answers--grid-2">
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
