"use client";

import { useLayoutEffect, useRef } from "react";
import type * as THREE from "three";
import { DiamondSurface } from "./materials/DiamondSurface";

interface InstancedPartsProps {
  geometry: THREE.BufferGeometry;
  /** A shared material, or "diamond" for the tier-appropriate diamond surface. */
  material: THREE.Material | "diamond";
  matrices: THREE.Matrix4[];
}

/** Renders many copies of one geometry in a single draw call. */
export function InstancedParts({ geometry, material, matrices }: InstancedPartsProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
    mesh.count = matrices.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices]);

  if (matrices.length === 0) return null;
  if (material === "diamond") {
    return (
      <instancedMesh key={matrices.length} ref={ref} args={[geometry, undefined, matrices.length]}>
        <DiamondSurface />
      </instancedMesh>
    );
  }
  return <instancedMesh key={matrices.length} ref={ref} args={[geometry, material, matrices.length]} />;
}
