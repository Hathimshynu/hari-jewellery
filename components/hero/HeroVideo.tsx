"use client";

import { useEffect, useRef } from "react";
import type { HeroVideoSource } from "@/lib/utils/assets";

interface HeroVideoProps {
  sources: HeroVideoSource[];
  poster: string;
}

/**
 * Optional cinematic film for the opening shot. Rendered only when a file
 * exists in /public/videos; it starts muted and looping, and never plays for
 * reduced-motion or data-saver visitors.
 */
export function HeroVideo({ sources, poster }: HeroVideoProps) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return;
    el.muted = true;
    el.play().catch(() => {
      /* Autoplay can be refused; the poster remains. */
    });
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 h-svh overflow-hidden" data-hero-video>
      <video
        ref={video}
        className="h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </div>
  );
}
