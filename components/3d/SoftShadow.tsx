"use client";

import { useEffect, useMemo, type Ref } from "react";
import * as THREE from "three";

/**
 * A soft, warm contact shadow for floating jewellery: a single transparent
 * plane with a radial falloff — no extra render pass, so it is cheap on
 * every device. Opacity is animated by the owner through the material ref.
 */
export function SoftShadow({
  position,
  scale = [3, 1.2],
  materialRef,
  opacity = 0,
}: {
  position: [number, number, number];
  scale?: [number, number];
  materialRef?: Ref<THREE.MeshBasicMaterial>;
  opacity?: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
      g.addColorStop(0, "rgba(60, 44, 24, 0.55)");
      g.addColorStop(0.45, "rgba(60, 44, 24, 0.22)");
      g.addColorStop(1, "rgba(60, 44, 24, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale[0], scale[1], 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent depthWrite={false} opacity={opacity} toneMapped={false} />
    </mesh>
  );
}
