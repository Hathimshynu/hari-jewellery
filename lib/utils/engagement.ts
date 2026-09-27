"use client";

const EVENTS = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;

let engaged = false;
const waiting = new Set<() => void>();

function engage() {
  if (engaged) return;
  engaged = true;
  EVENTS.forEach((e) => window.removeEventListener(e, engage, true));
  const callbacks = [...waiting];
  waiting.clear();
  callbacks.forEach((cb) => cb());
}

/**
 * Calls `cb` on the visitor's first interaction (pointer move, touch, wheel,
 * key or scroll) — immediately if that already happened or the page loaded
 * scrolled. Scroll choreography and WebGL are only wired up at this point,
 * keeping the first load light. Returns a cancel function.
 */
export function onEngaged(cb: () => void): () => void {
  if (engaged || window.scrollY > 0 || window.location.hash) {
    engaged = true;
    cb();
    return () => {};
  }
  if (waiting.size === 0) {
    EVENTS.forEach((e) => window.addEventListener(e, engage, { capture: true, passive: true }));
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}
