"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type PwaInstallState =
  | { type: "unavailable" }
  | { type: "ios" }
  | { type: "ready"; trigger: () => Promise<void> };

const DISMISS_KEY = "mapulengua-install-dismissed";
const SHOW_DELAY_MS = 5000;

export function usePwaInstall() {
  const [state, setState] = useState<PwaInstallState>({ type: "unavailable" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const ua = navigator.userAgent.toLowerCase();
    const isIos =
      /iphone|ipad|ipod/.test(ua) &&
      !("MSStream" in window);

    if (isIos) {
      setState({ type: "ios" });
      const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      return () => clearTimeout(t);
    }

    let timer: ReturnType<typeof setTimeout>;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setState({
        type: "ready",
        trigger: async () => {
          await promptEvent.prompt();
          const { outcome } = await promptEvent.userChoice;
          if (outcome === "accepted") setVisible(false);
        },
      });
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
    setVisible(false);
  }

  return { state, visible, dismiss };
}
