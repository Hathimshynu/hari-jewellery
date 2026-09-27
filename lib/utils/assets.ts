import { closeSync, existsSync, openSync, readdirSync, readSync } from "node:fs";
import path from "node:path";
import { modelFiles, type JewelKind, type ModelManifest } from "@/lib/constants/models";

const publicDir = path.join(process.cwd(), "public");

/** True when the file starts with the binary glTF magic bytes ("glTF"). */
function isBinaryGltf(filePath: string): boolean {
  try {
    const fd = openSync(filePath, "r");
    const header = Buffer.alloc(4);
    readSync(fd, header, 0, 4, 0);
    closeSync(fd);
    return header.toString("ascii") === "glTF";
  } catch {
    return false;
  }
}

/**
 * Which real .glb models exist in /public/models (checked at build/render time
 * on the server). Files that are not valid binary glTF are skipped with a
 * warning, so a bad upload never reaches visitors; the procedural piece stays.
 */
export function getModelManifest(): ModelManifest {
  const manifest = {} as ModelManifest;
  for (const [kind, file] of Object.entries(modelFiles) as [JewelKind, string][]) {
    const filePath = path.join(publicDir, "models", file);
    if (!existsSync(filePath)) {
      manifest[kind] = null;
    } else if (!isBinaryGltf(filePath)) {
      console.warn(`[assets] public/models/${file} is not a valid .glb (binary glTF) — using the procedural piece.`);
      manifest[kind] = null;
    } else {
      manifest[kind] = `/models/${file}`;
    }
  }
  return manifest;
}

export interface HeroVideoSource {
  src: string;
  type: string;
}

/**
 * Returns the hero film if one has been added as /public/videos/hero.webm or
 * /public/videos/hero.mp4. When none exists the 3D experience is used.
 */
export function getHeroVideoSources(): HeroVideoSource[] {
  const candidates: HeroVideoSource[] = [
    { src: "/videos/hero.webm", type: "video/webm" },
    { src: "/videos/hero.mp4", type: "video/mp4" },
  ];
  return candidates.filter((c) => existsSync(path.join(publicDir, c.src)));
}

const existsCache = new Map<string, boolean>();

/** Whether a /public URL exists on disk (cached). Missing files are reported once during the build. */
export function publicFileExists(url: string): boolean {
  const cached = existsCache.get(url);
  if (cached !== undefined) return cached;
  const exists = existsSync(path.join(publicDir, url));
  if (!exists) console.warn(`[assets] Missing file: public${url} — a placeholder will be shown.`);
  existsCache.set(url, exists);
  return exists;
}

/** The asset when its file exists, otherwise null (callers render a placeholder). */
export function resolveAsset<T extends { src: string }>(asset: T): T | null {
  return publicFileExists(asset.src) ? asset : null;
}

export interface SequenceSource {
  path: string;
  count: number;
}

function countFrames(folder: string): SequenceSource | null {
  const dir = path.join(publicDir, "images", "sequences", folder);
  if (!existsSync(dir)) return null;
  const count = readdirSync(dir).filter((f) => /^frame-\d{3}\.webp$/.test(f)).length;
  return count > 1 ? { path: `/images/sequences/${folder}`, count } : null;
}

/**
 * Pre-rendered frames of the opening film (the image-sequence fallback), e.g.
 * /public/images/sequences/necklace-portrait/frame-001.webp … frame-048.webp.
 */
export function getSequenceSources(name = "necklace") {
  return { portrait: countFrames(`${name}-portrait`), wide: countFrames(`${name}-wide`) };
}
