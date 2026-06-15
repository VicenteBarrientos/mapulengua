/** Content provenance — swap or validate later with expert-reviewed material */
export type ContentSource = "seed" | "chatgpt" | "web" | "expert";

export type ContentMeta = {
  source: ContentSource;
  validated: boolean;
  notes?: string;
};

export type LandscapeKind =
  | "desert"
  | "coast"
  | "araucania"
  | "chiloé"
  | "patagonia"
  | "city"
  | "wine"
  | "lake"
  | "volcano"
  | "fjord";

export type RegionTheme = {
  landscape: LandscapeKind;
  skyFrom: string;
  skyTo: string;
  accent: string;
  culturalElement: string;
  kumeWelcome: string;
};

export type MultipleChoiceExercise = {
  type: "multiple-choice";
  id: string;
  instruction?: string;
  prompt: string;
  promptLang: "es" | "arn";
  options: string[];
  correctIndex: number;
  phase?: "intro" | "practice";
  explanation?: string;
  meta: ContentMeta;
};

export type MatchingPair = { id: string; left: string; right: string };

export type MatchingExercise = {
  type: "matching";
  id: string;
  instruction: string;
  pairs: MatchingPair[];
  meta: ContentMeta;
};

export type ListeningExercise = {
  type: "listening";
  id: string;
  instruction: string;
  audioText: string;
  audioLang: "es" | "arn";
  options: string[];
  correctIndex: number;
  explanation?: string;
  meta: ContentMeta;
};

/** Tap word tiles — no keyboard */
export type WordBankExercise = {
  type: "word-bank";
  id: string;
  instruction: string;
  prompt: string;
  tiles: string[];
  answer: string;
  explanation?: string;
  meta: ContentMeta;
};

/** Tap to choose the missing word in a sentence — no keyboard */
export type MissingWordExercise = {
  type: "missing-word";
  id: string;
  instruction: string;
  /** Sentence parts around the blank, e.g. ["¿", "?", ""] → ¿ ___ ? */
  sentence: string[];
  sentenceLang: "es" | "arn";
  options: string[];
  correctIndex: number;
  explanation?: string;
  meta: ContentMeta;
};

export type Exercise =
  | MultipleChoiceExercise
  | MatchingExercise
  | ListeningExercise
  | WordBankExercise
  | MissingWordExercise;

/** A stop on the route — quick tap-only encounter */
export type Lesson = {
  id: string;
  regionId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  exercises: Exercise[];
  meta: ContentMeta;
};

/** A city stop on the southbound route */
export type Region = {
  id: string;
  name: string;
  topic: string;
  subtitle: string;
  latitude: string;
  order: number;
  theme: RegionTheme;
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
export const XP_PER_CORRECT = 3;
