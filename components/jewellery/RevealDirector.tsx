"use client";

import { useRef } from "react";
import { useDeferredEffect } from "@/lib/hooks/useDeferredEffect";
import { gsap, motionQueries } from "@/lib/utils/gsap";

/** Scrubs "The art of gold": zoom into the pendant → macro opens → caption. */
export function RevealDirector() {
  const anchor = useRef<HTMLSpanElement>(null);

  useDeferredEffect(() => {
    const section = anchor.current?.closest<HTMLElement>(".reveal");
    if (!section) return;
    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();

    mm.add(motionQueries.motion, () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      tl.to({}, { duration: 1 }, 0);

      // The camera pushes into the pendant; the studio background falls away.
      const zoom = window.innerWidth / window.innerHeight >= 0.85 ? 3.4 : 2.2;
      tl.fromTo(q("[data-reveal-product]"), { scale: 1 }, { scale: zoom, duration: 0.5, ease: "power2.in" }, 0.05);
      tl.to(q("[data-reveal-bg]"), { autoAlpha: 0, duration: 0.3 }, 0.1);
      tl.to(q("[data-reveal-title]"), { yPercent: -60, autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0.08);

      // The macro opens out of the pendant through a widening iris.
      tl.fromTo(
        q("[data-reveal-macro]"),
        { clipPath: "circle(0% at 50% 58%)" },
        { clipPath: "circle(80% at 50% 50%)", duration: 0.28, ease: "power2.inOut" },
        0.42,
      );
      tl.fromTo(q("[data-reveal-macro] img"), { scale: 1.4 }, { scale: 1, duration: 0.45, ease: "power2.out" }, 0.42);
      tl.to(q("[data-reveal-product]"), { autoAlpha: 0, duration: 0.12 }, 0.58);

      tl.fromTo(q("[data-reveal-caption]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.72);
    });

    return () => mm.revert();
  });

  return <span ref={anchor} hidden />;
}
