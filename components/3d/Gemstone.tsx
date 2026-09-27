"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import { createBrilliantCut, createCabochon, createPearDrop, useDisposable } from "./geometry";
import { useJewelleryMaterials, type JewelleryMaterials } from "./materials";
import { DiamondSurface } from "./materials/DiamondSurface";

export type GemCut = "brilliant" | "pear" | "cabochon";
export type GemKind = keyof Pick<JewelleryMaterials, "ruby" | "emerald" | "diamond">;

export function useGemGeometry(cut: GemCut) {
  return useDisposable(
    useMemo(() => {
    if (cut === "pear") return createPearDrop(12);
    if (cut === "cabochon") return createCabochon(24);
      return createBrilliantCut(16);
    }, [cut]),
  );
}

type GemstoneProps = ThreeElements["group"] & {
  cut?: GemCut;
  kind?: GemKind;
};

/** A single cut gemstone. Brilliant and cabochon cuts face +Y; the pear drop points +Y. */
export function Gemstone({ cut = "brilliant", kind = "diamond", ...props }: GemstoneProps) {
  const materials = useJewelleryMaterials();
  const geometry = useGemGeometry(cut);
  return (
    <group {...props}>
      {kind === "diamond" ? (
        <mesh geometry={geometry}>
          <DiamondSurface />
        </mesh>
      ) : (
        <mesh geometry={geometry} material={materials[kind]} />
      )}
    </group>
  );
}
