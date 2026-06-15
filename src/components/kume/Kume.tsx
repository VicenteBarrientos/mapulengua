"use client";

import { KumeGame, type KumeGameProps } from "./KumeCharacter";
import { KumeHero } from "./KumeHero";
import type { KumeAnimation, KumeEmotion } from "./tokens";

export type KumeProps = {
  size?: number;
  emotion?: KumeEmotion;
  animation?: KumeAnimation;
  speaking?: boolean;
  className?: string;
  /** hero = PNG for large moments; game = vector for small UI (default game) */
  variant?: "hero" | "game";
  mood?: KumeEmotion | "encouraging" | "motivated" | "surprised";
};

const LEGACY_MOOD: Record<string, KumeEmotion> = {
  encouraging: "excited",
  motivated: "excited",
  surprised: "excited",
};

const GAME_ACTION: Partial<Record<KumeAnimation, KumeGameProps["action"]>> = {
  idle: "idle",
  blink: "idle",
  wingFlap: "unlock",
  celebrate: "celebrate",
  heartLoss: "heartLoss",
  lessonComplete: "celebrate",
  none: "idle",
};

const HERO_ANIM = {
  idle: "float",
  blink: "float",
  wingFlap: "wave",
  celebrate: "celebrate",
  heartLoss: "heartLoss",
  lessonComplete: "celebrate",
  none: "float",
} as const;

function resolveEmotion(
  emotion?: KumeEmotion,
  mood?: KumeProps["mood"]
): KumeEmotion {
  if (emotion) return emotion;
  if (mood && mood in LEGACY_MOOD) return LEGACY_MOOD[mood];
  if (mood) return mood as KumeEmotion;
  return "happy";
}

/** Unified Küme — routes to Hero (PNG) or Game (vector) */
export function Kume({
  size = 120,
  emotion,
  animation,
  speaking,
  mood,
  variant = "game",
  className = "",
}: KumeProps) {
  const resolved = resolveEmotion(emotion, mood);
  const anim = animation ?? "idle";

  if (variant === "hero") {
    return (
      <KumeHero
        emotion={resolved}
        animation={HERO_ANIM[anim]}
        speaking={speaking}
        size={size}
        className={className}
      />
    );
  }

  return (
    <KumeGame
      emotion={resolved}
      action={GAME_ACTION[anim]}
      speaking={speaking}
      size={size}
      className={className}
    />
  );
}

export type { KumeEmotion, KumeAnimation } from "./tokens";
