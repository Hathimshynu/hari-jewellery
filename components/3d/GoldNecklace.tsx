"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Gemstone } from "./Gemstone";
import { GemGlints } from "./GemGlints";
import { composeMatrix, createBrilliantCut, createCabochon, createMedallion, createPetal, segments, useDisposable } from "./geometry";
import { InstancedParts } from "./InstancedParts";
import { useGold, useJewelleryMaterials, type GoldVariant } from "./materials";

const UP = new THREE.Vector3(0, 1, 0);
const FRONT = new THREE.Vector3(0, 0, 1);

/** Loop radius (x), depth (z) and how far the front of the necklace drops below the back. */
const RX = 1.25;
const RZ = 0.92;
const DROP = 0.95;

function necklacePoint(theta: number) {
  const hang = Math.pow((1 + Math.cos(theta)) / 2, 2.2);
  return new THREE.Vector3(RX * Math.sin(theta), -DROP * hang, RZ * Math.cos(theta));
}

interface NecklaceLayout {
  goldSpheres: THREE.Matrix4[];
  spacers: THREE.Matrix4[];
  medallions: THREE.Matrix4[];
  cabochons: THREE.Matrix4[];
  petals: THREE.Matrix4[];
  pearls: THREE.Matrix4[];
  diamonds: THREE.Matrix4[];
  pendantCenter: THREE.Vector3;
}

function buildNecklaceLayout(): NecklaceLayout {
  const span = Math.PI * 0.94;
  const samples = Array.from({ length: 97 }, (_, i) => necklacePoint(-span + (2 * span * i) / 96));
  const curve = new THREE.CatmullRomCurve3(samples, false, "centripetal");

  const layout: NecklaceLayout = {
    goldSpheres: [],
    spacers: [],
    medallions: [],
    cabochons: [],
    petals: [],
    pearls: [],
    diamonds: [],
    pendantCenter: new THREE.Vector3(),
  };

  // Beaded chain: large bead, small bead, spacer ring, small bead…
  const beadCount = 152;
  for (let i = 0; i < beadCount; i++) {
    const u = i / (beadCount - 1);
    const p = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);
    const step = i % 4;
    if (step === 2) {
      const q = new THREE.Quaternion().setFromUnitVectors(FRONT, tangent);
      layout.spacers.push(composeMatrix(p, { quaternion: q, scale: 0.021 }));
    } else {
      layout.goldSpheres.push(composeMatrix(p, { scale: step === 0 ? 0.03 : 0.017 }));
    }
  }

  const tmp = new THREE.Vector3();
  const addPetalRing = (
    center: THREE.Vector3,
    orientation: THREE.Quaternion,
    count: number,
    baseRadius: number,
    length: number,
    lift: number,
    angleOffset = 0,
    tilt = 0,
  ) => {
    const normal = FRONT.clone().applyQuaternion(orientation);
    for (let k = 0; k < count; k++) {
      const a = angleOffset + (k / count) * Math.PI * 2;
      const local = new THREE.Quaternion().setFromAxisAngle(FRONT, a - Math.PI / 2);
      // Tilt the tip backwards so rings of petals open like a lotus.
      local.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -tilt));
      const q = orientation.clone().multiply(local);
      const radial = tmp.set(Math.cos(a), Math.sin(a), 0).applyQuaternion(orientation).multiplyScalar(baseRadius);
      const pos = center.clone().add(radial).addScaledVector(normal, lift);
      layout.petals.push(composeMatrix(pos, { quaternion: q, scale: length }));
    }
  };

  // Graduated temple medallions either side of the pendant, each with a ruby and a pearl drop.
  for (let side = -1; side <= 1; side += 2) {
    for (let k = 1; k <= 6; k++) {
      const u = 0.5 + side * k * 0.034;
      const r = 0.1 - (k - 1) * 0.009;
      const p = curve.getPointAt(u);
      const normal = new THREE.Vector3(p.x / (RX * RX), 0, p.z / (RZ * RZ)).normalize();
      const center = p.clone().add(new THREE.Vector3(0, -r - 0.012, 0)).addScaledVector(normal, 0.02);
      const orientation = new THREE.Quaternion().setFromUnitVectors(FRONT, normal);

      layout.medallions.push(composeMatrix(center, { quaternion: orientation, scale: r }));
      layout.cabochons.push(
        composeMatrix(center.clone().addScaledVector(normal, 0.15 * r), {
          quaternion: new THREE.Quaternion().setFromUnitVectors(UP, normal),
          scale: 0.4 * r,
        }),
      );
      addPetalRing(center, orientation, 8, 0.42 * r, 0.42 * r, 0.1 * r, Math.PI / 8);

      const dropTop = center.clone().add(new THREE.Vector3(0, -r - 0.02, 0));
      layout.goldSpheres.push(composeMatrix(dropTop, { scale: 0.016 }));
      layout.pearls.push(composeMatrix(dropTop.clone().add(new THREE.Vector3(0, -0.045, 0)), { scale: 0.032 - k * 0.0018 }));
    }
  }

  // Central lotus pendant.
  const top = curve.getPointAt(0.5);
  const center = top.clone().add(new THREE.Vector3(0, -0.3, 0.03));
  layout.pendantCenter.copy(center);
  const faceFront = new THREE.Quaternion();

  addPetalRing(center.clone().add(new THREE.Vector3(0, 0, -0.01)), faceFront, 16, 0.18, 0.15, 0, 0, 0.12);
  addPetalRing(center.clone().add(new THREE.Vector3(0, 0, -0.03)), faceFront, 16, 0.19, 0.12, 0, Math.PI / 16, 0.32);

  for (let k = 0; k < 44; k++) {
    const a = (k / 44) * Math.PI * 2;
    layout.goldSpheres.push(
      composeMatrix(center.clone().add(new THREE.Vector3(Math.cos(a) * 0.207, Math.sin(a) * 0.207, 0.022)), { scale: 0.011 }),
    );
  }

  const gemUp = new THREE.Quaternion().setFromUnitVectors(UP, FRONT);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + Math.PI / 10;
    layout.diamonds.push(
      composeMatrix(center.clone().add(new THREE.Vector3(Math.cos(a) * 0.145, Math.sin(a) * 0.145, 0.034)), {
        quaternion: gemUp,
        scale: 0.024,
      }),
    );
  }

  // Pearl fringe beneath the pendant, leaving room for the emerald drop.
  for (const deg of [-62, -44, -26, 26, 44, 62]) {
    const a = ((270 + deg) * Math.PI) / 180;
    const anchor = center.clone().add(new THREE.Vector3(Math.cos(a) * 0.315, Math.sin(a) * 0.315, 0.005));
    layout.goldSpheres.push(composeMatrix(anchor, { scale: 0.012 }));
    layout.pearls.push(composeMatrix(anchor.clone().add(new THREE.Vector3(0, -0.04, 0)), { scale: 0.027 }));
  }

  return layout;
}

export function GoldNecklace({ detail = 1, variant = "yellow" }: { detail?: number; variant?: GoldVariant }) {
  const materials = useJewelleryMaterials();
  const gold = useGold(variant);

  const sphere = useDisposable(useMemo(() => new THREE.SphereGeometry(1, segments(18, detail), segments(14, detail)), [detail]));
  const spacer = useDisposable(useMemo(() => new THREE.TorusGeometry(1, 0.38, segments(8, detail), segments(18, detail)), [detail]));
  const medallion = useDisposable(useMemo(() => createMedallion(segments(40, detail)), [detail]));
  const petal = useDisposable(useMemo(() => createPetal(), []));
  const cabochon = useDisposable(useMemo(() => createCabochon(segments(20, detail)), [detail]));
  const brilliant = useDisposable(useMemo(() => createBrilliantCut(16), []));
  const bezel = useDisposable(useMemo(() => new THREE.TorusGeometry(1, 0.13, 12, 48), []));

  const layout = useMemo(() => buildNecklaceLayout(), []);
  const c = layout.pendantCenter;
  const glints = useMemo(() => {
    const lift = new THREE.Vector3(0, 0, 0.03);
    const points = layout.diamonds.map((m) => new THREE.Vector3().setFromMatrixPosition(m).add(lift));
    points.push(layout.pendantCenter.clone().add(new THREE.Vector3(0, 0, 0.09)));
    layout.cabochons.forEach((m, i) => {
      if (i % 3 === 0) points.push(new THREE.Vector3().setFromMatrixPosition(m).add(lift));
    });
    return points;
  }, [layout]);

  return (
    // Offset so the visual centre of the necklace sits at the group origin.
    <group position={[0, 0.8, 0]}>
      <InstancedParts geometry={sphere} material={gold.polished} matrices={layout.goldSpheres} />
      <InstancedParts geometry={spacer} material={gold.polished} matrices={layout.spacers} />
      <InstancedParts geometry={medallion} material={gold.satin} matrices={layout.medallions} />
      <InstancedParts geometry={cabochon} material={materials.ruby} matrices={layout.cabochons} />
      <InstancedParts geometry={petal} material={gold.polished} matrices={layout.petals} />
      <InstancedParts geometry={sphere} material={materials.pearl} matrices={layout.pearls} />
      <InstancedParts geometry={brilliant} material="diamond" matrices={layout.diamonds} />

      {/* Pendant body */}
      <mesh geometry={medallion} material={gold.satin} position={c} scale={0.21} />
      <mesh geometry={bezel} material={gold.polished} position={[c.x, c.y, c.z + 0.036]} scale={0.092} />
      <Gemstone cut="brilliant" kind="ruby" position={[c.x, c.y, c.z + 0.045]} rotation={[Math.PI / 2, 0, 0]} scale={0.085} />
      <mesh
        geometry={bezel}
        material={gold.polished}
        position={[c.x, c.y + 0.3, c.z - 0.02]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.035, 0.035, 0.05]}
      />
      <mesh geometry={sphere} material={gold.polished} position={[c.x, c.y - 0.335, c.z + 0.01]} scale={0.022} />
      <Gemstone cut="pear" kind="emerald" position={[c.x, c.y - 0.47, c.z + 0.01]} scale={[0.07, 0.11, 0.05]} />
      <GemGlints anchors={glints} />
    </group>
  );
}
