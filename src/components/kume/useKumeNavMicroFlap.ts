"use client";

import { useEffect, useState } from "react";

const FLAP_MS = 450;
const MIN_INTERVAL_MS = 6000;
const MAX_INTERVAL_MS = 9000;

/** One-shot wing micro-flap on a random 6–9s cadence (nav avatar only). */
export function useKumeNavMicroFlap(enabled: boolean) {
  const [flapping, setFlapping] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let flapTimeout: ReturnType<typeof setTimeout>;
    let resetTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearTimers = () => {
      clearTimeout(flapTimeout);
      clearTimeout(resetTimeout);
    };

    const schedule = () => {
      if (cancelled || mq.matches) return;
      const delay = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
      flapTimeout = setTimeout(() => {
        if (cancelled || mq.matches) return;
        setFlapping(true);
        resetTimeout = setTimeout(() => {
          if (cancelled) return;
          setFlapping(false);
          schedule();
        }, FLAP_MS);
      }, delay);
    };

    const onMotionPrefChange = () => {
      clearTimers();
      setFlapping(false);
      if (!mq.matches) schedule();
    };

    if (!mq.matches) schedule();
    mq.addEventListener("change", onMotionPrefChange);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", onMotionPrefChange);
      clearTimers();
      setFlapping(false);
    };
  }, [enabled]);

  return flapping;
}
