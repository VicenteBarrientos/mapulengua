"use client";

import { useEffect, useState } from "react";
import type { KumeAnimation, KumeEmotion } from "./tokens";
import { KUME_SPRITES } from "./tokens";

const DESIGN_GUIDE = "/kume/kume-design-guide.png";

export type KumeProps = {
  size?: number;
  emotion?: KumeEmotion;
  animation?: KumeAnimation;
  className?: string;
  /** Legacy alias */
  mood?: KumeEmotion | "encouraging" | "motivated" | "surprised";
};

const LEGACY_MOOD: Record<string, KumeEmotion> = {
  encouraging: "excited",
  motivated: "excited",
  surprised: "excited",
};

const ANIMATION_CLASS: Record<KumeAnimation, string> = {
  idle: "kume-anim-idle",
  blink: "kume-anim-blink",
  wingFlap: "kume-anim-wing",
  celebrate: "kume-anim-celebrate",
  heartLoss: "kume-anim-heart-loss",
  lessonComplete: "kume-anim-lesson-complete",
  none: "",
};

const EMOTION_FILTER: Partial<Record<KumeEmotion, string>> = {
  sad: "brightness(0.92) saturate(0.75)",
};

function resolveEmotion(
  emotion?: KumeEmotion,
  mood?: KumeProps["mood"]
): KumeEmotion {
  if (emotion) return emotion;
  if (mood && mood in LEGACY_MOOD) return LEGACY_MOOD[mood];
  if (mood) return mood as KumeEmotion;
  return "happy";
}

function resolveAnimation(
  animation: KumeAnimation | undefined,
  emotion: KumeEmotion
): KumeAnimation {
  if (animation) return animation;
  if (emotion === "celebrating") return "celebrate";
  if (emotion === "sad") return "heartLoss";
  return "idle";
}

/** Animated Küme — sprites from official design guide */
export function Kume({
  size = 120,
  emotion,
  animation,
  mood,
  className = "",
}: KumeProps) {
  const resolved = resolveEmotion(emotion, mood);
  const anim = resolveAnimation(animation, resolved);
  const sprite = KUME_SPRITES[resolved];
  const blinkSprite = KUME_SPRITES.blink;
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (anim !== "idle" && anim !== "blink") return;
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 120);
    };
    const interval = setInterval(blink, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [anim]);

  const activeSprite = blinking ? blinkSprite : sprite;
  const animClass = blinking ? "" : ANIMATION_CLASS[anim];

  return (
    <div
      role="img"
      aria-label={`Küme, ${resolved}`}
      className={`kume-root relative shrink-0 ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="kume-sprite absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${DESIGN_GUIDE})`,
          backgroundSize: `${activeSprite.scale * 100}%`,
          backgroundPosition: `${activeSprite.x} ${activeSprite.y}`,
          filter: EMOTION_FILTER[resolved],
        }}
      />
      {(resolved === "excited" || resolved === "celebrating") && (
        <>
          <span className="kume-sparkle kume-sparkle-a" />
          <span className="kume-sparkle kume-sparkle-b" />
        </>
      )}
    </div>
  );
}

/** Large hero Küme for onboarding / completion screens */
export function KumeHero({
  animation = "idle",
  className = "",
}: {
  animation?: KumeAnimation;
  className?: string;
}) {
  const sprite = KUME_SPRITES.hero;
  return (
    <div
      className={`kume-root relative mx-auto h-48 w-48 ${ANIMATION_CLASS[animation]} ${className}`}
      role="img"
      aria-label="Küme"
    >
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${DESIGN_GUIDE})`,
          backgroundSize: `${sprite.scale * 100}%`,
          backgroundPosition: `${sprite.x} ${sprite.y}`,
        }}
      />
    </div>
  );
}

export type { KumeEmotion, KumeAnimation } from "./tokens";
