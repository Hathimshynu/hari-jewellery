"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { scrollToTarget } from "@/lib/utils/smoothScroll";

const COVER_MS = 300;
const REVEAL_MS = 380;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

function isPlainLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}

/**
 * A short ivory curtain between routes (≈680 ms in total). Internal links are
 * intercepted globally, so every <Link> gets the transition for free.
 * Same-page hash links scroll smoothly instead.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);

  useEffect(() => {
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (!isPlainLeftClick(e)) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("tel:") || href.startsWith("mailto:")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const samePage = url.pathname === window.location.pathname;
      if (samePage && url.hash) {
        e.preventDefault();
        e.stopPropagation();
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (target) scrollToTarget(target);
        return;
      }
      if (samePage || reduced() || !curtain.current) return;

      e.preventDefault();
      e.stopPropagation();
      if (pending.current) return;
      pending.current = true;

      const el = curtain.current;
      el.style.visibility = "visible";
      el.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], {
        duration: COVER_MS,
        easing: EASE,
        fill: "forwards",
      }).onfinish = () => router.push(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [router]);

  useEffect(() => {
    const el = curtain.current;
    if (!pending.current || !el) return;
    pending.current = false;
    if (!window.location.hash) scrollToTarget(0, true);
    el.animate([{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }], {
      duration: REVEAL_MS,
      easing: EASE,
      fill: "forwards",
      delay: 60,
    }).onfinish = () => {
      el.style.visibility = "hidden";
    };
  }, [pathname]);

  return (
    <div
      ref={curtain}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ivory"
      style={{ visibility: "hidden", clipPath: "inset(100% 0 0 0)" }}
    >
      <div className="flex flex-col items-center gap-5">
        <BrandMark className="h-10 w-10 text-gold" />
        <span className="block h-px w-24 bg-gold/60" />
      </div>
    </div>
  );
}
