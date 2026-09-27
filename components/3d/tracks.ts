import type { Vector3 } from "three";

export type Vec3 = readonly [number, number, number];

export interface Key<T> {
  at: number;
  value: T;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Finds the surrounding keys for `p` and the eased blend factor between them. */
function locate<T>(keys: readonly Key<T>[], p: number): [Key<T>, Key<T>, number] {
  if (p <= keys[0].at) return [keys[0], keys[0], 0];
  const last = keys[keys.length - 1];
  if (p >= last.at) return [last, last, 0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p >= a.at && p <= b.at) {
      const span = b.at - a.at;
      return [a, b, span === 0 ? 1 : easeInOut((p - a.at) / span)];
    }
  }
  return [last, last, 0];
}

export function sampleNumber(keys: readonly Key<number>[], p: number): number {
  const [a, b, t] = locate(keys, p);
  return a.value + (b.value - a.value) * t;
}

export function sampleVec3(keys: readonly Key<Vec3>[], p: number, out: Vector3): Vector3 {
  const [a, b, t] = locate(keys, p);
  return out.set(
    a.value[0] + (b.value[0] - a.value[0]) * t,
    a.value[1] + (b.value[1] - a.value[1]) * t,
    a.value[2] + (b.value[2] - a.value[2]) * t,
  );
}
