import { KumeGame, type KumeGameProps } from "./KumeCharacter";

type Props = Omit<KumeGameProps, "emotion">;

export function KumeHappy(props: Props) {
  return <KumeGame emotion="happy" action="idle" {...props} />;
}

export function KumeExcited(props: Props) {
  return <KumeGame emotion="excited" action="unlock" {...props} />;
}

export function KumeThinking(props: Props) {
  return <KumeGame emotion="thinking" action="waiting" {...props} />;
}

export function KumeProud(props: Props) {
  return <KumeGame emotion="proud" action="idle" {...props} />;
}

export function KumeSad(props: Props) {
  return <KumeGame emotion="sad" action="heartLoss" {...props} />;
}

export function KumeCelebrating(props: Props) {
  return <KumeGame emotion="celebrating" action="celebrate" {...props} />;
}
