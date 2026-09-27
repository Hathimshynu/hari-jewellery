"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { composeMatrix, createBellShell, createCabochon, createPetal, useDisposable } from "./geometry";
import { GemGlints } from "./GemGlints";
import { InstancedParts } from "./InstancedParts";
import { useGold, useJewelleryMaterials, type GoldVariant } from "./materials";

const UP = new THREE.Vector3(0, 1, 0);
const FRONT = new THREE.Vector3(0, 0, 1);

const BELL_SCALE = 0.3;
const BELL_BASE_Y = -0.62;

function buildJhumkaLayout(offsetX: number) {
  const o = new THREE.Vector3(offsetX, 0, 0);
  const at = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).add(o);

  const gold: THREE.Matrix4[] = [];
  const pearls: THREE.Matrix4[] = [];
  const rubies: THREE.Matrix4[] = [];
  const petals: THREE.Matrix4[] = [];

  // Floral stud
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const q = new THREE.Quaternion().setFromAxisAngle(FRONT, a - Math.PI / 2);
    petals.push(composeMatrix(at(Math.cos(a) * 0.045, Math.sin(a) * 0.045, 0), { quaternion: q, scale: 0.09 }));
  }
  rubies.push(
    composeMatrix(at(0, 0, 0.02), { quaternion: new THREE.Quaternion().setFromUnitVectors(UP, FRONT), scale: 0.045 }),
  );

  // Link down to the bell
  gold.push(composeMatrix(at(0, -0.15, 0), { scale: 0.022 }));
  gold.push(composeMatrix(at(0, -0.2, 0), { scale: 0.028 }));
  gold.push(composeMatrix(at(0, -0.255, 0), { scale: 0.02 }));

  // Decorative rows on the bell
  const bellPoint = (y: number, radius: number, a: number) =>
    at(Math.cos(a) * radius * BELL_SCALE, BELL_BASE_Y + y * BELL_SCALE, Math.sin(a) * radius * BELL_SCALE);

  // Granulation rows and a milgrain rim, as on hand-made temple jhumkas.
  const rows: [number, number, number, number][] = [
    [0.03, 1.07, 36, 0.011],
    [0.18, 0.98, 30, 0.012],
    [0.32, 0.95, 28, 0.013],
    [0.46, 0.88, 26, 0.011],
    [0.76, 0.62, 18, 0.01],
    [0.9, 0.42, 12, 0.009],
  ];
  for (const [y, radius, count, size] of rows) {
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + (y * 7) % 1;
      gold.push(composeMatrix(bellPoint(y, radius, a), { scale: size }));
    }
  }
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2;
    const normal = new THREE.Vector3(Math.cos(a), 0.55, Math.sin(a)).normalize();
    rubies.push(
      composeMatrix(bellPoint(0.6, 0.8, a), { quaternion: new THREE.Quaternion().setFromUnitVectors(UP, normal), scale: 0.016 }),
    );
  }

  // Pearl fringe around the rim
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2;
    const rim = bellPoint(-0.06, 1.03, a);
    gold.push(composeMatrix(rim, { scale: 0.008 }));
    pearls.push(composeMatrix(rim.clone().add(new THREE.Vector3(0, -0.03, 0)), { scale: 0.016 }));
  }

  // Clapper pearl
  pearls.push(composeMatrix(at(0, BELL_BASE_Y - 0.02, 0), { scale: 0.05 }));

  return { gold, pearls, rubies, petals, bellPosition: at(0, BELL_BASE_Y, 0) };
}

/** A pair of temple jhumkas, hanging from their studs at the group origin. */
export function JhumkaEarrings({ spacing = 0.34, variant = "yellow" }: { spacing?: number; variant?: GoldVariant }) {
  const materials = useJewelleryMaterials();
  const gold = useGold(variant);
  const bell = useDisposable(useMemo(() => createBellShell(48), []));
  const bead = useDisposable(useMemo(() => new THREE.SphereGeometry(1, 14, 10), []));
  const cabochon = useDisposable(useMemo(() => createCabochon(16), []));
  const petal = useDisposable(useMemo(() => createPetal(), []));

  const layout = useMemo(() => {
    const left = buildJhumkaLayout(-spacing);
    const right = buildJhumkaLayout(spacing);
    return {
      gold: [...left.gold, ...right.gold],
      pearls: [...left.pearls, ...right.pearls],
      rubies: [...left.rubies, ...right.rubies],
      petals: [...left.petals, ...right.petals],
      bells: [left.bellPosition, right.bellPosition],
      glints: [new THREE.Vector3(-spacing, 0, 0.06), new THREE.Vector3(spacing, 0, 0.06)],
    };
  }, [spacing]);

  return (
    <group position={[0, 0.3, 0]}>
      {layout.bells.map((p, i) => (
        <mesh key={i} geometry={bell} material={gold.satin} position={p} scale={BELL_SCALE} />
      ))}
      <InstancedParts geometry={bead} material={gold.polished} matrices={layout.gold} />
      <InstancedParts geometry={bead} material={materials.pearl} matrices={layout.pearls} />
      <InstancedParts geometry={cabochon} material={materials.ruby} matrices={layout.rubies} />
      <InstancedParts geometry={petal} material={gold.polished} matrices={layout.petals} />
      <GemGlints anchors={layout.glints} size={30} />
    </group>
  );
}
