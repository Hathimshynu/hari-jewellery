import * as THREE from "three";

export type GoldVariant = "yellow" | "rose" | "white";
export type GoldFinish = "polished" | "satin";

/**
 * Base reflectance per alloy (sRGB). Kept pale and slightly desaturated:
 * real polished gold reads warm through its reflections, not through a
 * saturated base colour — that is what makes CGI gold look orange/plastic.
 */
export const goldPalette: Record<GoldVariant, Record<GoldFinish, string>> = {
  yellow: { polished: "#F6CD7E", satin: "#E9BD6E" },
  rose: { polished: "#F2C2A6", satin: "#E4B093" },
  white: { polished: "#ECEAE5", satin: "#DEDBD4" },
};

const finishRoughness: Record<GoldFinish, number> = { polished: 0.16, satin: 0.27 };

/**
 * Tileable micro-surface variation used as a roughness map, so reflections
 * break up very slightly like hand-finished metal instead of a perfect mirror.
 * Deterministic (seeded) so every visit looks the same.
 */
export function createMicroSurfaceMap(size = 128): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  let seed = 1337;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  // Value noise: coarse cells blended with fine grain.
  const cells = 16;
  const grid = Array.from({ length: (cells + 1) * (cells + 1) }, random);
  const at = (x: number, y: number) => grid[(y % cells) * (cells + 1) + (x % cells)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * cells;
      const gy = (y / size) * cells;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = gx - x0;
      const fy = gy - y0;
      const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx;
      const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx;
      const coarse = top * (1 - fy) + bottom * fy;
      const value = 0.72 + coarse * 0.2 + random() * 0.08; // 0.72–1.0 of base roughness
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = Math.round(value * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.needsUpdate = true;
  return texture;
}

export function createGoldMaterial(
  variant: GoldVariant,
  finish: GoldFinish,
  microSurface: THREE.Texture | null,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    name: `gold-${variant}-${finish}`,
    color: goldPalette[variant][finish],
    metalness: 1,
    roughness: finishRoughness[finish],
    roughnessMap: microSurface,
    // A faint lacquer-like sheen on polished surfaces gives highlights a crisp edge.
    clearcoat: finish === "polished" ? 0.25 : 0,
    clearcoatRoughness: 0.2,
    envMapIntensity: finish === "polished" ? 1.3 : 1.1,
  });
}
