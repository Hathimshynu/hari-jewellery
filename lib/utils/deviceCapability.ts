/**
 * Device capability detection — feature and hardware signals only, never the
 * user-agent string.
 *
 *  full       high-end desktop      → full 3D (refraction, rich particles, DPR ≤ 2)
 *  optimized  normal desktop/tablet → optimised 3D
 *  light      phones / low memory   → lightweight 3D
 *  image      reduced motion, data saver, no WebGL, 2G → still imagery (or an image sequence)
 */
export type ExperienceTier = "full" | "optimized" | "light" | "image";
export type FormFactor = "mobile" | "tablet" | "desktop";

export interface DeviceCapability {
  tier: ExperienceTier;
  formFactor: FormFactor;
  reducedMotion: boolean;
  webgl: boolean;
  cores: number;
  memory: number;
  saveData: boolean;
  slowConnection: boolean;
  coarsePointer: boolean;
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    // Release the probe context immediately.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

let webglCache: boolean | null = null;

export function detectDeviceCapability(): DeviceCapability {
  const nav = navigator as NavigatorWithHints;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const width = window.innerWidth;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  const saveData = Boolean(nav.connection?.saveData);
  const slowConnection = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
  webglCache ??= supportsWebGL();
  const webgl = webglCache;

  const formFactor: FormFactor = coarsePointer ? (Math.min(width, window.innerHeight) < 600 ? "mobile" : "tablet") : width < 768 ? "mobile" : "desktop";

  let tier: ExperienceTier;
  if (reducedMotion || saveData || slowConnection || !webgl) tier = "image";
  else if (memory <= 2 || cores <= 2 || formFactor === "mobile") tier = "light";
  else if (formFactor === "tablet" || width < 1200 || cores <= 4 || memory <= 4) tier = "optimized";
  else tier = "full";

  return { tier, formFactor, reducedMotion, webgl, cores, memory, saveData, slowConnection, coarsePointer };
}
