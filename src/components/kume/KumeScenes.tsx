"use client";

import { useEffect, useState } from "react";
import { KumeGame } from "./KumeCharacter";
import { KumeHero } from "./KumeHero";
import { KumeSpeechBubble } from "./KumeSpeechBubble";

const KEY = "mapulengua-onboarded";

const ONBOARD_LINES = [
  {
    title: "Küme, tu guía",
    heading: "Viajemos por Chile juntos",
    body: "Mari mari. Empezamos el viaje en Arica. Yo te acompaño hacia el sur.",
  },
  {
    title: "Tu compañero de camino",
    heading: "Solo toca la pantalla",
    body: "En cada parada aprenderás palabras del mapudungun sin prisa. Cada palabra te acerca más al Wallmapu.",
  },
  {
    title: "¿Listo?",
    heading: "¡Empecemos!",
    body: "Cuando quieras, seguimos caminando juntos.",
  },
];

/** First-visit welcome — Hero Küme waves & speaks */
export function KumeOnboarding({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setVisible(false);
    onDone?.();
  }

  if (!visible) return null;

  const line = ONBOARD_LINES[step];
  const isLast = step >= ONBOARD_LINES.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-charcoal/40 p-4 pb-24 backdrop-blur-sm animate-slide-up">
      <div className="w-full max-w-sm overflow-visible rounded-3xl border-2 border-teal/30 bg-cream shadow-xl">
        <div className="flex flex-col items-center px-6 pt-8 pb-2">
          <KumeSpeechBubble
            variant="hero"
            emotion="happy"
            heroAnimation="wave"
            speaking
            size={170}
            layout="above"
            className="w-full"
          >
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal">
              {line.title}
            </p>
            <p className="mt-1 text-base font-extrabold text-charcoal">{line.heading}</p>
            <p className="mt-2 text-sm leading-relaxed text-earth-muted">{line.body}</p>
          </KumeSpeechBubble>
        </div>
        <div className="space-y-3 px-6 py-5">
          <div className="flex justify-center gap-1.5">
            {ONBOARD_LINES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-terracotta" : "w-1.5 bg-sand-dark/50"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
            className="w-full rounded-2xl bg-terracotta py-3.5 font-extrabold text-white active:scale-[0.98]"
          >
            {isLast ? "Comenzar el viaje" : "Seguir →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Game Küme for in-lesson feedback */
export function KumeFeedback({
  correct,
  size = 56,
  message,
}: {
  correct: boolean;
  size?: number;
  message?: string;
}) {
  const emotion = correct ? "celebrating" : "sad";
  const action = correct ? "celebrate" : "heartLoss";

  if (message) {
    return (
      <KumeSpeechBubble
        variant="game"
        emotion={emotion}
        action={action}
        speaking={correct}
        size={size}
        layout="beside"
        className="items-end gap-2"
      >
        <p className="text-sm font-bold leading-snug text-charcoal">{message}</p>
      </KumeSpeechBubble>
    );
  }

  return <KumeGame emotion={emotion} action={action} size={size} />;
}

/** Streak milestone — Hero Küme */
export function KumeStreak({ streak, size = 56 }: { streak: number; size?: number }) {
  return (
    <KumeHero
      emotion={streak >= 7 ? "celebrating" : "proud"}
      animation={streak >= 7 ? "celebrate" : "bounce"}
      size={size}
    />
  );
}

/** Lesson completion — Hero Küme celebration */
export function KumeLessonComplete({ size = 180 }: { size?: number }) {
  return (
    <KumeHero
      emotion="celebrating"
      animation="celebrate"
      speaking
      size={size}
      priority
      className="mx-auto"
    />
  );
}
