"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserProgress } from "../types";
import { DEFAULT_MAX_HEARTS } from "../types";

const STORAGE_KEY = "mapulengua-progress";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function createDefaultProgress(): UserProgress {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: "",
    hearts: DEFAULT_MAX_HEARTS,
    maxHearts: DEFAULT_MAX_HEARTS,
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

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setLoaded(true);
  }, []);

  const recordActivity = useCallback(() => {
    setProgress((prev) => {
      const next = updateStreak(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const loseHeart = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, hearts: Math.max(0, prev.hearts - 1) };
      saveProgress(next);
      return next;
    });
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, score: number, xpReward: number) => {
      setProgress((prev) => {
        const existing = prev.lessons[lessonId];
        const xpEarned = existing?.completed ? 0 : xpReward;
        const next: UserProgress = updateStreak({
          ...prev,
          xp: prev.xp + xpEarned,
          hearts: prev.maxHearts,
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
        saveProgress(next);
        return next;
      });
    },
    []
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

  return {
    progress,
    loaded,
    recordActivity,
    loseHeart,
    completeLesson,
    isLessonCompleted,
    getUnitProgress,
  };
}
