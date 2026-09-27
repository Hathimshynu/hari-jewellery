"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import * as THREE from "three";

/**
 * Per-canvas studio state shared between the animated lighting and the
 * gemstone glints: xyz = world position of the moving sweep light,
 * w = its current strength (0–1).
 */
const StudioContext = createContext<THREE.Vector4 | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const sweep = useMemo(() => new THREE.Vector4(-6, 0.8, 2.6, 0), []);
  return <StudioContext.Provider value={sweep}>{children}</StudioContext.Provider>;
}

export function useSweepLight(): THREE.Vector4 {
  const sweep = useContext(StudioContext);
  if (!sweep) throw new Error("useSweepLight must be used inside <StudioProvider>");
  return sweep;
}
