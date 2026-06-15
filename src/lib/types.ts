/** Content provenance — swap or validate later with expert-reviewed material */
export type ContentSource = "seed" | "chatgpt" | "web" | "expert";

export type ContentMeta = {
  source: ContentSource;
  validated: boolean;
  notes?: string;
};

export type ExerciseType =
  | "multiple-choice"
  | "matching"
  | "translate-to-mapudungun"
  | "translate-to-spanish";

export type MultipleChoiceExercise = {
  type: "multiple-choice";
  id: string;
  prompt: string;
  promptLang: "es" | "arn";
  options: string[];
  correctIndex: number;
  explanation?: string;
  meta: ContentMeta;
};

export type MatchingPair = {
  id: string;
  left: string;
  right: string;
};

export type MatchingExercise = {
  type: "matching";
  id: string;
  instruction: string;
  pairs: MatchingPair[];
  meta: ContentMeta;
};

export type TranslateExercise = {
  type: "translate-to-mapudungun" | "translate-to-spanish";
  id: string;
  prompt: string;
  acceptedAnswers: string[];
  hint?: string;
  explanation?: string;
  meta: ContentMeta;
};

export type Exercise = MultipleChoiceExercise | MatchingExercise | TranslateExercise;

export type Lesson = {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  exercises: Exercise[];
  meta: ContentMeta;
};

export type Unit = {
  id: string;
  title: string;
  titleMapudungun: string;
  description: string;
  order: number;
  icon: string;
  color: string;
  lessons: Lesson[];
  meta: ContentMeta;
};

export type LessonProgress = {
  lessonId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  completedAt?: string;
};

export type UserProgress = {
  xp: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  lessons: Record<string, LessonProgress>;
};

export const DEFAULT_MAX_HEARTS = 5;
