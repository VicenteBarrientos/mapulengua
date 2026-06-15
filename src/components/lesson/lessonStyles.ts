export type LessonAnswerState = "default" | "selected" | "correct" | "wrong" | "dimmed";

export function lessonAnswerClass(state: LessonAnswerState, extra = ""): string {
  const stateClass = state === "default" ? "" : `lesson-answer--${state}`;
  return ["lesson-answer", stateClass, extra].filter(Boolean).join(" ");
}

export function lessonMatchClass(
  kind: "matched" | "wrong" | "selected" | "idle" | "disabled"
): string {
  const map: Record<string, string> = {
    matched: "lesson-match-btn lesson-match-btn--matched",
    wrong: "lesson-match-btn lesson-match-btn--wrong",
    selected: "lesson-match-btn lesson-match-btn--selected",
    idle: "lesson-match-btn",
    disabled: "lesson-match-btn lesson-match-btn--disabled",
  };
  return map[kind];
}
