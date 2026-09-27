"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Gemstone } from "./Gemstone";
import { GemGlints } from "./GemGlints";
import { composeMatrix, createBrilliantCut, segments, useDisposable } from "./geometry";
import { InstancedParts } from "./InstancedParts";
import { useGold, type GoldVariant } from "./materials";

const FRONT = new THREE.Vector3(0, 0, 1);
const UP = new THREE.Vector3(0, 1, 0);

/** Fine cable chain loop (front drops into a V where the pendant hangs). */
function chainPoint(theta: number) {
  const hang = Math.pow((1 + Math.cos(theta)) / 2, 3.2);
  return new THREE.Vector3(0.95 * Math.sin(theta), -1.15 * hang, 0.72 * Math.cos(theta));
}

function buildLayout(linkCount: number) {
  const samples = Array.from({ length: 121 }, (_, i) => chainPoint(-Math.PI + (2 * Math.PI * i) / 120));
  const curve = new THREE.CatmullRomCurve3(samples, true, "centripetal");

  // Interlocking links: each link aligned to the chain, alternate links turned 90°.
  const links: THREE.Matrix4[] = [];
  for (let i = 0; i < linkCount; i++) {
    const u = i / linkCount;
    const p = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);
    if (i % 2) q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
    links.push(composeMatrix(p, { quaternion: q, scale: new THREE.Vector3(0.016, 0.009, 0.009) }));
  }

  const bail = curve.getPointAt(0.5);
  const center = bail.clone().add(new THREE.Vector3(0, -0.16, 0.02));
  const halo: THREE.Matrix4[] = [];
  const gemUp = new THREE.Quaternion().setFromUnitVectors(UP, FRONT);
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2;
    halo.push(
      composeMatrix(center.clone().add(new THREE.Vector3(Math.cos(a) * 0.112, Math.sin(a) * 0.112, 0.012)), {
        quaternion: gemUp,
        scale: 0.017,
      }),
    );
  }
  const glints = [center.clone().add(new THREE.Vector3(0.02, 0.03, 0.08))];
  for (let k = 0; k < 14; k += 5) {
    const a = (k / 14) * Math.PI * 2;
    glints.push(center.clone().add(new THREE.Vector3(Math.cos(a) * 0.112, Math.sin(a) * 0.112, 0.03)));
  }
  return { links, bail, center, halo, glints };
}

/** Contemporary fine chain with a halo-set solitaire pendant. Faces +Z. */
export function FinePendant({ detail = 1, variant = "yellow" }: { detail?: number; variant?: GoldVariant }) {
  const gold = useGold(variant);
  const link = useDisposable(useMemo(() => new THREE.TorusGeometry(1, 0.32, 6, segments(12, detail)), [detail]));
  const brilliant = useDisposable(useMemo(() => createBrilliantCut(16), []));
  const bezel = useDisposable(useMemo(() => new THREE.TorusGeometry(1, 0.12, 12, 48), []));

  const layout = useMemo(() => buildLayout(Math.round(300 * Math.max(detail, 0.6))), [detail]);
  const c = layout.center;

  return (
    <group position={[0, 0.55, 0]}>
      <InstancedParts geometry={link} material={gold.polished} matrices={layout.links} />
      {/* Bail */}
      <mesh
        geometry={bezel}
        material={gold.polished}
        position={[layout.bail.x, layout.bail.y - 0.04, layout.bail.z + 0.01]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.03, 0.036, 0.05]}
      />
      {/* Halo setting */}
      <mesh geometry={bezel} material={gold.polished} position={[c.x, c.y, c.z]} scale={0.084} />
      <mesh geometry={bezel} material={gold.satin} position={[c.x, c.y, c.z - 0.006]} scale={0.132} />
      <InstancedParts geometry={brilliant} material="diamond" matrices={layout.halo} />
      <Gemstone cut="brilliant" kind="diamond" position={[c.x, c.y, c.z + 0.012]} rotation={[Math.PI / 2, 0, 0]} scale={0.078} />
      <GemGlints anchors={layout.glints} size={34} />
    </group>
  );
}
