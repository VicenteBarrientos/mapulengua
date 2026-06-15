"use client";

import Image from "next/image";
import type { KumeEmotion } from "./tokens";
import { EMOTION_LABELS } from "./tokens";

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
  /** Subtle pulse while Küme is "speaking" (whole-image, not beak parts) */
  speaking?: boolean;
  className?: string;
  priority?: boolean;
};

const HERO_ASSET = "/kume/kume.png";
const ASPECT = 880 / 1152; // PNG proportions

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

/**
 * Hero Küme — official detailed PNG with subtle CSS motion only.
 * No white box, no card frame; blends into the UI.
 */
export function KumeHero({
  emotion = "happy",
  animation,
  size = 160,
  speaking = false,
  className = "",
  priority = false,
}: KumeHeroProps) {
  const anim = animation ?? defaultHeroAnimation(emotion);
  const height = size;
  const width = Math.round(size * ASPECT);

  return (
    <div
      role="img"
      aria-label={`Küme, ${EMOTION_LABELS[emotion]}`}
      data-emotion={emotion}
      className={`kume-hero ${ANIM_CLASS[anim]} ${speaking ? "kume-hero-speaking" : ""} ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <Image
        src={HERO_ASSET}
        alt=""
        width={width}
        height={height}
        priority={priority || size >= 120}
        className="kume-hero-img pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}
