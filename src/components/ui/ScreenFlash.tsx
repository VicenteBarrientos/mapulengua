"use client";

import { createContext, useCallback, useContext, useState } from "react";

type FlashType = "correct" | "wrong";

const FlashCtx = createContext<(type: FlashType) => void>(() => {});

export function useScreenFlash() {
  return useContext(FlashCtx);
}

export function ScreenFlashProvider({ children }: { children: React.ReactNode }) {
  const [flash, setFlash] = useState<{ type: FlashType; key: number } | null>(null);

  const trigger = useCallback((type: FlashType) => {
    setFlash({ type, key: Date.now() });
    const id = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <FlashCtx.Provider value={trigger}>
      {children}
      {flash && (
        <div
          key={flash.key}
          className={`screen-flash screen-flash--${flash.type}`}
          aria-hidden
        />
      )}
    </FlashCtx.Provider>
  );
}
