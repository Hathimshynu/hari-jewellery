import type { CSSProperties } from "react";

/** Deterministic pseudo-random so server markup is stable between builds. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A few drifting motes of gold light, pure CSS. Hidden from assistive tech. */
export function GoldMotes({ count = 14, seed = 7, className = "" }: { count?: number; seed?: number; className?: string }) {
  const rand = seeded(seed);
  const motes = Array.from({ length: count }, () => ({
    left: `${(rand() * 100).toFixed(1)}%`,
    top: `${(20 + rand() * 75).toFixed(1)}%`,
    "--s": `${(3 + rand() * 6).toFixed(1)}px`,
    animationDuration: `${(8 + rand() * 9).toFixed(1)}s`,
    animationDelay: `${(-rand() * 12).toFixed(1)}s`,
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {motes.map((style, i) => (
        <span key={i} className="mote" style={style as CSSProperties} />
      ))}
    </div>
  );
}
