import * as THREE from "three";

export type GemKind = "ruby" | "emerald" | "diamond";

const coloured: Record<Exclude<GemKind, "diamond">, { tint: string; deep: string; ior: number }> = {
  ruby: { tint: "#FF4F6B", deep: "#8C0C25", ior: 1.77 },
  emerald: { tint: "#2FA872", deep: "#063D26", ior: 1.58 },
};

/**
 * Faceted gemstone material. With `transmission` (desktop) stones refract the
 * scene behind them; otherwise a polished faceted dielectric stands in, which
 * reads convincingly without the extra render pass.
 */
export function createGemMaterial(kind: GemKind, transmission: boolean): THREE.MeshPhysicalMaterial {
  if (kind === "diamond") {
    // A diamond's look is total internal reflection: bright facets against
    // dark ones. Screen-space transmission cannot do that (it reads as glass),
    // so every tier uses mirror facets against the studio's dark cards, with a
    // whisper of transmission-free iridescence for fire.
    return new THREE.MeshPhysicalMaterial({
      name: "gem-diamond",
      color: "#FFFFFF",
      metalness: 1,
      roughness: 0.015,
      clearcoat: 1,
      clearcoatRoughness: 0,
      emissive: new THREE.Color("#E9E6E1"),
      emissiveIntensity: 0.14,
      iridescence: transmission ? 0.35 : 0,
      iridescenceIOR: 2.1,
      iridescenceThicknessRange: [300, 900],
      envMapIntensity: 1.6,
      flatShading: true,
    });
  }

  const { tint, deep, ior } = coloured[kind];
  if (transmission) {
    return new THREE.MeshPhysicalMaterial({
      name: `gem-${kind}`,
      color: tint,
      transmission: 1,
      thickness: 0.06,
      ior,
      roughness: 0.02,
      attenuationColor: new THREE.Color(deep),
      attenuationDistance: 0.05,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.8,
      flatShading: true,
    });
  }
  return new THREE.MeshPhysicalMaterial({
    name: `gem-${kind}`,
    color: deep,
    metalness: 0.15,
    roughness: 0.05,
    ior,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    specularIntensity: 1,
    envMapIntensity: 2.2,
    flatShading: true,
  });
}

/**
 * A tiny painted studio (equirectangular, mipmapped) for refractive diamonds:
 * bright softboxes on a warm grey sweep with a few dark cards — the contrast
 * a brilliant cut needs to show fire. Self-contained; no HDR download.
 */
export function createDiamondEnvironment(): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#fffaf0");
    sky.addColorStop(0.45, "#d9cfbf");
    sky.addColorStop(0.55, "#b9ad99");
    sky.addColorStop(1, "#8a7d69");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    // Softboxes around the horizon and overhead.
    ctx.fillStyle = "#ffffff";
    for (const [x, y, bw, bh] of [
      [60, 150, 120, 150],
      [300, 120, 90, 220],
      [520, 170, 160, 110],
      [760, 130, 80, 200],
      [0, 10, 1024, 50],
    ]) {
      ctx.fillRect(x, y, bw, bh);
    }
    // Dark cards for contrast.
    ctx.fillStyle = "#1b1611";
    for (const [x, y, bw, bh] of [
      [210, 140, 40, 230],
      [440, 200, 26, 170],
      [690, 150, 34, 210],
      [900, 170, 60, 160],
    ]) {
      ctx.fillRect(x, y, bw, bh);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
