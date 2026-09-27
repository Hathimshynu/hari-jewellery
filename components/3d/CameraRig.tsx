"use client";

import { useFrame, useThree, type RootState } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/** Writes the desired camera position and look-at target for this frame. */
export type CameraPlan = (position: THREE.Vector3, target: THREE.Vector3, state: RootState) => void;

interface CameraRigProps {
  plan: CameraPlan;
  /** Higher = snappier. ~3–4 feels heavy and cinematic. */
  damping?: number;
  /** Normalised mouse position (-1..1); vertical movement nudges the camera. */
  pointer?: { x: number; y: number } | null;
  pointerAmount?: number;
  /** Return true to jump straight to the plan (hidden canvas, still renders). */
  shouldSnap?: () => boolean;
}

const goalPosition = new THREE.Vector3();
const goalTarget = new THREE.Vector3();

/**
 * Scroll (or state) → target camera → damped interpolation → camera.
 * Position and look-at target are smoothed independently, so moves read as a
 * physical camera on a dolly rather than a jump.
 */
export function CameraRig({ plan, damping = 3.4, pointer = null, pointerAmount = 0.1, shouldSnap }: CameraRigProps) {
  const camera = useThree((s) => s.camera);
  const look = useRef<THREE.Vector3 | null>(null);

  useFrame((state, delta) => {
    plan(goalPosition, goalTarget, state);
    if (pointer) goalPosition.y += pointer.y * pointerAmount;

    const snap = shouldSnap?.() ?? false;
    if (!look.current) look.current = goalTarget.clone();
    const k = snap ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 20) * damping);
    camera.position.lerp(goalPosition, k);
    look.current.lerp(goalTarget, k);
    camera.lookAt(look.current);
  });

  return null;
}
