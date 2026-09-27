"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { composeMatrix, createBangleBand, createCabochon, createPetal, segments, useDisposable } from "./geometry";
import { GemGlints } from "./GemGlints";
import { InstancedParts } from "./InstancedParts";
import { useGold, useJewelleryMaterials, type GoldVariant } from "./materials";

const UP = new THREE.Vector3(0, 1, 0);
const FRONT = new THREE.Vector3(0, 0, 1);

/** Temple kada: ridged band, milgrain rails, alternating ruby & emerald cabochons. Faces +Z. */
export function GoldBangle({ detail = 1, variant = "yellow" }: { detail?: number; variant?: GoldVariant }) {
  const materials = useJewelleryMaterials();
  const gold = useGold(variant);

  const band = useDisposable(useMemo(() => createBangleBand(segments(128, detail)).rotateX(Math.PI / 2), [detail]));
  const bead = useDisposable(useMemo(() => new THREE.SphereGeometry(1, segments(10, detail), segments(8, detail)), [detail]));
  const cabochon = useDisposable(useMemo(() => createCabochon(20), []));
  const bezel = useDisposable(useMemo(() => new THREE.TorusGeometry(1, 0.16, 10, 32), []));
  const petal = useDisposable(useMemo(() => createPetal(), []));

  const layout = useMemo(() => {
    const rails: THREE.Matrix4[] = [];
    const railCount = Math.round(128 * Math.max(detail, 0.6));
    for (let k = 0; k < railCount; k++) {
      const a = (k / railCount) * Math.PI * 2;
      for (const z of [-0.145, 0.145]) {
        rails.push(composeMatrix(new THREE.Vector3(Math.cos(a) * 1.07, Math.sin(a) * 1.07, z), { scale: 0.022 }));
      }
    }

    const rubies: THREE.Matrix4[] = [];
    const emeralds: THREE.Matrix4[] = [];
    const bezels: THREE.Matrix4[] = [];
    const petals: THREE.Matrix4[] = [];
    const settings = 16;
    for (let k = 0; k < settings; k++) {
      const a = (k / settings) * Math.PI * 2;
      const radial = new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
      const pos = radial.clone().multiplyScalar(1.085);
      const gemQ = new THREE.Quaternion().setFromUnitVectors(UP, radial);
      (k % 2 === 0 ? rubies : emeralds).push(composeMatrix(pos, { quaternion: gemQ, scale: 0.05 }));
      bezels.push(composeMatrix(pos, { quaternion: new THREE.Quaternion().setFromUnitVectors(FRONT, radial), scale: 0.058 }));

      // A pair of leaves flanking each stone, lying along the band.
      const tangent = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0);
      for (const dir of [-1, 1]) {
        const base = pos.clone().addScaledVector(tangent, dir * 0.07).addScaledVector(radial, -0.012);
        const m = new THREE.Matrix4().makeBasis(
          new THREE.Vector3().crossVectors(tangent.clone().multiplyScalar(dir), radial),
          tangent.clone().multiplyScalar(dir),
          radial,
        );
        const q = new THREE.Quaternion().setFromRotationMatrix(m);
        petals.push(composeMatrix(base, { quaternion: q, scale: 0.1 }));
      }
    }
    const glints = [...rubies, ...emeralds].map((m) => {
      const p = new THREE.Vector3().setFromMatrixPosition(m);
      return p.add(p.clone().setZ(0).normalize().multiplyScalar(0.05));
    });
    return { rails, rubies, emeralds, bezels, petals, glints };
  }, [detail]);

  return (
    <group>
      <mesh geometry={band} material={gold.polished} />
      <InstancedParts geometry={bead} material={gold.polished} matrices={layout.rails} />
      <InstancedParts geometry={bezel} material={gold.polished} matrices={layout.bezels} />
      <InstancedParts geometry={petal} material={gold.satin} matrices={layout.petals} />
      <InstancedParts geometry={cabochon} material={materials.ruby} matrices={layout.rubies} />
      <InstancedParts geometry={cabochon} material={materials.emerald} matrices={layout.emeralds} />
      <GemGlints anchors={layout.glints} size={30} />
    </group>
  );
}
