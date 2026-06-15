"use client";

import type { KumeEmotion } from "./tokens";
import { EMOTION_LABELS } from "./tokens";
import { KumeSvgArt } from "./KumeSvgArt";
import { useKumeLife } from "./useKumeLife";

export type KumeHeroAnimation =
  | "idle"
  | "float"
  | "bounce"
  | "celebrate"
  | "wave"
  | "unlock"
  | "heartLoss";

export type KumeHeroProps = {
  emotion?: KumeEmotion;
  animation?: KumeHeroAnimation;
  size?: number;
  speaking?: boolean;
  className?: string;
  priority?: boolean;
};

const ANIM_CLASS: Record<KumeHeroAnimation, string> = {
  idle: "kume-hero-act-float",
  float: "kume-hero-act-float",
  bounce: "kume-hero-act-bounce",
  celebrate: "kume-hero-act-celebrate",
  wave: "kume-hero-act-wave",
  unlock: "kume-hero-act-unlock",
  heartLoss: "kume-hero-act-heart-loss",
};

function defaultHeroAnimation(emotion: KumeEmotion): KumeHeroAnimation {
  switch (emotion) {
    case "celebrating":
      return "celebrate";
    case "excited":
      return "unlock";
    case "sad":
      return "heartLoss";
    default:
      return "float";
  }
}

/** Hero Pudu — full SVG character at large display size */
export function KumeHero({
  emotion = "happy",
  animation,
  size = 160,
  speaking = false,
  className = "",
}: KumeHeroProps) {
  const anim = animation ?? defaultHeroAnimation(emotion);
  const { blinking, talkFrame } = useKumeLife(speaking, false);
  const height = size;
  const width = Math.round(size * 0.84);

  return (
    <div
      role="img"
      aria-label={`Pudu, ${EMOTION_LABELS[emotion]}`}
      data-emotion={emotion}
      className={`kume-hero ${ANIM_CLASS[anim]} ${speaking ? "kume-hero-speaking" : ""} ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <KumeSvgArt blinking={blinking} talkOpen={speaking && talkFrame} emotion={emotion} />
    </div>
  );
}
