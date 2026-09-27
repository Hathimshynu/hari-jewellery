"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { AnimatedStudioLighting, type LightingCue } from "./AnimatedStudioLighting";
import { CameraRig, type CameraPlan } from "./CameraRig";
import {
  finaleLighting,
  finaleNarrow,
  finaleWide,
  storyKinds,
  storyLighting,
  storyNarrow,
  storyWide,
  type Choreography,
  type StoryKind,
} from "./choreography";
import { JewelleryModel } from "./JewelleryModel";
import { SoftShadow } from "./SoftShadow";
import { stageState } from "./stageState";
import { sampleNumber, sampleVec3, type Key } from "./tracks";

/** How much the necklace sways while idle; calmer during the macro close-up. */
const necklaceSway: Key<number>[] = [
  { at: 0, value: 1 },
  { at: 0.26, value: 0.2 },
  { at: 0.44, value: 0.2 },
  { at: 0.52, value: 1 },
];

const idle: Record<StoryKind, (t: number, p: number) => [number, number, number]> = {
  necklace: (t, p) => [0.03 * Math.sin(t * 0.5), 0.42 * Math.sin(t * 0.28) * sampleNumber(necklaceSway, p), 0],
  // The ring turns like a product on a turntable.
  ring: (t) => [0, t * 0.45, 0],
  earrings: (t) => [0, 0.35 * Math.sin(t * 0.4), 0.03 * Math.sin(t * 0.9)],
  bangle: (t) => [0, 0.5 * Math.sin(t * 0.25), 0],
};

const tmpPosition = new THREE.Vector3();
const tmpRotation = new THREE.Vector3();

/** Mouse → at most ~6° of rotation, and only for mice (never touch). */
const POINTER_YAW = 0.1;
const POINTER_PITCH = 0.05;

function layoutFor(state: { size: { width: number; height: number } }) {
  const aspect = state.size.width / Math.max(state.size.height, 1);
  const narrow = aspect < 0.85;
  const finale = stageState.mode === "finale";
  const plan: Choreography = finale ? (narrow ? finaleNarrow : finaleWide) : narrow ? storyNarrow : storyWide;
  return {
    plan,
    p: finale ? 0 : stageState.progress,
    xScale: narrow ? 1 : THREE.MathUtils.clamp(aspect / 1.7, 0.6, 1.05),
    // Shorter phones (e.g. 320×568, 375×667) have less room for type below the
    // jewellery: pull the camera back and frame the pieces higher. Mirrored for
    // the poster in globals.css (.story__poster on short portrait screens).
    short: narrow && aspect > 0.5,
    lighting: finale ? finaleLighting : storyLighting,
  };
}

/** Camera pull-back and lift applied on short portrait screens. */
export const SHORT_SCREEN = { distance: 1.12, lift: 0.25 };

export interface StoryRigProps {
  detail: number;
  envResolution: number;
  /** Freeze time-based motion (used for still renders and image sequences). */
  still?: boolean;
}

export function StoryRig({ detail, envResolution, still = false }: StoryRigProps) {
  const necklace = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const earrings = useRef<THREE.Group>(null);
  const bangle = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.MeshBasicMaterial>(null);
  const elapsed = useRef(0);

  const cameraPlan = useCallback<CameraPlan>((position, target, state) => {
    const { plan, p, xScale, short } = layoutFor(state);
    sampleVec3(plan.camera.position, p, position);
    sampleVec3(plan.camera.target, p, target);
    position.x *= xScale;
    target.x *= xScale;
    if (short) {
      position.sub(target).multiplyScalar(SHORT_SCREEN.distance).add(target);
      position.y -= SHORT_SCREEN.lift;
      target.y -= SHORT_SCREEN.lift;
    }
  }, []);

  const lightingCue = useCallback((out: LightingCue) => {
    const { lighting, p } = layoutFor({ size: { width: 16, height: 9 } });
    out.sweepX = sampleNumber(lighting.sweepX, p);
    out.sweepStrength = sampleNumber(lighting.sweepStrength, p);
    out.key = sampleNumber(lighting.key, p);
    out.env = sampleNumber(lighting.env, p);
  }, []);

  const snap = useCallback(() => stageState.snap || still, [still]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    if (!still) elapsed.current += dt;
    const t = elapsed.current;
    const { plan, p, xScale } = layoutFor(state);
    const k = stageState.snap || still ? 1 : 1 - Math.exp(-dt * 3.4);
    const pointer = still ? { x: 0, y: 0 } : stageState.pointer;

    const groups: Record<StoryKind, THREE.Group | null> = {
      necklace: necklace.current,
      ring: ring.current,
      earrings: earrings.current,
      bangle: bangle.current,
    };
    storyKinds.forEach((kind, index) => {
      const group = groups[kind];
      if (!group) return;
      const track = plan.pieces[kind];
      sampleVec3(track.position, p, tmpPosition);
      tmpPosition.x *= xScale;
      if (!still) tmpPosition.y += 0.025 * Math.sin(t * 0.6 + index);
      sampleVec3(track.rotation, p, tmpRotation);
      const [ix, iy, iz] = idle[kind](t, p);
      const scale = sampleNumber(track.scale, p);

      group.position.lerp(tmpPosition, k);
      group.rotation.x += (tmpRotation.x + ix - pointer.y * POINTER_PITCH - group.rotation.x) * k;
      group.rotation.y += (tmpRotation.y + iy + pointer.x * POINTER_YAW - group.rotation.y) * k;
      group.rotation.z += (tmpRotation.z + iz - group.rotation.z) * k;
      const s = THREE.MathUtils.lerp(group.scale.x, scale, k);
      group.scale.setScalar(s);
      group.visible = s > 0.02;
    });

    if (shadow.current) shadow.current.opacity = sampleNumber(plan.shadow, p);
    stageState.snap = false;
  });

  return (
    <>
      <AnimatedStudioLighting envResolution={envResolution} cue={lightingCue} />
      <CameraRig plan={cameraPlan} pointer={still ? null : stageState.pointer} pointerAmount={0.08} shouldSnap={snap} />
      <group ref={necklace} scale={0}>
        <JewelleryModel kind="necklace" detail={detail} />
      </group>
      <group ref={ring} scale={0}>
        <JewelleryModel kind="ring" detail={detail} />
      </group>
      <group ref={earrings} scale={0}>
        <JewelleryModel kind="earrings" detail={detail} />
      </group>
      <group ref={bangle} scale={0}>
        <JewelleryModel kind="bangle" detail={detail} />
      </group>
      <SoftShadow position={[0, -1.5, 0]} scale={[5.5, 1.6]} materialRef={shadow} />
    </>
  );
}
