import { Kume, type KumeProps } from "./Kume";

type EmotionProps = Omit<KumeProps, "emotion" | "mood">;

export function KumeHappy(props: EmotionProps) {
  return <Kume emotion="happy" animation="idle" {...props} />;
}

export function KumeExcited(props: EmotionProps) {
  return <Kume emotion="excited" animation="wingFlap" {...props} />;
}

export function KumeThinking(props: EmotionProps) {
  return <Kume emotion="thinking" animation="idle" {...props} />;
}

export function KumeProud(props: EmotionProps) {
  return <Kume emotion="proud" animation="idle" {...props} />;
}

export function KumeSad(props: EmotionProps) {
  return <Kume emotion="sad" animation="heartLoss" {...props} />;
}

export function KumeCelebrating(props: EmotionProps) {
  return <Kume emotion="celebrating" animation="celebrate" {...props} />;
}
