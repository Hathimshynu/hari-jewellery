"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Gemstone } from "./Gemstone";
import { GemGlints } from "./GemGlints";
import { composeMatrix, createBrilliantCut, createRingBand, useDisposable } from "./geometry";
import { InstancedParts } from "./InstancedParts";
import { useGold, type GoldVariant } from "./materials";

const UP = new THREE.Vector3(0, 1, 0);

/** Solitaire with a pavé halo and diamond shoulders. The band stands upright facing +Z. */
export function GoldRing({ variant = "yellow" }: { variant?: GoldVariant }) {
  const gold = useGold(variant);
  const band = useDisposable(useMemo(() => createRingBand(96).rotateX(Math.PI / 2), []));
  const brilliant = useDisposable(useMemo(() => createBrilliantCut(16), []));
  const prong = useDisposable(useMemo(() => new THREE.CapsuleGeometry(0.016, 0.2, 4, 8), []));
  const halo = useDisposable(useMemo(() => new THREE.TorusGeometry(0.27, 0.028, 12, 64).rotateX(Math.PI / 2), []));

  const headY = 0.78;

  const { prongs, accents, glints } = useMemo(() => {
    const prongMatrices: THREE.Matrix4[] = [];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const lean = new THREE.Euler(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35);
      prongMatrices.push(
        composeMatrix(new THREE.Vector3(Math.cos(a) * 0.17, headY - 0.02, Math.sin(a) * 0.17), { euler: lean }),
      );
    }

    const accentMatrices: THREE.Matrix4[] = [];
    // Halo stones
    for (let k = 0; k < 18; k++) {
      const a = (k / 18) * Math.PI * 2;
      accentMatrices.push(
        composeMatrix(new THREE.Vector3(Math.cos(a) * 0.27, headY - 0.07 + 0.028, Math.sin(a) * 0.27), { scale: 0.03 }),
      );
    }
    // Shoulder stones set into the top of the band
    for (const side of [-1, 1]) {
      for (let k = 1; k <= 5; k++) {
        const a = Math.PI / 2 + side * (0.36 + k * 0.13);
        const radial = new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
        const q = new THREE.Quaternion().setFromUnitVectors(UP, radial);
        accentMatrices.push(composeMatrix(radial.clone().multiplyScalar(0.6), { quaternion: q, scale: 0.034 - k * 0.003 }));
      }
    }
    const glintPoints = [new THREE.Vector3(0.04, headY + 0.1, 0.12), new THREE.Vector3(-0.08, headY + 0.04, 0.16)];
    for (let k = 0; k < 18; k += 4) {
      const a = (k / 18) * Math.PI * 2;
      glintPoints.push(new THREE.Vector3(Math.cos(a) * 0.27, headY - 0.02, Math.sin(a) * 0.27 + 0.02));
    }
    return { prongs: prongMatrices, accents: accentMatrices, glints: glintPoints };
  }, []);

  return (
    <group>
      <mesh geometry={band} material={gold.polished} />
      <mesh geometry={halo} material={gold.polished} position={[0, headY - 0.07, 0]} />
      <mesh material={gold.polished} position={[0, 0.63, 0]} scale={[0.09, 0.08, 0.09]}>
        <cylinderGeometry args={[1, 1.4, 1, 24]} />
      </mesh>
      <InstancedParts geometry={prong} material={gold.polished} matrices={prongs} />
      <InstancedParts geometry={brilliant} material="diamond" matrices={accents} />
      <Gemstone cut="brilliant" kind="diamond" position={[0, headY + 0.01, 0]} scale={0.2} />
      <GemGlints anchors={glints} size={44} />
    </group>
  );
}
