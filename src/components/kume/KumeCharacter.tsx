"use client";

import type { KumeEmotion } from "./tokens";
import { EMOTION_LABELS } from "./tokens";
import { KumeSvgArt } from "./KumeSvgArt";
import { useKumeLife } from "./useKumeLife";

export type KumeAction =
  | "idle"
  | "wave"
  | "celebrate"
  | "unlock"
  | "heartLoss"
  | "waiting";

export type KumeGameProps = {
  emotion?: KumeEmotion;
  size?: number;
  action?: KumeAction;
  speaking?: boolean;
  className?: string;
};

const ACTION_CLASS: Record<KumeAction, string> = {
  idle: "kume-act-idle",
  wave: "kume-act-wave",
  celebrate: "kume-act-celebrate",
  unlock: "kume-act-unlock",
  heartLoss: "kume-act-heart-loss",
  waiting: "kume-act-waiting",
};

function defaultAction(emotion: KumeEmotion): KumeAction {
  switch (emotion) {
    case "celebrating":
      return "celebrate";
    case "sad":
      return "heartLoss";
    case "thinking":
      return "waiting";
    case "excited":
      return "unlock";
    default:
      return "idle";
  }
}

/** Game Küme — interactive vector for small in-lesson reactions */
export function KumeGame({
  emotion = "happy",
  size = 72,
  action,
  speaking = false,
  className = "",
}: KumeGameProps) {
  const resolvedAction = action ?? defaultAction(emotion);
  const { blinking, talkFrame } = useKumeLife(speaking, true);
  const aspect = 200 / 280;
  const height = size;
  const width = Math.round(size * aspect);

  return (
    <div
      role="img"
      aria-label={`Küme, ${EMOTION_LABELS[emotion]}`}
      data-emotion={emotion}
      data-action={resolvedAction}
      className={`kume-character kume-game ${ACTION_CLASS[resolvedAction]} kume-emotion-${emotion} ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <div className="kume-character-inner">
        <KumeSvgArt blinking={blinking} talkOpen={speaking && talkFrame} emotion={emotion} />
      </div>
    </div>
  );
}

/** @alias KumeGame — interactive vector mascot */
export const KumeCharacter = KumeGame;
export type KumeCharacterProps = KumeGameProps;
