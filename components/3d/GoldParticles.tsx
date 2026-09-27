"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { stageState } from "./stageState";
import { useSweepLight } from "./studio";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec4 uSweep;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // Slow upward drift, wrapped inside the volume; nearer motes react more to scroll.
    float rise = uTime * aSpeed * 0.06 + uScroll * (1.2 + aScale * 1.4);
    p.y = mod(p.y + rise + 4.0, 8.0) - 4.0;
    p.x += sin(uTime * 0.18 * aSpeed + aPhase) * 0.18;
    p.z += cos(uTime * 0.12 * aSpeed + aPhase) * 0.12;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (6.0 / -mv.z);
    // Dust only really shows where the studio light catches it.
    vec4 world = modelMatrix * vec4(p, 1.0);
    float dx = (world.x - uSweep.x) / 1.6;
    float lit = exp(-dx * dx) * uSweep.w;
    vAlpha = (0.22 + 0.4 * pow(abs(sin(uTime * 0.5 * aSpeed + aPhase)), 3.0)) * (0.55 + 0.9 * lit);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, glow * glow * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

/** Soft, sparse motes of gold light. Animated entirely on the GPU. */
export function GoldParticles({ count }: { count: number }) {
  const dpr = useThree((state) => state.viewport.dpr);
  const material = useRef<THREE.ShaderMaterial>(null);
  const sweep = useSweepLight();

  const geometry = useMemo(() => {
    // Seeded so the field is identical on every visit (and render stays pure).
    let seed = 0x9e3779b9;
    const random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 11;
      positions[i * 3 + 1] = (random() - 0.5) * 8;
      positions[i * 3 + 2] = -3.5 + random() * 5.5;
      scales[i] = 0.25 + Math.pow(random(), 5) * 0.9;
      speeds[i] = 0.4 + random() * 0.9;
      phases[i] = random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 11 },
      uSweep: { value: new THREE.Vector4() },
      uOpacity: { value: 0.5 },
      uColor: { value: new THREE.Color("#C2A165") },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(delta, 0.1);
    m.uniforms.uPixelRatio.value = dpr;
    m.uniforms.uSweep.value.copy(sweep);
    const target = stageState.mode === "story" ? stageState.progress : 0.4;
    m.uniforms.uScroll.value += (target - m.uniforms.uScroll.value) * Math.min(1, delta * 3);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
