"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { Suspense, useCallback, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { ShowcaseProduct } from "@/lib/constants/3dScenes";
import type { JewelKind, ModelManifest } from "@/lib/constants/models";
import { AnimatedStudioLighting, type LightingCue } from "./AnimatedStudioLighting";
import { CameraRig, type CameraPlan } from "./CameraRig";
import { JewelleryModel, ModelsProvider } from "./JewelleryModel";
import { MaterialsProvider } from "./materials";
import { qualityByTier, type RenderTier } from "./quality";
import { SoftShadow } from "./SoftShadow";
import { StudioProvider } from "./studio";

export interface ViewerInteraction {
  /** Accumulated drag rotation (radians); each piece eases towards it. */
  targetYaw: number;
  /** Normalised hover position over the viewer (mouse only). */
  pointer: { x: number; y: number };
}

const HIDDEN_POSITION = new THREE.Vector3(0, -0.2, -4);
const tmp = new THREE.Vector3();
const FOV = 30;

function PieceSlot({
  kind,
  product,
  detail,
  interaction,
}: {
  kind: JewelKind;
  product: ShowcaseProduct;
  detail: number;
  interaction: RefObject<ViewerInteraction>;
}) {
  const group = useRef<THREE.Group>(null);
  const time = useRef(kind.length * 1.7);
  const yaw = useRef(0);
  const placement = product.pieces.find((p) => p.kind === kind);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 20);
    time.current += dt;
    const k = 1 - Math.exp(-dt * 3);
    const i = interaction.current;
    yaw.current += (i.targetYaw - yaw.current) * Math.min(1, dt * 4);

    // Outgoing pieces retreat backwards and shrink; incoming ones emerge forward.
    if (placement) tmp.set(...placement.position);
    else tmp.copy(HIDDEN_POSITION);
    g.position.lerp(tmp, k);

    const [rx, ry, rz] = placement?.rotation ?? [0.3, 1.2, 0];
    const sway = placement ? 0.3 * Math.sin(time.current * 0.3) : 0;
    g.rotation.x += (rx - i.pointer.y * 0.06 - g.rotation.x) * k;
    g.rotation.y += (ry + sway + yaw.current + i.pointer.x * 0.1 - g.rotation.y) * k;
    g.rotation.z += (rz - g.rotation.z) * k;

    const s = THREE.MathUtils.lerp(g.scale.x, placement?.scale ?? 0, k);
    g.scale.setScalar(s);
    g.visible = s > 0.02;
  });

  return (
    <group ref={group} position={HIDDEN_POSITION} scale={0}>
      <JewelleryModel kind={kind} detail={detail} variant={placement?.variant} />
    </group>
  );
}

function Showcase({
  products,
  activeId,
  tier,
  interaction,
}: {
  products: ShowcaseProduct[];
  activeId: string;
  tier: RenderTier;
  interaction: RefObject<ViewerInteraction>;
}) {
  const quality = qualityByTier[tier];
  const product = products.find((p) => p.id === activeId) ?? products[0];
  const kinds = [...new Set(products.flatMap((p) => p.pieces.map((piece) => piece.kind)))];
  const clock = useRef(0);
  const sweepStart = useRef<{ id: string; at: number }>({ id: "", at: 0 });

  useFrame((_, delta) => {
    clock.current += Math.min(delta, 0.1);
  });

  const cameraPlan = useCallback<CameraPlan>(
    (position, target, state: RootState) => {
      const { view } = product;
      const aspect = state.size.width / Math.max(state.size.height, 1);
      const vHalf = THREE.MathUtils.degToRad(FOV / 2);
      const hHalf = Math.atan(Math.tan(vHalf) * aspect);
      const distance = (view.radius / Math.sin(Math.min(vHalf, hHalf))) * 1.04;
      target.set(...view.target);
      position.set(...view.direction).normalize().multiplyScalar(distance).add(target);
    },
    [product],
  );

  // A soft light passes across the piece every time the selection changes.
  const lightingCue = useCallback(
    (out: LightingCue) => {
      if (sweepStart.current.id !== product.id) sweepStart.current = { id: product.id, at: clock.current };
      const t = (clock.current - sweepStart.current.at) / 1.9;
      const idle = (clock.current % 11) / 11;
      if (t < 1) {
        out.sweepX = -6 + 12 * THREE.MathUtils.smootherstep(t, 0, 1);
        out.sweepStrength = 1;
      } else {
        out.sweepX = -6 + 12 * idle;
        out.sweepStrength = 0.35;
      }
      out.key = 1;
      out.env = 1.05;
    },
    [product],
  );

  const shadowY = product.view.target[1] - product.view.radius * 0.92;

  return (
    <>
      <AnimatedStudioLighting envResolution={quality.envResolution} cue={lightingCue} backdrop="none" />
      <CameraRig plan={cameraPlan} damping={2.6} />
      {kinds.map((kind) => (
        <PieceSlot key={kind} kind={kind} product={product} detail={quality.detail} interaction={interaction} />
      ))}
      {tier === "full" ? (
        <ContactShadows
          position={[0, shadowY, 0]}
          scale={product.view.radius * 4}
          blur={2.6}
          far={product.view.radius * 1.4}
          opacity={0.32}
          resolution={256}
          color="#3c2c18"
        />
      ) : (
        <SoftShadow position={[0, shadowY, 0]} scale={[product.view.radius * 2.6, product.view.radius * 0.9]} opacity={0.35} />
      )}
    </>
  );
}

export interface ModelViewerProps {
  products: ShowcaseProduct[];
  activeId: string;
  tier: RenderTier;
  models: ModelManifest;
  /** When false the render loop stops. */
  active: boolean;
  interaction: RefObject<ViewerInteraction>;
  onReady?: () => void;
}

function Ready({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady?.();
  });
  return null;
}

/** Lightweight, self-contained product scene for collection pages. */
export default function ModelViewer({ products, activeId, tier, models, active, interaction, onReady }: ModelViewerProps) {
  const quality = qualityByTier[tier];
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={quality.dpr}
      camera={{ fov: FOV, near: 0.05, far: 50, position: [0, 0.2, 6] }}
      gl={{ antialias: quality.antialias, alpha: true, stencil: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.setClearColor(0x000000, 0);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <StudioProvider>
        <ModelsProvider models={models}>
          <Suspense fallback={null}>
            <MaterialsProvider transmission={quality.transmission}>
              <Showcase products={products} activeId={activeId} tier={tier} interaction={interaction} />
            </MaterialsProvider>
            <Ready onReady={onReady} />
          </Suspense>
        </ModelsProvider>
      </StudioProvider>
    </Canvas>
  );
}
