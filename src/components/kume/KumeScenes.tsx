"use client";

import { useEffect, useState } from "react";
import { Kume } from "./Kume";

const KEY = "mapulengua-onboarded";

/** First-visit welcome with Küme as travel guide */
export function KumeOnboarding({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(false);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-charcoal/40 p-4 pb-24 backdrop-blur-sm animate-slide-up">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-teal/30 bg-cream shadow-xl">
        <div className="bg-gradient-to-b from-sky/30 to-cream px-6 pt-6 text-center">
          <Kume size={140} emotion="happy" animation="idle" className="mx-auto" />
          <p className="mt-2 text-xs font-extrabold uppercase tracking-widest text-teal">
            Küme, tu guía
          </p>
          <h2 className="text-xl font-extrabold text-charcoal">
            Viajemos por Chile juntos
          </h2>
        </div>
        <div className="space-y-3 px-6 py-5">
          <p className="text-sm leading-relaxed text-earth-muted">
            Soy Küme, un cóndor de los Andes. Te acompaño desde Arica hacia el sur — en
            cada parada aprenderás palabras del mapudungun sin prisa, solo tocando la
            pantalla.
          </p>
          <p className="text-center font-display text-lg font-bold text-terracotta">
            Mari mari — ¡empecemos!
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="w-full rounded-2xl bg-terracotta py-3.5 font-extrabold text-white active:scale-[0.98]"
          >
            Comenzar el viaje
          </button>
        </div>
      </div>
    </div>
  );
}

/** Contextual Küme for lesson feedback */
export function KumeFeedback({
  correct,
  size = 56,
}: {
  correct: boolean;
  size?: number;
}) {
  return (
    <Kume
      size={size}
      emotion={correct ? "celebrating" : "sad"}
      animation={correct ? "celebrate" : "heartLoss"}
    />
  );
}

/** Streak milestone Küme */
export function KumeStreak({ streak, size = 48 }: { streak: number; size?: number }) {
  return (
    <Kume
      size={size}
      emotion={streak >= 7 ? "celebrating" : "proud"}
      animation="wingFlap"
    />
  );
}

/** Lesson completion screen Küme */
export function KumeLessonComplete({ size = 160 }: { size?: number }) {
  return (
    <Kume
      size={size}
      emotion="celebrating"
      animation="lessonComplete"
      className="mx-auto"
    />
  );
}
