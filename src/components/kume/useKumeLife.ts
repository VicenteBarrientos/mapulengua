"use client";

import { useEffect, useState } from "react";

/** Random blinking + beak cycle while speaking */
export function useKumeLife(speaking: boolean, enabled = true) {
  const [blinking, setBlinking] = useState(false);
  const [talkFrame, setTalkFrame] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      timeoutId = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 110);
        scheduleBlink();
      }, 2400 + Math.random() * 2800);
    };
    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [enabled]);

  useEffect(() => {
    if (!speaking) {
      setTalkFrame(false);
      return;
    }
    const id = setInterval(() => setTalkFrame((f) => !f), 180);
    return () => clearInterval(id);
  }, [speaking]);

  return { blinking, talkFrame };
}
