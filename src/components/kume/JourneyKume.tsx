import { KumeGame } from "./KumeCharacter";
import { KumeHero } from "./KumeHero";
import { KumeHappy, KumeExcited, KumeThinking } from "./emotions";

export type JourneyKumeVariant = "happy" | "excited" | "thinking";

type Props = {
  variant: JourneyKumeVariant;
  size?: number;
  className?: string;
  speaking?: boolean;
  /** hero for journey banners; game for compact slots */
  mode?: "hero" | "game";
};

/** Journey Küme — Hero on map/banners, Game when compact */
export function JourneyKume({
  variant,
  size = 64,
  className = "",
  speaking,
  mode = "hero",
}: Props) {
  if (mode === "game") {
    switch (variant) {
      case "excited":
        return <KumeExcited size={size} className={className} speaking={speaking} />;
      case "thinking":
        return <KumeThinking size={size} className={className} speaking={speaking} />;
      default:
        return <KumeHappy size={size} className={className} speaking={speaking} />;
    }
  }

  const anim = variant === "excited" ? "unlock" : variant === "thinking" ? "float" : "float";
  return (
    <KumeHero
      emotion={variant === "thinking" ? "thinking" : variant === "excited" ? "excited" : "happy"}
      animation={anim}
      speaking={speaking}
      size={size}
      className={className}
    />
  );
}

export function toJourneyVariant(
  emotion: "happy" | "excited" | "thinking" | "proud" | "sad" | "celebrating"
): JourneyKumeVariant {
  if (emotion === "excited" || emotion === "celebrating") return "excited";
  if (emotion === "thinking" || emotion === "sad") return "thinking";
  return "happy";
}

export { KumeGame, KumeHero };
