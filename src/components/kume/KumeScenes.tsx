"use client";

import { useEffect, useState } from "react";
import { KumeGame } from "./KumeCharacter";
import { KumeHero } from "./KumeHero";
import { KumeSpeechBubble } from "./KumeSpeechBubble";

const KEY = "mapulengua-onboarded";

// ─── Onboarding ───────────────────────────────────────────────────────────────

const WORD_OPTIONS = ["Hola", "Gracias", "Adiós", "Sí"];
const CORRECT_IDX = 0;

function OnboardDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === step
              ? "w-6 bg-terracotta"
              : i < step
              ? "w-1.5 bg-terracotta/50"
              : "w-1.5 bg-terracotta/20"
          }`}
        />
      ))}
    </div>
  );
}

function OnboardBtn({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl py-4 text-base font-extrabold transition-transform active:scale-[0.98] ${
        variant === "primary"
          ? "bg-terracotta text-white shadow-md shadow-terracotta/30"
          : "border-2 border-terracotta/30 text-terracotta"
      }`}
    >
      {children}
    </button>
  );
}

/** Screen 0 — Welcome */
function ScreenWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <KumeHero emotion="happy" animation="wave" size={200} className="mx-auto" />
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-terracotta">
            Mapulengua
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-charcoal">
            Bienvenido al Wallmapu
          </h1>
          <p className="text-base leading-relaxed text-earth-muted">
            Un viaje de Arica a Punta Arenas aprendiendo la lengua del pueblo Mapuche.
          </p>
        </div>
      </div>
      <div className="w-full space-y-3">
        <OnboardDots step={0} total={4} />
        <OnboardBtn onClick={onNext}>Empezar →</OnboardBtn>
      </div>
    </div>
  );
}

/** Screen 1 — Context */
function ScreenContext({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <KumeHero emotion="proud" animation="float" size={150} speaking className="mx-auto" />
        <div className="w-full rounded-3xl border border-sand-dark/20 bg-white/70 p-6 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-teal">
            ¿Sabías que…?
          </p>
          <p className="mt-3 text-lg font-bold leading-snug text-charcoal">
            El mapudungun es hablado por más de 700.000 personas en Chile y Argentina.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-earth-muted">
            Cada palabra que aprendas honra una historia viva de más de diez mil años.
          </p>
        </div>
      </div>
      <div className="w-full space-y-3">
        <OnboardDots step={1} total={4} />
        <OnboardBtn onClick={onNext}>Entendido →</OnboardBtn>
      </div>
    </div>
  );
}

/** Screen 2 — Interactive first word */
function ScreenWord({
  answered,
  onAnswer,
}: {
  answered: number | null;
  onAnswer: (i: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 w-full">
        <KumeHero emotion="excited" animation="bounce" size={120} className="mx-auto" />

        <div className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-teal">
            Tu primera palabra
          </p>
          <div className="mt-3 rounded-3xl border-2 border-terracotta/25 bg-terracotta/8 px-8 py-5">
            <p className="text-4xl font-extrabold tracking-wide text-terracotta">
              Mari mari
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-earth-muted">
              Mapudungun
            </p>
          </div>
        </div>

        <div className="w-full space-y-2">
          <p className="text-center text-sm font-bold text-charcoal">¿Qué significa?</p>
          {WORD_OPTIONS.map((opt, i) => {
            const isCorrect = i === CORRECT_IDX;
            const isSelected = answered === i;
            const showResult = answered !== null;

            let cls =
              "w-full rounded-2xl border-2 py-3.5 text-base font-bold transition-all active:scale-[0.98] ";
            if (!showResult) {
              cls += "border-sand-dark/30 bg-white text-charcoal";
            } else if (isCorrect) {
              cls += "border-green-500 bg-green-50 text-green-700";
            } else if (isSelected) {
              cls += "border-red-400 bg-red-50 text-red-600";
            } else {
              cls += "border-sand-dark/20 bg-white/50 text-earth-muted opacity-50";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => onAnswer(i)}
                disabled={showResult}
                className={cls}
              >
                {opt}
                {showResult && isCorrect && " ✓"}
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-full mt-4">
        <OnboardDots step={2} total={4} />
      </div>
    </div>
  );
}

/** Screen 3 — Success */
function ScreenSuccess({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <KumeHero emotion="celebrating" animation="celebrate" size={190} className="mx-auto" />
        <div className="space-y-2">
          <p className="text-3xl font-extrabold text-charcoal">¡Marimari!</p>
          <p className="text-base text-earth-muted leading-relaxed">
            Ya conoces tu primera palabra en mapudungun. El viaje acaba de comenzar.
          </p>
        </div>
        <div className="w-full rounded-3xl border border-terracotta/25 bg-terracotta/8 px-6 py-4">
          <p className="text-lg font-extrabold text-terracotta">
            Mari mari <span className="font-medium text-earth-muted">= Hola</span>
          </p>
        </div>
      </div>
      <div className="w-full space-y-3">
        <OnboardDots step={3} total={4} />
        <OnboardBtn onClick={onDone}>Comenzar el viaje →</OnboardBtn>
      </div>
    </div>
  );
}

/** First-visit onboarding — full-screen 4-step flow */
export function KumeOnboarding({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function advance() {
    setFading(true);
    setTimeout(() => {
      setFading(false);
      setStep((s) => s + 1);
    }, 180);
  }

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 180);
  }

  function handleAnswer(i: number) {
    if (answered !== null) return;
    setAnswered(i);
    if (i === CORRECT_IDX) {
      setTimeout(advance, 900);
    }
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-cream transition-opacity duration-[180ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="nimin-pattern-top pointer-events-none absolute inset-x-0 top-0 opacity-20" />

      <div
        className={`flex flex-1 flex-col transition-opacity duration-[180ms] ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {step === 0 && <ScreenWelcome onNext={advance} />}
        {step === 1 && <ScreenContext onNext={advance} />}
        {step === 2 && <ScreenWord answered={answered} onAnswer={handleAnswer} />}
        {step === 3 && <ScreenSuccess onDone={dismiss} />}
      </div>
    </div>
  );
}

// ─── In-lesson scenes (unchanged) ────────────────────────────────────────────

/** Game Pudu for in-lesson feedback */
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

/** Streak milestone — Hero Pudu */
export function KumeStreak({ streak, size = 56 }: { streak: number; size?: number }) {
  return (
    <KumeHero
      emotion={streak >= 7 ? "celebrating" : "proud"}
      animation={streak >= 7 ? "celebrate" : "bounce"}
      size={size}
    />
  );
}

/** Lesson completion — Hero Pudu celebration */
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
