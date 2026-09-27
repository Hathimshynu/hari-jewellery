"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSweepLight } from "./studio";

export interface LightingCue {
  /** World x of the soft light passing across the jewellery. */
  sweepX: number;
  /** 0–1: how strongly that light (and the gem glints) reads. */
  sweepStrength: number;
  /** Multiplier on the key light. */
  key: number;
  /** Multiplier on environment reflections. */
  env: number;
}

export type Backdrop = "ivory" | "champagne" | "none";

const backdrops: Record<Exclude<Backdrop, "none">, [string, string, string]> = {
  // Edges match the page background exactly so the canvas has no seam.
  ivory: ["#FFFEFA", "#FCFAF5", "#FAF8F3"],
  champagne: ["#FCF8F0", "#F6F0E4", "#EFE7D8"],
};

function StudioBackdrop({ tone }: { tone: Exclude<Backdrop, "none"> }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const [inner, mid, outer] = backdrops[tone];
      const g = ctx.createRadialGradient(256, 230, 10, 256, 256, 360);
      g.addColorStop(0, inner);
      g.addColorStop(0.45, mid);
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [tone]);

  useEffect(() => () => texture.dispose(), [texture]);

  return <primitive object={texture} attach="background" />;
}

interface AnimatedStudioLightingProps {
  envResolution: number;
  /** Fills in the lighting cue for this frame. */
  cue: (out: LightingCue, delta: number) => void;
  backdrop?: Backdrop;
}

/**
 * Jewellery studio: a dark room of warm softboxes for reflections (no HDR
 * download), key / rim / fill lights, and one soft light that sweeps across
 * the pieces on cue — the classic jewellery-commercial highlight pass.
 */
export function AnimatedStudioLighting({ envResolution, cue, backdrop = "ivory" }: AnimatedStudioLightingProps) {
  const sweepLight = useRef<THREE.PointLight>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const sweep = useSweepLight();
  const current = useRef<LightingCue>({ sweepX: -6, sweepStrength: 0, key: 1, env: 1 });

  useFrame((state, delta) => {
    const c = current.current;
    cue(c, delta);
    if (sweepLight.current) {
      sweepLight.current.position.x = c.sweepX;
      sweepLight.current.intensity = 9 * (0.35 + 0.65 * c.sweepStrength);
    }
    if (keyLight.current) keyLight.current.intensity = 2.2 * c.key;
    state.scene.environmentIntensity = c.env;
    sweep.set(c.sweepX, 0.8, 2.6, c.sweepStrength);
  });

  return (
    <>
      {backdrop !== "none" ? <StudioBackdrop tone={backdrop} /> : null}
      <Environment resolution={envResolution} frames={1}>
        {/* A bright, warm studio (as on a white sweep) with two dark cards for crisp reflection lines. */}
        <color attach="background" args={["#8c7e69"]} />
        <Lightformer form="rect" intensity={1} color="#2a2118" position={[-5, 0.5, 3.5]} scale={[0.5, 6, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#FFF3DE" position={[0, 6, 1]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#FFE7C4" position={[-6, 1.2, 2]} scale={[1.4, 7, 1]} />
        {/* Cool-neutral rim softbox balances the warm key. */}
        <Lightformer form="rect" intensity={2.4} color="#F4F6FA" position={[6, 0.4, 1]} scale={[1.4, 7, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#FFFFFF" position={[0, 1.5, -7]} scale={4} />
        <Lightformer form="rect" intensity={0.9} color="#F1D9AC" position={[0, -5, 2]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#FFF9F0" position={[-2.6, 1.4, 6.5]} scale={[1.2, 3.5, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#FFEFD6" position={[2.8, -0.6, 6.5]} scale={[0.8, 3, 1]} />
        <Lightformer form="circle" intensity={2.4} color="#FFFFFF" position={[0.8, 3, 5]} scale={1.2} />
      </Environment>

      <ambientLight intensity={0.25} color="#FFF4E6" />
      <directionalLight ref={keyLight} position={[3, 5, 4]} intensity={2.2} color="#FFF1DC" />
      <directionalLight position={[-4, 2.5, -5]} intensity={1.7} color="#EEF1F6" />
      <directionalLight position={[-3, -1, 4]} intensity={0.6} color="#FFF8EF" />
      <pointLight ref={sweepLight} position={[-6, 0.8, 2.6]} intensity={3} distance={9} decay={1.6} color="#FFF8EC" />
    </>
  );
}
