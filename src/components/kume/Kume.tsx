import Image from "next/image";

type KumeProps = {
  size?: number;
  mood?: "happy" | "thinking" | "celebrating" | "encouraging" | "motivated" | "surprised";
  /** @deprecated All variants use the same asset until expression sheets are added. */
  variant?: "hero" | "expression" | "face";
  className?: string;
};

const MOOD_CLASS: Record<NonNullable<KumeProps["mood"]>, string> = {
  happy: "",
  motivated: "scale-105",
  thinking: "opacity-90 saturate-[0.9]",
  encouraging: "animate-float",
  surprised: "scale-110",
  celebrating: "animate-celebrate",
};

/** Küme — Andean condor mascot for Mapulengua. */
export function Kume({ size = 120, mood = "happy", className = "" }: KumeProps) {
  return (
    <Image
      src="/kume/kume.png"
      alt="Küme, la mascota condor de Mapulengua"
      width={size}
      height={size}
      priority={size >= 120}
      className={`object-contain ${MOOD_CLASS[mood]} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
