"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { KumeHero } from "@/components/kume/KumeHero";
import { LinkButton } from "@/components/ui/Button";
import { useProgress } from "@/lib/store/progress";
import { playSuccess, playMistake, playReviewReveal } from "@/lib/sounds";
import { speak, stopSpeech } from "@/lib/tts";
import { XP_PER_REVIEW } from "@/lib/types";
import type { ReviewCard } from "@/lib/types";

// ─── Primitives ───────────────────────────────────────────────────────────────

function SpeakerBtn({ playing, onPlay }: { playing: boolean; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onPlay(); }}
      aria-label={playing ? "Reproduciendo…" : "Escuchar pronunciación"}
      className={`review-speaker-btn ${playing ? "review-speaker-btn--active" : ""}`}
    >
      {playing ? (
        <span className="review-speaker-bars" aria-hidden>
          {[10, 16, 22, 16, 10].map((h, i) => (
            <span
              key={i}
              className="review-speaker-bar"
              style={{ "--bar-h": `${h}px`, animationDelay: `${i * 100}ms` } as React.CSSProperties}
            />
          ))}
        </span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
      )}
    </button>
  );
}

function FlipCard({
  card,
  revealed,
  onReveal,
  wordPlaying,
  onPlayWord,
}: {
  card: ReviewCard;
  revealed: boolean;
  onReveal: () => void;
  wordPlaying: boolean;
  onPlayWord: () => void;
}) {
  return (
    <div
      className="review-card-wrap"
      onClick={() => { if (!revealed) onReveal(); }}
      role={revealed ? undefined : "button"}
      aria-label={revealed ? undefined : "Revelar traducción"}
    >
      <div className={`review-card ${revealed ? "review-card--flipped" : ""}`}>
        {/* ── Front: Mapudungun word ── */}
        <div className="review-face review-face--front">
          <SpeakerBtn playing={wordPlaying} onPlay={onPlayWord} />
          <p className="review-lang-tag">Mapudungun</p>
          <p className="review-arn">{card.arn}</p>
          <p className="review-tap-hint">Toca para revelar</p>
        </div>

        {/* ── Back: Translation ── */}
        <div className="review-face review-face--back">
          <SpeakerBtn playing={wordPlaying} onPlay={onPlayWord} />
          <p className="review-lang-tag">Mapudungun</p>
          <p className="review-arn review-arn--back">{card.arn}</p>
          <div className="review-divider" />
          <p className="review-lang-tag review-lang-tag--es">Español</p>
          <p className="review-es">{card.es}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const { loaded, progress, getDueReviews, reviewCard } = useProgress();
  const [due, setDue] = useState<ReviewCard[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wordPlaying, setWordPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (loaded) {
      const cards = getDueReviews();
      setDue(cards);
      setIndex(0);
      setRevealed(false);
      setFinished(cards.length === 0);
    }
  }, [loaded, getDueReviews, progress.review]);

  const card = due[index];

  // ── Auto-play word when card changes ──────────────────────────────────────
  const playWord = useCallback(() => {
    if (!card) return;
    stopRef.current?.();
    setWordPlaying(true);
    stopRef.current = speak(card.arn, {
      onEnd: () => setWordPlaying(false),
      onError: () => setWordPlaying(false),
    });
  }, [card]);

  useEffect(() => {
    if (!card) return;
    setWordPlaying(false);
    const t = setTimeout(() => playWord(), 380);
    return () => {
      clearTimeout(t);
      stopSpeech();
      setWordPlaying(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  function handleReveal() {
    setRevealed(true);
    playReviewReveal();
  }

  const handleAnswer = useCallback(
    (knewIt: boolean) => {
      if (!card) return;
      reviewCard(card.id, knewIt);
      if (knewIt) {
        playSuccess();
        setSessionXp((x) => x + XP_PER_REVIEW);
      } else {
        playMistake();
      }
      if (index < due.length - 1) {
        setIndex((i) => i + 1);
        setRevealed(false);
      } else {
        setFinished(true);
        stopSpeech();
      }
    },
    [card, due.length, index, reviewCard]
  );

  // ── Empty: no cards in diary ───────────────────────────────────────────────
  if (loaded && progress.review.length === 0) {
    return (
      <AppShell>
        <div className="flex flex-col items-center px-4 py-12 text-center">
          <KumeHero emotion="thinking" animation="float" size={120} />
          <h1 className="mt-4 text-xl font-extrabold text-charcoal">Diario de viaje</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-earth-muted">
            Completa paradas en la ruta para coleccionar palabras. Pudu las guardará aquí para
            repasarlas contigo.
          </p>
          <LinkButton href="/" variant="outline" className="mt-6">
            Ir a la ruta
          </LinkButton>
        </div>
      </AppShell>
    );
  }

  // ── Finished ───────────────────────────────────────────────────────────────
  if (finished) {
    return (
      <AppShell>
        <div className="flex flex-col items-center px-4 py-12 text-center animate-celebrate">
          <KumeHero emotion="proud" animation="celebrate" size={130} />
          <h1 className="mt-4 text-xl font-extrabold text-terracotta">¡Repaso completo!</h1>
          {sessionXp > 0 && (
            <p className="mt-2 text-2xl font-extrabold text-gem">+{sessionXp} recuerdos</p>
          )}
          <p className="mt-2 max-w-xs text-sm text-earth-muted">
            Pudu anota cada palabra en tu diario. Vuelve mañana para seguir repasando.
          </p>
          <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
            <LinkButton href="/" fullWidth>Ver la ruta</LinkButton>
            <LinkButton href="/profile" variant="outline" fullWidth>Tu mochila</LinkButton>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!loaded || !card) {
    return (
      <AppShell>
        <div className="flex min-h-[50dvh] items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sand" />
        </div>
      </AppShell>
    );
  }

  // ── Active session ─────────────────────────────────────────────────────────
  const pct = ((index + (revealed ? 0.5 : 0)) / due.length) * 100;

  return (
    <AppShell>
      <div className="py-4">

        {/* Header */}
        <header className="mb-5 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-teal">
            Diario de viaje
          </p>
          <h1 className="text-xl font-extrabold text-charcoal">Repasa tus palabras</h1>

          {/* Progress bar */}
          <div className="mt-3 flex items-center justify-center gap-2.5 px-4">
            <div className="h-2 flex-1 max-w-[200px] overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal to-teal-muted transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs font-bold text-earth-muted tabular-nums">
              {index + 1}<span className="opacity-50">/{due.length}</span>
            </p>
          </div>
        </header>

        {/* Flip card */}
        <div className="mx-auto max-w-sm px-1">
          <FlipCard
            card={card}
            revealed={revealed}
            onReveal={handleReveal}
            wordPlaying={wordPlaying}
            onPlayWord={playWord}
          />

          {/* Answer buttons */}
          {revealed && (
            <div className="review-answer-row animate-slide-up">
              <button
                type="button"
                className="review-btn review-btn--again"
                onClick={() => handleAnswer(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Repasar
              </button>
              <button
                type="button"
                className="review-btn review-btn--good"
                onClick={() => handleAnswer(true)}
              >
                Lo sabía
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            </div>
          )}

          {/* Not-yet-revealed hint */}
          {!revealed && (
            <p className="mt-4 text-center text-[11px] font-semibold text-earth-muted/70">
              {progress.review.length} palabras en tu diario ·{" "}
              <Link href="/" className="font-bold text-teal underline-offset-2 hover:underline">
                volver a la ruta
              </Link>
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
