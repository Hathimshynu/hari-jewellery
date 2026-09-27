"use client";

import { useSyncExternalStore } from "react";
import { detectDeviceCapability, type DeviceCapability } from "@/lib/utils/deviceCapability";

let snapshot: DeviceCapability | null = null;

function subscribe(onChange: () => void) {
  const queries = ["(prefers-reduced-motion: reduce)", "(pointer: coarse)"].map((q) => window.matchMedia(q));
  const update = () => {
    snapshot = detectDeviceCapability();
    onChange();
  };
  queries.forEach((q) => q.addEventListener("change", update));
  window.addEventListener("resize", update);
  return () => {
    queries.forEach((q) => q.removeEventListener("change", update));
    window.removeEventListener("resize", update);
  };
}

function getSnapshot() {
  snapshot ??= detectDeviceCapability();
  return snapshot;
}

/** The device's experience tier and signals; `null` during server render. */
export function useDeviceCapability(): DeviceCapability | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
