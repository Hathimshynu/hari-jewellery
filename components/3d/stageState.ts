/**
 * Mutable, render-free state shared between the DOM scroll timeline (GSAP)
 * and the WebGL scene (React Three Fiber). GSAP writes, `useFrame` reads —
 * no React re-renders happen while scrolling.
 */

export type StageMode = "story" | "finale";

export interface StageState {
  /** Scrubbed progress of the homepage story, 0 → 1. */
  progress: number;
  /** Which choreography the stage is performing. */
  mode: StageMode;
  /** Normalised pointer position, -1 → 1 on both axes. */
  pointer: { x: number; y: number };
  /** When true the next frame jumps straight to its targets (used while the canvas is hidden). */
  snap: boolean;
}

export const stageState: StageState = {
  progress: 0,
  mode: "story",
  pointer: { x: 0, y: 0 },
  snap: true,
};

export function setStageMode(mode: StageMode) {
  if (stageState.mode !== mode) {
    stageState.mode = mode;
    stageState.snap = true;
  }
}
