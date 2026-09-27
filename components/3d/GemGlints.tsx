"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSweepLight } from "./studio";

const vertexShader = /* glsl */ `
  uniform vec4 uSweep;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aPhase;
  varying float vIntensity;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    // The glint blooms only while the sweep light passes the stone...
    float dx = (world.x - uSweep.x) / 0.55;
    float sweep = exp(-dx * dx) * uSweep.w;
    // ...plus a rare, very short natural twinkle.
    float twinkle = pow(max(0.0, sin(uTime * 0.7 + aPhase * 6.2831)), 60.0) * 0.55;
    vIntensity = clamp(sweep + twinkle, 0.0, 1.0);

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * vIntensity * (6.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vIntensity;

  void main() {
    vec2 s = gl_PointCoord - 0.5;
    // Four-point star: two thin streaks and a soft core — a camera-like specular glint.
    float streakA = exp(-abs(s.x) * 46.0) * exp(-abs(s.y) * 7.0);
    float streakB = exp(-abs(s.y) * 46.0) * exp(-abs(s.x) * 7.0);
    float core = exp(-dot(s, s) * 90.0);
    float a = (max(streakA, streakB) * 0.8 + core) * vIntensity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * a, a);
    #include <colorspace_fragment>
  }
`;

interface GemGlintsProps {
  /** Glint anchors in the parent piece's local space (just in front of each stone). */
  anchors: THREE.Vector3[];
  /** Base glint size in pixels at a reference distance. */
  size?: number;
}

/** Controlled specular sparkle on gemstones, driven by the studio's sweep light. */
export function GemGlints({ anchors, size = 38 }: GemGlintsProps) {
  const sweep = useSweepLight();
  const dpr = useThree((s) => s.viewport.dpr);
  const material = useRef<THREE.ShaderMaterial>(null);
  const time = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(anchors);
    const phases = new Float32Array(anchors.length);
    for (let i = 0; i < anchors.length; i++) phases[i] = (i * 0.618034) % 1;
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [anchors]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uSweep: { value: new THREE.Vector4() },
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
    }),
    [size],
  );

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    time.current += Math.min(delta, 0.1);
    m.uniforms.uSweep.value.copy(sweep);
    m.uniforms.uTime.value = time.current;
    m.uniforms.uPixelRatio.value = dpr;
  });

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={10}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
