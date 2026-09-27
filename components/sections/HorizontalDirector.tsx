"use client";

import { useRef } from "react";
import { useDeferredEffect } from "@/lib/hooks/useDeferredEffect";
import { gsap, motionQueries, ScrollTrigger } from "@/lib/utils/gsap";

/**
 * Converts vertical scroll into horizontal travel for the wedding gallery.
 * Uses CSS sticky (no DOM re-parenting) and sizes the section so the track
 * finishes exactly as the chapter ends.
 */
export function HorizontalDirector() {
  const anchor = useRef<HTMLSpanElement>(null);

  useDeferredEffect(() => {
    const section = anchor.current?.closest<HTMLElement>(".wedding");
    const track = section?.querySelector<HTMLElement>("[data-wedding-track]");
    if (!section || !track) return;
    const mm = gsap.matchMedia();

    mm.add(motionQueries.desktop, () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const size = () => {
        section.style.height = `${distance() + window.innerHeight}px`;
      };
      size();
      ScrollTrigger.addEventListener("refreshInit", size);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });
      // The section just grew: re-measure every trigger further down the page (e.g. the finale stage).
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", size);
        section.style.height = "";
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
    });

    return () => mm.revert();
  });

  return <span ref={anchor} hidden />;
}
