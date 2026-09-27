"use client";

import { usePathname } from "next/navigation";
import { useDeferredEffect } from "@/lib/hooks/useDeferredEffect";
import { gsap, motionQueries, ScrollTrigger } from "@/lib/utils/gsap";

/**
 * One controller for every declarative reveal on the current page:
 *
 *  data-reveal="lines"   masked line-by-line rise (use <MaskLines>)
 *  data-reveal="words"   word-by-word rise (use <SplitWords>)
 *  data-reveal="fade"    soft rise and fade
 *  data-reveal="stagger" children with [data-reveal-item] fade in sequence
 *  data-reveal="clip"    image unmasked from below; [data-reveal-media] settles in scale
 *  data-parallax="0.12"  scrubbed vertical drift (fraction of own height)
 *
 * Performance: every initial state is written in one pass, then triggers are
 * created (layout reads only) and each tween is built when its element
 * enters — avoiding a forced layout per trigger on long pages.
 * Nothing runs for reduced-motion users; content is visible by default.
 */
export function ScrollReveals() {
  const pathname = usePathname();

  useDeferredEffect(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQueries.motion, () => {
        const all = <T extends Element = HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector);
        const reveals: { el: HTMLElement; play: () => void; start?: string }[] = [];

        // ── Pass 1: write initial states ──
        for (const el of all('[data-reveal="lines"]')) {
          const targets = el.querySelectorAll(".mask-line > span");
          gsap.set(targets, { yPercent: 112 });
          reveals.push({ el, play: () => gsap.to(targets, { yPercent: 0, duration: 1.25, ease: "expo.out", stagger: 0.09 }) });
        }
        for (const el of all('[data-reveal="words"]')) {
          const targets = el.querySelectorAll(".word > span");
          gsap.set(targets, { yPercent: 110 });
          reveals.push({ el, play: () => gsap.to(targets, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.028 }) });
        }
        for (const el of all('[data-reveal="fade"]')) {
          gsap.set(el, { y: 34, autoAlpha: 0 });
          const delay = Number(el.dataset.delay ?? 0);
          reveals.push({ el, play: () => gsap.to(el, { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", delay }) });
        }
        for (const el of all('[data-reveal="stagger"]')) {
          const items = el.querySelectorAll("[data-reveal-item]");
          gsap.set(items, { y: 28, autoAlpha: 0 });
          reveals.push({ el, play: () => gsap.to(items, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.12 }) });
        }
        for (const el of all('[data-reveal="clip"]')) {
          const media = el.querySelector("[data-reveal-media]");
          gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
          if (media) gsap.set(media, { scale: 1.28 });
          reveals.push({
            el,
            start: "top 82%",
            play: () => {
              gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
              if (media) gsap.to(media, { scale: 1, duration: 2, ease: "expo.out", delay: 0.1 });
            },
          });
        }
        const parallax = all("[data-parallax]").map((el) => {
          const amount = Number(el.dataset.parallax ?? 0.1) * 100;
          gsap.set(el, { yPercent: -amount });
          return { el, amount };
        });

        // ── Pass 2: measure (reads only), time-sliced so no task blocks input ──
        const created: { kill: () => void }[] = [];
        const jobs: (() => void)[] = [
          ...reveals.map(({ el, play, start = "top 86%" }) => () => {
            created.push(ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play }));
          }),
          ...parallax.map(({ el, amount }) => () => {
            const tween = gsap.to(el, {
              yPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            });
            created.push({ kill: () => (tween.scrollTrigger?.kill(), tween.kill()) });
          }),
        ];
        let timer = 0;
        const pump = () => {
          const started = performance.now();
          while (jobs.length && performance.now() - started < 12) jobs.shift()?.();
          if (jobs.length) timer = window.setTimeout(pump, 0);
        };
        pump();

        return () => {
          window.clearTimeout(timer);
          created.forEach((c) => c.kill());
        };
      });

      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      return () => mm.revert();
    },
    pathname,
  );

  return null;
}
