"use client";

import { useRef } from "react";
import { stageState } from "@/components/3d/stageState";
import { useDeferredEffect } from "@/lib/hooks/useDeferredEffect";
import { gsap, motionQueries } from "@/lib/utils/gsap";

/** Scroll positions (0–1) where each chapter enters and leaves. */
const CHAPTERS: { in: number; out: number | null; fromLeft?: boolean }[] = [
  { in: 0.31, out: 0.44 },
  { in: 0.47, out: 0.59, fromLeft: true },
  { in: 0.63, out: 0.74 },
  { in: 0.9, out: null },
];

/** Editorial chapter (01–05) for a scroll position. */
const chapterAt = (p: number) => (p < 0.3 ? 1 : p < 0.45 ? 2 : p < 0.6 ? 3 : p < 0.75 ? 4 : 5);

/**
 * Scrubs the opening film. One ScrollTrigger drives both the DOM chapters
 * and `stageState.progress`, which the WebGL rig reads every frame.
 */
export function StoryDirector() {
  const anchor = useRef<HTMLSpanElement>(null);

  useDeferredEffect(() => {
    const section = anchor.current?.closest<HTMLElement>("#story");
    if (!section) return;
    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();

    mm.add(motionQueries.motion, () => {
      const chapterItems = q("[data-chapter]");
      let lastChapter = 1;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          onUpdate: (self) => {
            stageState.progress = self.progress;
            const chapter = chapterAt(self.progress);
            if (chapter !== lastChapter) {
              lastChapter = chapter;
              chapterItems.forEach((el) => el.toggleAttribute("data-active", Number(el.dataset.chapter) === chapter));
            }
          },
        },
      });
      // Anchor the timeline to exactly one unit so positions read as scroll progress.
      tl.to({}, { duration: 1 }, 0);

      // Opening: the title parts in opposite directions while the jewellery advances.
      // Chapter 1 holds; during the approach (chapter 2) the title parts as the camera moves in.
      tl.to(q("[data-hero-fade]"), { y: -50, autoAlpha: 0, duration: 0.07, ease: "power1.in" }, 0.03);
      tl.to(q('[data-hero-line="1"]'), { xPercent: -14, yPercent: -60, autoAlpha: 0, duration: 0.12, ease: "power1.in" }, 0.1);
      tl.to(q('[data-hero-line="2"]'), { xPercent: 14, yPercent: -40, autoAlpha: 0, duration: 0.12, ease: "power1.in" }, 0.1);
      const video = q("[data-hero-video]");
      if (video.length) tl.to(video, { autoAlpha: 0, duration: 0.06 }, 0.08);

      // Image-based fallback: the poster performs a simplified version of the camera move.
      const poster = q("[data-poster-image]");
      tl.to(poster, { scale: 1.3, yPercent: -4, duration: 0.16, ease: "power1.inOut" }, 0.14);
      tl.to(poster, { scale: 2.1, yPercent: -22, duration: 0.12, ease: "power1.inOut" }, 0.3);
      const wideLayout = window.innerWidth / window.innerHeight >= 0.85;
      // Phones get vertical-only motion; wide screens shift sideways like the 3D orbit.
      tl.to(poster, wideLayout ? { scale: 1.05, xPercent: 22, yPercent: 0, duration: 0.13 } : { scale: 0.85, yPercent: -20, duration: 0.13 }, 0.45);
      tl.to(poster, wideLayout ? { xPercent: 70, autoAlpha: 0, duration: 0.1 } : { yPercent: -70, autoAlpha: 0, duration: 0.1 }, 0.6);

      // Lateral entrances only where there is room beside the jewellery.
      const wide = window.innerWidth / window.innerHeight >= 0.85;
      q("[data-scene]").forEach((scene, i) => {
        if (i === 0) return;
        const timing = CHAPTERS[i - 1];
        const lines = scene.querySelectorAll("[data-scene-line] > span");
        const copy = scene.querySelectorAll("[data-scene-copy]");
        const end = timing.out ?? 1;

        tl.set(scene, { autoAlpha: 1 }, timing.in);
        tl.fromTo(lines, { yPercent: 115 }, { yPercent: 0, stagger: 0.012, duration: 0.06, ease: "power3.out" }, timing.in);
        tl.fromTo(copy, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, timing.in + 0.03);
        // Type drifts against the jewellery's motion for depth.
        tl.fromTo(
          scene,
          { y: 70, x: timing.fromLeft && wide ? -90 : 0 },
          { y: -50, x: 0, duration: end - timing.in },
          timing.in,
        );

        if (timing.out !== null) {
          tl.to(lines, { yPercent: -115, stagger: 0.008, duration: 0.045, ease: "power2.in" }, timing.out - 0.05);
          tl.to(copy, { autoAlpha: 0, duration: 0.03 }, timing.out - 0.05);
          tl.set(scene, { autoAlpha: 0 }, timing.out);
        }
      });

      tl.fromTo(q("[data-story-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
    });

    return () => mm.revert();
  });

  return <span ref={anchor} hidden />;
}
