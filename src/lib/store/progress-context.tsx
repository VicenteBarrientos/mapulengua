"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { computeAchievements, getNewAchievements } from "../achievements";
import { getLesson } from "../data/regions";
import {
  extractReviewCards,
  getDueReviewCards,
  mergeReviewCards,
  scheduleReview,
} from "../review/vocabulary";
import { playStreak } from "../sounds";
import type { AchievementId, ReviewCard, UserProgress } from "../types";
import { DEFAULT_MAX_HEARTS, XP_PER_CORRECT, XP_PER_REVIEW } from "../types";

const STORAGE_KEY = "mapulengua-progress";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function weekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

export function createDefaultProgress(): UserProgress {
  const t = today();
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: "",
    hearts: DEFAULT_MAX_HEARTS,
    maxHearts: DEFAULT_MAX_HEARTS,
    lastHeartRefillDate: t,
    weekStart: weekStart(),
    weeklyXp: 0,
    reviewCorrect: 0,
    review: [],
    achievements: [],
    lessons: {},
  };
}

function loadProgress(): UserProgress {
  if (typeof window === "undefined") return createDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    return { ...createDefaultProgress(), ...JSON.parse(raw) };
  } catch {
    return createDefaultProgress();
  }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function refillHeartsIfNewDay(progress: UserProgress): UserProgress {
  const todayStr = today();
  if (progress.lastHeartRefillDate === todayStr) return progress;
  return {
    ...progress,
    hearts: progress.maxHearts,
    lastHeartRefillDate: todayStr,
  };
}

function resetWeeklyXpIfNeeded(progress: UserProgress): UserProgress {
  const ws = weekStart();
  if (progress.weekStart === ws) return progress;
  return { ...progress, weekStart: ws, weeklyXp: 0 };
}

function updateStreak(progress: UserProgress): UserProgress {
  const todayStr = today();
  if (progress.lastActiveDate === todayStr) return progress;

  let streak = progress.streak;
  if (progress.lastActiveDate === yesterday()) {
    streak += 1;
  } else if (progress.lastActiveDate !== todayStr) {
    streak = 1;
  }

  return { ...progress, streak, lastActiveDate: todayStr };
}

function addXpToProgress(progress: UserProgress, amount: number): UserProgress {
  const withWeek = resetWeeklyXpIfNeeded(progress);
  return {
    ...withWeek,
    xp: withWeek.xp + amount,
    weeklyXp: withWeek.weeklyXp + amount,
  };
}

function backfillReview(progress: UserProgress): UserProgress {
  const todayStr = today();
  let review = progress.review;
  for (const [lessonId, lp] of Object.entries(progress.lessons)) {
    if (!lp.completed) continue;
    const result = getLesson(lessonId);
    if (result) {
      review = mergeReviewCards(review, extractReviewCards(result.lesson), todayStr);
    }
  }
  return { ...progress, review };
}

function syncAchievements(progress: UserProgress): {
  progress: UserProgress;
  newAchievements: AchievementId[];
} {
  const isLessonCompleted = (id: string) => progress.lessons[id]?.completed ?? false;
  const before = progress.achievements;
  const after = computeAchievements(progress, isLessonCompleted);
  return {
    progress: { ...progress, achievements: after },
    newAchievements: getNewAchievements(before, after),
  };
}

type ProgressContextValue = {
  progress: UserProgress;
  loaded: boolean;
  recordActivity: () => AchievementId[];
  loseHeart: () => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, score: number, xpReward: number) => AchievementId[];
  reviewCard: (cardId: string, knewIt: boolean) => AchievementId[];
  isLessonCompleted: (id: string) => boolean;
  getUnitProgress: (lessonIds: string[]) => { completed: number; total: number };
  getDueReviews: () => ReviewCard[];
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const initial = loadProgress();
    const refilled = refillHeartsIfNewDay(resetWeeklyXpIfNeeded(initial));
    const withReview = backfillReview(refilled);
    const { progress: synced } = syncAchievements(withReview);
    setProgress(synced);
    if (JSON.stringify(synced) !== JSON.stringify(initial)) {
      saveProgress(synced);
    }
    setLoaded(true);
  }, []);

  const applyUpdate = useCallback(
    (updater: (prev: UserProgress) => UserProgress): AchievementId[] => {
      let newAchievements: AchievementId[] = [];
      setProgress((prev) => {
        const next = updater(prev);
        const { progress: withAchievements, newAchievements: fresh } = syncAchievements(next);
        newAchievements = fresh;
        saveProgress(withAchievements);
        return withAchievements;
      });
      return newAchievements;
    },
    []
  );

  const recordActivity = useCallback(() => {
    const milestones: number[] = [];
    const achievements = applyUpdate((prev) => {
      const refilled = refillHeartsIfNewDay(resetWeeklyXpIfNeeded(prev));
      const beforeStreak = refilled.streak;
      const next = updateStreak(refilled);
      if (next.streak > beforeStreak && [3, 7, 14, 30].includes(next.streak)) {
        milestones.push(next.streak);
      }
      return next;
    });
    if (milestones.length > 0) playStreak();
    return achievements;
  }, [applyUpdate]);

  const loseHeart = useCallback(() => {
    applyUpdate((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  }, [applyUpdate]);

  const addXp = useCallback(
    (amount: number) => {
      applyUpdate((prev) => addXpToProgress(prev, amount));
    },
    [applyUpdate]
  );

  const completeLesson = useCallback(
    (lessonId: string, score: number, xpReward: number) => {
      return applyUpdate((prev) => {
        const existing = prev.lessons[lessonId];
        const xpEarned = existing?.completed ? 0 : xpReward;
        const result = getLesson(lessonId);
        const todayStr = today();

        let review = prev.review;
        if (result && !existing?.completed) {
          const cards = extractReviewCards(result.lesson);
          review = mergeReviewCards(prev.review, cards, todayStr);
        }

        const base: UserProgress = updateStreak({
          ...prev,
          hearts: prev.maxHearts,
          review,
          lessons: {
            ...prev.lessons,
            [lessonId]: {
              lessonId,
              completed: true,
              score: Math.max(existing?.score ?? 0, score),
              xpEarned: (existing?.xpEarned ?? 0) + xpEarned,
              completedAt: new Date().toISOString(),
            },
          },
        });

        return addXpToProgress(base, xpEarned);
      });
    },
    [applyUpdate]
  );

  const reviewCard = useCallback(
    (cardId: string, knewIt: boolean) => {
      return applyUpdate((prev) => {
        const todayStr = today();
        const review = prev.review.map((card) =>
          card.id === cardId ? scheduleReview(card, knewIt, todayStr) : card
        );

        let next = { ...prev, review };
        if (knewIt) {
          next = addXpToProgress(
            { ...next, reviewCorrect: next.reviewCorrect + 1 },
            XP_PER_REVIEW
          );
        }

        return updateStreak(next);
      });
    },
    [applyUpdate]
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.lessons[lessonId]?.completed ?? false,
    [progress.lessons]
  );

  const getUnitProgress = useCallback(
    (lessonIds: string[]) => {
      const completed = lessonIds.filter((id) => progress.lessons[id]?.completed).length;
      return { completed, total: lessonIds.length };
    },
    [progress.lessons]
  );

  const getDueReviews = useCallback(() => {
    return getDueReviewCards(progress.review, today());
  }, [progress.review]);

  const value = useMemo(
    () => ({
      progress,
      loaded,
      recordActivity,
      loseHeart,
      addXp,
      completeLesson,
      reviewCard,
      isLessonCompleted,
      getUnitProgress,
      getDueReviews,
    }),
    [
      progress,
      loaded,
      recordActivity,
      loseHeart,
      addXp,
      completeLesson,
      reviewCard,
      isLessonCompleted,
      getUnitProgress,
      getDueReviews,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}

export { XP_PER_CORRECT, XP_PER_REVIEW };
