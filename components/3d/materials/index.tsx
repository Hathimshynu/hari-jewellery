"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import type * as THREE from "three";
import { createDiamondEnvironment, createGemMaterial } from "./GemMaterial";
import { createGoldMaterial, createMicroSurfaceMap, type GoldVariant } from "./GoldMaterial";
import { createPearlMaterial } from "./PearlMaterial";

export type { GemKind } from "./GemMaterial";
export type { GoldFinish, GoldVariant } from "./GoldMaterial";

type GoldSet = Record<GoldVariant, THREE.MeshPhysicalMaterial>;

export interface JewelleryMaterials {
  gold: GoldSet;
  goldSatin: GoldSet;
  pearl: THREE.MeshPhysicalMaterial;
  ruby: THREE.MeshPhysicalMaterial;
  emerald: THREE.MeshPhysicalMaterial;
  diamond: THREE.MeshPhysicalMaterial;
  /** Painted studio map diamonds reflect/refract (keeps them bright white). */
  diamondEnvironment: THREE.Texture;
  /** Ray-traced refraction for diamonds (full-quality tier only). */
  refraction: boolean;
}

function createJewelleryMaterials(transmission: boolean, microSurface: THREE.Texture) {
  const diamondEnvironment = createDiamondEnvironment();
  const diamond = createGemMaterial("diamond", transmission);
  diamond.envMap = diamondEnvironment;
  const variants: GoldVariant[] = ["yellow", "rose", "white"];
  const set = (finish: "polished" | "satin") =>
    Object.fromEntries(variants.map((v) => [v, createGoldMaterial(v, finish, microSurface)])) as GoldSet;
  return {
    gold: set("polished"),
    goldSatin: set("satin"),
    pearl: createPearlMaterial(),
    ruby: createGemMaterial("ruby", transmission),
    emerald: createGemMaterial("emerald", transmission),
    diamond,
    diamondEnvironment,
    refraction: transmission,
  } satisfies JewelleryMaterials;
}

const MaterialsContext = createContext<JewelleryMaterials | null>(null);

/** Shares one set of materials (and shader programs) across every piece in a canvas. */
export function MaterialsProvider({ transmission, children }: { transmission: boolean; children: ReactNode }) {
  const microSurface = useMemo(() => createMicroSurfaceMap(), []);
  const materials = useMemo(() => createJewelleryMaterials(transmission, microSurface), [transmission, microSurface]);

  useEffect(
    () => () => {
      const all = [...Object.values(materials.gold), ...Object.values(materials.goldSatin)];
      all.push(materials.pearl, materials.ruby, materials.emerald, materials.diamond);
      all.forEach((m) => m.dispose());
      materials.diamondEnvironment.dispose();
    },
    [materials],
  );
  useEffect(() => () => microSurface.dispose(), [microSurface]);

  return <MaterialsContext.Provider value={materials}>{children}</MaterialsContext.Provider>;
}

export function useJewelleryMaterials(): JewelleryMaterials {
  const materials = useContext(MaterialsContext);
  if (!materials) throw new Error("useJewelleryMaterials must be used inside <MaterialsProvider>");
  return materials;
}

/** Polished and satin gold for one alloy. */
export function useGold(variant: GoldVariant = "yellow") {
  const m = useJewelleryMaterials();
  return { polished: m.gold[variant], satin: m.goldSatin[variant] };
}
