"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ListeningExercise } from "@/lib/types";
import { playTap } from "@/lib/sounds";
import { speak } from "@/lib/tts";
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

function SpeakerIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden fill="white">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"
      />
    </svg>
  );
}

function SoundWave() {
  return (
    <div className="listen-wave" aria-hidden>
      {[12, 20, 28, 20, 12].map((h, i) => (
        <span
          key={i}
          className="listen-wave-bar"
          style={{ "--bar-h": `${h}px`, animationDelay: `${i * 110}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function TurtleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <ellipse cx="12" cy="12" rx="6" ry="5" />
      <ellipse cx="12" cy="10" rx="4" ry="4" opacity="0.5" />
      <circle cx="6" cy="10" r="2.5" />
      <circle cx="18" cy="10" r="2.5" />
      <path d="M8 17 Q12 20 16 17" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M10 17 L9 20M14 17 L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5" cy="9" r="1" fill="white" />
      <circle cx="19" cy="9" r="1" fill="white" />
    </svg>
  );
}

export function Listening({ exercise, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const playAudio = useCallback(
    (slow = false) => {
      if (typeof window === "undefined") return;
      stopRef.current?.();
      setPlaying(true);
      stopRef.current = speak(exercise.audioText, {
        slow,
        onEnd: () => setPlaying(false),
        onError: () => setPlaying(false),
      });
      // Fallback in case onEnd never fires (some browsers)
      const fallback = setTimeout(() => setPlaying(false), slow ? 5000 : 3000);
      const prev = stopRef.current;
      stopRef.current = () => { prev(); clearTimeout(fallback); };
    },
    [exercise.audioText]
  );

  // Auto-play when a new exercise mounts
  useEffect(() => {
    const timer = setTimeout(() => playAudio(false), 350);
    return () => {
      clearTimeout(timer);
      stopRef.current?.();
      setPlaying(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

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

      {/* Speaker button + slow mode */}
      <div className="listen-wrap">
        <button
          type="button"
          onClick={() => playAudio(false)}
          aria-label={playing ? "Reproduciendo…" : "Reproducir audio"}
          className={`lesson-listen-btn ${playing ? "listen-btn--playing" : ""}`}
        >
          {playing ? <SoundWave /> : <SpeakerIcon />}
        </button>

        <button
          type="button"
          onClick={() => playAudio(true)}
          aria-label="Reproducir lento"
          className="listen-slow-btn"
        >
          <TurtleIcon />
          <span>Lento</span>
        </button>
      </div>

      <p className="lesson-listen-hint">
        {playing ? "Escuchando…" : "Toca para escuchar"}
      </p>

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
