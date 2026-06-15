"use client";

import type { ReactNode } from "react";
import { KumeGame, type KumeAction } from "./KumeCharacter";
import { KumeHero, type KumeHeroAnimation } from "./KumeHero";
import type { KumeEmotion } from "./tokens";

export type KumeSpeechVariant = "hero" | "game";

type Props = {
  children: ReactNode;
  emotion?: KumeEmotion;
  /** hero = detailed PNG; game = interactive vector */
  variant?: KumeSpeechVariant;
  action?: KumeAction;
  heroAnimation?: KumeHeroAnimation;
  speaking?: boolean;
  size?: number;
  layout?: "above" | "beside";
  className?: string;
};

const HERO_ANIM: Partial<Record<KumeAction, KumeHeroAnimation>> = {
  idle: "float",
  wave: "wave",
  celebrate: "celebrate",
  unlock: "unlock",
  heartLoss: "heartLoss",
  waiting: "float",
};

export function KumeSpeechBubble({
  children,
  emotion = "happy",
  variant = "hero",
  action,
  heroAnimation,
  speaking = true,
  size = 120,
  layout = "above",
  className = "",
}: Props) {
  const isBeside = layout === "beside";
  const isHero = variant === "hero";

  const mascot = isHero ? (
    <KumeHero
      emotion={emotion}
      animation={heroAnimation ?? (action ? HERO_ANIM[action] : undefined)}
      speaking={speaking}
      size={size}
      priority
    />
  ) : (
    <KumeGame emotion={emotion} action={action} speaking={speaking} size={size} />
  );

  return (
    <div
      className={`kume-speech-scene ${isBeside ? "kume-speech-beside" : "kume-speech-above"} ${className}`}
    >
      {!isBeside && (
        <div className="kume-bubble-wrap">
          <div className={`kume-bubble ${speaking ? "kume-bubble-live" : ""}`}>{children}</div>
          <div className="kume-bubble-tail kume-bubble-tail-down" />
        </div>
      )}
      {mascot}
      {isBeside && (
        <div className="kume-bubble-wrap flex-1">
          <div className={`kume-bubble ${speaking ? "kume-bubble-live" : ""}`}>{children}</div>
          <div className="kume-bubble-tail kume-bubble-tail-left" />
        </div>
      )}
    </div>
  );
}
