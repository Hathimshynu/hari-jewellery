"use client";

import { useEffect, useRef } from "react";

type CursorVariant = "default" | "view" | "explore" | "cta";

/**
 * Desktop-only cursor and magnetic buttons.
 *
 *  data-cursor="view" | "explore" | "cta"  → cursor label / expansion
 *  data-magnetic                            → element drifts toward the pointer
 */
export function PointerEffects() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches || !dot.current) return;

    const el = dot.current;
    document.documentElement.dataset.cursor = "custom";

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let variant: CursorVariant = "default";
    let magnetic: HTMLElement | null = null;
    let frame = 0;
    let visible = false;

    const setVariant = (next: CursorVariant) => {
      if (next === variant) return;
      variant = next;
      el.dataset.variant = next;
      if (label.current) label.current.textContent = next === "view" ? "View" : next === "explore" ? "Explore" : "";
    };

    let drifting: HTMLElement | null = null;

    const releaseMagnetic = () => {
      if (magnetic) magnetic.style.transform = "";
      magnetic = null;
    };

    const releaseDrift = () => {
      drifting?.style.removeProperty("--drift-x");
      drifting?.style.removeProperty("--drift-y");
      drifting = null;
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        el.style.opacity = "1";
      }

      const hit = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cursor], a, button");
      const kind = hit?.dataset.cursor as CursorVariant | undefined;
      setVariant(kind ?? (hit ? "cta" : "default"));

      const mag = (e.target as Element | null)?.closest?.<HTMLElement>("[data-magnetic]") ?? null;
      if (mag !== magnetic) releaseMagnetic();
      if (mag) {
        magnetic = mag;
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate3d(${dx * 0.18}px, ${dy * 0.28}px, 0)`;
      }

      const drift = (e.target as Element | null)?.closest?.<HTMLElement>("[data-drift]") ?? null;
      if (drift !== drifting) releaseDrift();
      if (drift) {
        drifting = drift;
        const r = drift.getBoundingClientRect();
        drift.style.setProperty("--drift-x", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        drift.style.setProperty("--drift-y", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
      releaseMagnetic();
      releaseDrift();
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      releaseMagnetic();
      releaseDrift();
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  return (
    <div ref={dot} className="cursor" data-variant="default" aria-hidden="true">
      <span className="cursor__ring">
        <span ref={label} className="cursor__label" />
      </span>
    </div>
  );
}
