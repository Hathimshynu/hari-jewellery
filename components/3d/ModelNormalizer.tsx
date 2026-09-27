"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Wraps an object so its bounding box is centred on the origin and its largest
 * side equals `size`. Models from different Blender artists (any unit scale,
 * any origin) therefore drop into the choreography without code changes.
 */
export function normalizeObject(object: THREE.Object3D, size: number): THREE.Group {
  const box = new THREE.Box3().setFromObject(object);
  const dims = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
  const wrapper = new THREE.Group();
  wrapper.name = "normalized-model";
  wrapper.add(object);
  wrapper.scale.setScalar(size / Math.max(dims.x, dims.y, dims.z, 1e-6));
  return wrapper;
}

export function ModelNormalizer({ object, size }: { object: THREE.Object3D; size: number }) {
  const normalized = useMemo(() => normalizeObject(object, size), [object, size]);
  return <primitive object={normalized} />;
}
