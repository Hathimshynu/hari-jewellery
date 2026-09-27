"use client";

import { useRef } from "react";
import { useDeferredEffect } from "@/lib/hooks/useDeferredEffect";
import { gsap, motionQueries } from "@/lib/utils/gsap";

export function CraftsmanshipDirector() {
  const anchor = useRef<HTMLSpanElement>(null);

  useDeferredEffect(() => {
    const section = anchor.current?.closest<HTMLElement>(".craft");
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(motionQueries.desktop, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-craft-item]", section);
      const images = gsap.utils.toArray<HTMLElement>("[data-craft-image]", section);
      const count = section.querySelector<HTMLElement>("[data-craft-count]");
      let active = -1;

      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        items.forEach((item, k) => item.toggleAttribute("data-active", k === i));
        if (count) count.textContent = String(i + 1).padStart(2, "0");
      };
      setActive(0);
      section.setAttribute("data-sequenced", "");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => setActive(Math.min(images.length - 1, Math.floor(self.progress * images.length * 0.999 + 0.12))),
        },
      });
      tl.to({}, { duration: 1 }, 0);
      images.forEach((img, i) => {
        if (i === 0) return;
        const at = (i / images.length) * 0.92;
        tl.fromTo(
          img,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power2.inOut" },
          at,
        );
        const photo = img.querySelector("img");
        if (photo) tl.fromTo(photo, { scale: 1.25 }, { scale: 1, duration: 0.32, ease: "power2.out" }, at);
      });
      tl.fromTo(section.querySelector("[data-craft-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      // A slow push-in on each macro, like a camera on a slider.
      gsap.utils.toArray<HTMLElement>("[data-craft-drift]", section).forEach((el, i) => {
        const at = (i / images.length) * 0.92;
        tl.fromTo(el, { scale: 1.12, yPercent: 3 }, { scale: 1, yPercent: -3, duration: 1 / images.length + 0.1 }, Math.max(0, at - 0.05));
      });

      return () => {
        section.removeAttribute("data-sequenced");
        items.forEach((item) => item.removeAttribute("data-active"));
      };
    });

    return () => mm.revert();
  });

  return <span ref={anchor} hidden />;
}
