"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Gemstone } from "./Gemstone";
import { GemGlints } from "./GemGlints";
import { composeMatrix, useDisposable } from "./geometry";
import { InstancedParts } from "./InstancedParts";
import { useGold, type GoldVariant } from "./materials";

/** A pair of solitaire diamond studs in four-prong baskets. Faces +Z. */
export function StudEarrings({ spacing = 0.34, variant = "yellow" }: { spacing?: number; variant?: GoldVariant }) {
  const gold = useGold(variant);
  const prong = useDisposable(useMemo(() => new THREE.CapsuleGeometry(0.022, 0.07, 4, 8), []));
  const rim = useDisposable(useMemo(() => new THREE.TorusGeometry(1, 0.1, 10, 48), []));
  const post = useDisposable(useMemo(() => new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8).rotateX(Math.PI / 2), []));

  const { prongs, glints } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const points: THREE.Vector3[] = [];
    for (const side of [-1, 1]) {
      const cx = side * spacing;
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + (k * Math.PI) / 2;
        // Prongs rise towards the viewer from the basket and lean inward over the girdle.
        const dir = new THREE.Vector3(-Math.cos(a) * 0.32, -Math.sin(a) * 0.32, 1).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const base = new THREE.Vector3(cx + Math.cos(a) * 0.15, Math.sin(a) * 0.15, -0.03);
        matrices.push(composeMatrix(base.addScaledVector(dir, 0.055), { quaternion: q }));
      }
      points.push(new THREE.Vector3(cx + 0.03, 0.04, 0.14));
    }
    return { prongs: matrices, glints: points };
  }, [spacing]);

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * spacing, 0, 0]}>
          <mesh geometry={rim} material={gold.polished} position={[0, 0, -0.03]} scale={0.13} />
          <mesh geometry={rim} material={gold.satin} position={[0, 0, -0.08]} scale={0.08} />
          <mesh geometry={post} material={gold.polished} position={[0, 0, -0.22]} />
          <Gemstone cut="brilliant" kind="diamond" rotation={[Math.PI / 2, 0, 0]} scale={0.14} />
        </group>
      ))}
      <InstancedParts geometry={prong} material={gold.polished} matrices={prongs} />
      <GemGlints anchors={glints} size={40} />
    </group>
  );
}
