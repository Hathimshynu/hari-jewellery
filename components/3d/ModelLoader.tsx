"use client";

import { useGLTF } from "@react-three/drei";
import { Component, Suspense, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { useGold, type GoldVariant } from "./materials";
import { ModelNormalizer } from "./ModelNormalizer";

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[ModelLoader] Model failed to load; showing the procedural piece instead.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface LoadedModelProps {
  url: string;
  size: number;
  /** When set, meshes whose material name contains "gold" use the site's gold of this alloy. */
  goldVariant?: GoldVariant;
}

function LoadedModel({ url, size, goldVariant }: LoadedModelProps) {
  // Draco decoder is self-hosted; Meshopt is supported by default.
  const { scene } = useGLTF(url, "/draco/");
  const gold = useGold(goldVariant ?? "yellow");

  const object = useMemo(() => {
    const clone = scene.clone(true);
    if (goldVariant) {
      clone.traverse((node) => {
        const mesh = node as THREE.Mesh;
        if (!mesh.isMesh) return;
        const material = mesh.material as THREE.Material;
        const name = material?.name?.toLowerCase() ?? "";
        if (name.includes("gold")) mesh.material = name.includes("satin") || name.includes("matte") ? gold.satin : gold.polished;
      });
    }
    return clone;
  }, [scene, goldVariant, gold]);

  return <ModelNormalizer object={object} size={size} />;
}

interface ModelLoaderProps extends LoadedModelProps {
  /** Shown while loading and if the file is missing or invalid. */
  fallback: ReactNode;
}

/** Loads a .glb safely: never throws, never blanks the scene. */
export function ModelLoader({ fallback, ...props }: ModelLoaderProps) {
  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <LoadedModel {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
