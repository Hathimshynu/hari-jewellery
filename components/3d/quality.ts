import type { ExperienceTier } from "@/lib/utils/deviceCapability";

/** Tiers that render WebGL. */
export type RenderTier = Exclude<ExperienceTier, "image">;

export interface SceneQuality {
  tier: RenderTier;
  dpr: [number, number];
  antialias: boolean;
  /** Refractive gemstones need an extra render pass — high-end desktop only. */
  transmission: boolean;
  particles: number;
  envResolution: number;
  /** Radial segment multiplier for beads and pearls. */
  detail: number;
}

export const qualityByTier: Record<RenderTier, SceneQuality> = {
  full: { tier: "full", dpr: [1, 2], antialias: true, transmission: true, particles: 180, envResolution: 256, detail: 1 },
  optimized: { tier: "optimized", dpr: [1, 1.75], antialias: true, transmission: false, particles: 110, envResolution: 128, detail: 0.75 },
  light: { tier: "light", dpr: [1, 1.5], antialias: false, transmission: false, particles: 50, envResolution: 64, detail: 0.6 },
};

export function isRenderTier(tier: ExperienceTier | undefined | null): tier is RenderTier {
  return tier === "full" || tier === "optimized" || tier === "light";
}
