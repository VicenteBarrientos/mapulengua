import type { Exercise, Lesson, ReviewCard } from "../types";

function cardId(arn: string, es: string): string {
  return `${arn}|${es}`.toLowerCase().replace(/\s+/g, "-");
}

function addPair(
  seen: Set<string>,
  cards: Omit<ReviewCard, "nextReview" | "intervalDays" | "repetitions">[],
  arn: string,
  es: string,
  lessonId: string
) {
  const id = cardId(arn, es);
  if (seen.has(id)) return;
  seen.add(id);
  cards.push({ id, arn, es, lessonId });
}

/** Extract Mapudungun ↔ Spanish pairs from lesson exercises */
export function extractReviewCards(
  lesson: Lesson
): Omit<ReviewCard, "nextReview" | "intervalDays" | "repetitions">[] {
  const seen = new Set<string>();
  const cards: Omit<ReviewCard, "nextReview" | "intervalDays" | "repetitions">[] = [];

  for (const ex of lesson.exercises) {
    extractFromExercise(ex, lesson.id, seen, cards);
  }

  return cards;
}

function extractFromExercise(
  ex: Exercise,
  lessonId: string,
  seen: Set<string>,
  cards: Omit<ReviewCard, "nextReview" | "intervalDays" | "repetitions">[]
) {
  switch (ex.type) {
    case "multiple-choice":
      if (ex.promptLang === "arn") {
        addPair(seen, cards, ex.prompt, ex.options[ex.correctIndex], lessonId);
      } else {
        addPair(seen, cards, ex.options[ex.correctIndex], ex.prompt, lessonId);
      }
      break;
    case "matching":
      for (const pair of ex.pairs) {
        addPair(seen, cards, pair.right, pair.left, lessonId);
      }
      break;
    case "listening":
      addPair(seen, cards, ex.audioText, ex.options[ex.correctIndex], lessonId);
      break;
    case "word-bank":
      addPair(seen, cards, ex.answer, ex.prompt.replace(/^Di «|» en mapudungun$/g, ""), lessonId);
      break;
    case "missing-word":
      if (ex.sentenceLang === "arn" && ex.correctIndex >= 0) {
        const word = ex.options[ex.correctIndex];
        const sentence = ex.sentence.join(word);
        addPair(seen, cards, sentence, ex.instruction, lessonId);
      }
      break;
  }
}

export function createReviewCard(
  partial: Omit<ReviewCard, "nextReview" | "intervalDays" | "repetitions">,
  today: string
): ReviewCard {
  return {
    ...partial,
    nextReview: today,
    intervalDays: 1,
    repetitions: 0,
  };
}

export function mergeReviewCards(
  existing: ReviewCard[],
  incoming: Omit<ReviewCard, "nextReview" | "intervalDays" | "repetitions">[],
  today: string
): ReviewCard[] {
  const byId = new Map(existing.map((c) => [c.id, c]));
  for (const card of incoming) {
    if (!byId.has(card.id)) {
      byId.set(card.id, createReviewCard(card, today));
    }
  }
  return Array.from(byId.values());
}

export function getDueReviewCards(review: ReviewCard[], today: string): ReviewCard[] {
  return review.filter((c) => c.nextReview <= today);
}

export function scheduleReview(card: ReviewCard, knewIt: boolean, today: string): ReviewCard {
  if (knewIt) {
    const intervalDays = Math.min(Math.max(card.intervalDays * 2, 1), 30);
    const next = new Date(today);
    next.setDate(next.getDate() + intervalDays);
    return {
      ...card,
      intervalDays,
      repetitions: card.repetitions + 1,
      nextReview: next.toISOString().slice(0, 10),
    };
  }

  const next = new Date(today);
  next.setDate(next.getDate() + 1);
  return {
    ...card,
    intervalDays: 1,
    repetitions: 0,
    nextReview: next.toISOString().slice(0, 10),
  };
}
