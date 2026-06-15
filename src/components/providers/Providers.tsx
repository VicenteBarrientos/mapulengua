"use client";

import { ProgressProvider } from "@/lib/store/progress";
import { ScreenFlashProvider } from "@/components/ui/ScreenFlash";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <ScreenFlashProvider>{children}</ScreenFlashProvider>
    </ProgressProvider>
  );
}
