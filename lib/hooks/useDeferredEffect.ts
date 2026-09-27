"use client";

import { useEffect, useEffectEvent } from "react";
import { onEngaged } from "@/lib/utils/engagement";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Runs `setup` off the hydration path:
 *  - "idle":    once the browser is idle after hydration;
 *  - "engaged": on the visitor's first interaction (see onEngaged) — for
 *               scroll choreography that cannot be seen before then.
 * `setup` may return a cleanup, which runs on unmount or when `key` changes.
 */
export function useDeferredEffect(
  setup: () => (() => void) | void,
  key: unknown = null,
  when: "idle" | "engaged" = "engaged",
) {
  const run = useEffectEvent(setup);

  useEffect(() => {
    let cleanup: (() => void) | void;
    let cancelled = false;
    const start = () => {
      if (!cancelled) cleanup = run();
    };

    let cancelSchedule: () => void;
    if (when === "engaged") {
      cancelSchedule = onEngaged(start);
    } else {
      const w = window as IdleWindow;
      const id = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 150);
      cancelSchedule = () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : window.clearTimeout(id));
    }

    return () => {
      cancelled = true;
      cancelSchedule();
      cleanup?.();
    };
  }, [key, when]);
}
