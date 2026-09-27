import * as THREE from "three";

/**
 * Pearl: a soft, slightly translucent-looking dielectric. Sheen gives the
 * velvety falloff at the edges, iridescence the faint orient, and a thin
 * clearcoat the sharp nacre highlight — a physically plausible stand-in for
 * subsurface scattering without its cost.
 */
export function createPearlMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    name: "pearl",
    color: "#F4EEE3",
    metalness: 0,
    roughness: 0.24,
    sheen: 1,
    sheenColor: new THREE.Color("#FFE4C6"),
    sheenRoughness: 0.4,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    iridescence: 0.45,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [180, 420],
    emissive: new THREE.Color("#2A2218"),
    emissiveIntensity: 0.25,
    envMapIntensity: 1.05,
  });
}
