"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import type { ModelManifest } from "@/lib/constants/models";
import { GoldParticles } from "./GoldParticles";
import { ModelsProvider } from "./JewelleryModel";
import { MaterialsProvider } from "./materials";
import { qualityByTier, type RenderTier } from "./quality";
import { StoryRig } from "./StoryRig";
import { StudioProvider } from "./studio";

function FirstFrames({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady?.();
  });
  return null;
}

export interface JewellerySceneProps {
  tier: RenderTier;
  models: ModelManifest;
  /** When false the render loop stops entirely. */
  active: boolean;
  onReady?: () => void;
  /** Called if the device cannot sustain a usable frame rate even at minimum resolution. */
  onPerformanceFallback?: () => void;
  /** Deterministic still frame (for poster renders and image sequences). */
  still?: boolean;
  preserveDrawingBuffer?: boolean;
}

/** The homepage film's canvas: studio, four pieces, dust, camera — all driven by scroll. */
export default function JewelleryScene({
  tier,
  models,
  active,
  onReady,
  onPerformanceFallback,
  still = false,
  preserveDrawingBuffer = false,
}: JewellerySceneProps) {
  const quality = qualityByTier[tier];
  const [maxDpr, setMaxDpr] = useState(quality.dpr[1]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[quality.dpr[0], maxDpr]}
      camera={{ fov: 30, near: 0.1, far: 60, position: [0, 0.15, 6.4] }}
      gl={{
        antialias: quality.antialias,
        alpha: false,
        stencil: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      {!still && (
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setMaxDpr((current) => Math.max(quality.dpr[0], current - 0.25))}
          onFallback={() => onPerformanceFallback?.()}
        />
      )}
      <StudioProvider>
        <ModelsProvider models={models}>
          <Suspense fallback={null}>
            <MaterialsProvider transmission={quality.transmission}>
              <StoryRig detail={quality.detail} envResolution={quality.envResolution} still={still} />
            </MaterialsProvider>
            {!still && <GoldParticles count={quality.particles} />}
            <FirstFrames onReady={onReady} />
          </Suspense>
        </ModelsProvider>
      </StudioProvider>
    </Canvas>
  );
}
