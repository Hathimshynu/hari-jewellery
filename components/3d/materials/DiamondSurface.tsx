"use client";

import { MeshRefractionMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useJewelleryMaterials } from "./index";

/**
 * Material for a large, single diamond. On the full-quality tier it uses
 * ray-traced refraction (internal bounces, IOR 2.4, a touch of dispersion)
 * against a painted studio map — the look of a real brilliant cut.
 * Other tiers use polished mirror facets.
 */
export function DiamondSurface() {
  const materials = useJewelleryMaterials();
  const tint = useMemo(() => new THREE.Color("#ffffff"), []);

  if (!materials.refraction) return <primitive object={materials.diamond} attach="material" />;
  return (
    <MeshRefractionMaterial
      envMap={materials.diamondEnvironment}
      bounces={3}
      ior={2.4}
      fresnel={1}
      aberrationStrength={0.012}
      fastChroma
      color={tint}
    />
  );
}
