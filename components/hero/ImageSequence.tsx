"use client";

import { useEffect, useRef } from "react";
import { stageState } from "@/components/3d/stageState";

export interface SequenceSource {
  /** Folder URL, e.g. /images/sequences/necklace-portrait */
  path: string;
  count: number;
}

export interface SequenceSources {
  portrait: SequenceSource | null;
  wide: SequenceSource | null;
}

const frameUrl = (s: SequenceSource, i: number) => `${s.path}/frame-${String(i + 1).padStart(3, "0")}.webp`;

/** Coarse-to-fine load order (0, every 8th, every 4th, …) so scrubbing works before all frames arrive. */
function loadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  for (let step = 8; step >= 1; step /= 2) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

/**
 * Pre-rendered "Blender-style" frames of the opening film, scrubbed by scroll
 * on a 2D canvas. Used when WebGL is unavailable or too slow on a device.
 */
export function ImageSequence({
  sources,
  active,
  onReady,
}: {
  sources: SequenceSources;
  active: boolean;
  onReady?: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const wide = window.innerWidth / window.innerHeight >= 0.85;
    const source = (wide ? sources.wide : sources.portrait) ?? sources.wide ?? sources.portrait;
    if (!source) return;

    const frames: (HTMLImageElement | null)[] = Array.from({ length: source.count }, () => null);
    let cancelled = false;
    let readySent = false;
    let drawn = -1;

    // Load a few frames at a time, coarse to fine.
    const queue = loadOrder(source.count);
    const loadNext = () => {
      const i = queue.shift();
      if (i === undefined || cancelled) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        frames[i] = img;
        drawn = -1;
        loadNext();
      };
      img.onerror = loadNext;
      img.src = frameUrl(source, i);
    };
    for (let k = 0; k < 4; k++) loadNext();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      drawn = -1;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const target = Math.round(stageState.progress * (source.count - 1));
      // Nearest loaded frame to the target.
      let best = -1;
      for (let d = 0; d < source.count; d++) {
        if (frames[target - d]) {
          best = target - d;
          break;
        }
        if (frames[target + d]) {
          best = target + d;
          break;
        }
      }
      if (best < 0 || best === drawn) return;
      const img = frames[best];
      if (!img) return;
      const scale = Math.max(el.width / img.naturalWidth, el.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (el.width - w) / 2, (el.height - h) / 2, w, h);
      drawn = best;
      if (!readySent) {
        readySent = true;
        onReady?.();
      }
    };
    if (active) raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [sources, active, onReady]);

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
