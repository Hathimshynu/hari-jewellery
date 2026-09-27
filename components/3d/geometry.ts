import { useEffect } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Disposes a GPU resource when it is replaced or the component unmounts. */
export function useDisposable<T extends { dispose(): void }>(resource: T): T {
  useEffect(() => () => resource.dispose(), [resource]);
  return resource;
}

/** Scales a segment count by the device's detail level. */
export const segments = (n: number, detail: number) => Math.max(6, Math.round(n * detail));

const lathe = (profile: [number, number][], segments: number) =>
  new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );

/** Round brilliant cut, girdle radius 1, table facing +Y. Faceting comes from flat shading. */
export function createBrilliantCut(segments = 16): THREE.LatheGeometry {
  return lathe(
    [
      [0.0001, -0.86],
      [0.46, -0.44],
      [1, -0.03],
      [1, 0.03],
      [0.8, 0.19],
      [0.56, 0.32],
      [0.0001, 0.32],
    ],
    segments,
  );
}

/** Pear / teardrop drop, point facing +Y, widest radius ~0.62, height ~2. */
export function createPearDrop(segments = 12): THREE.LatheGeometry {
  return lathe(
    [
      [0.0001, -1],
      [0.38, -0.86],
      [0.6, -0.5],
      [0.62, -0.15],
      [0.46, 0.35],
      [0.22, 0.8],
      [0.0001, 1],
    ],
    segments,
  );
}

/** Smooth cabochon dome, radius 1, facing +Y. */
export function createCabochon(segments = 24): THREE.LatheGeometry {
  const profile: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    profile.push([Math.max(0.0001, Math.cos(a)), Math.sin(a) * 0.62]);
  }
  profile.unshift([0.0001, 0]);
  return lathe(profile, segments);
}

/**
 * Temple-style medallion: a shallow domed disc with a raised beaded rim,
 * radius 1, face towards +Z.
 */
export function createMedallion(segments = 48): THREE.LatheGeometry {
  const geo = lathe(
    [
      [0.0001, -0.08],
      [0.92, -0.08],
      [1, -0.02],
      [1, 0.06],
      [0.9, 0.12],
      [0.82, 0.08],
      [0.6, 0.1],
      [0.3, 0.16],
      [0.0001, 0.18],
    ],
    segments,
  );
  geo.rotateX(Math.PI / 2);
  return geo;
}

/**
 * Leaf/petal with bevelled edges, base at origin, tip along +Y (length 1), face +Z.
 * The petal is cupped across its width and curls back towards the tip so it
 * catches light like hand-formed metal rather than a flat cut-out.
 */
export function createPetal(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.1, 0.36, 0.6, 0, 1);
  shape.bezierCurveTo(-0.36, 0.6, -0.3, 0.1, 0, 0);
  const extruded = new THREE.ExtrudeGeometry(shape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 18,
    steps: 1,
  });
  extruded.translate(0, 0, -0.015);

  const pos = extruded.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + 0.9 * x * x - 0.22 * y * y);
  }
  extruded.deleteAttribute("normal");
  extruded.deleteAttribute("uv");
  const geo = mergeVertices(extruded, 1e-4);
  extruded.dispose();
  geo.computeVertexNormals();
  return geo;
}

/** Temple bell (jhumka) shell with wall thickness: open at the bottom, rim radius ~1, apex at +Y. */
export function createBellShell(segments = 48): THREE.LatheGeometry {
  return lathe(
    [
      [0.0001, 1.02],
      [0.14, 1.0],
      [0.3, 0.9],
      [0.52, 0.74],
      [0.74, 0.52],
      [0.86, 0.28],
      [0.92, 0.08],
      [0.96, -0.02],
      [1.04, -0.02],
      [1.06, 0.06],
      [0.98, 0.1],
      [0.93, 0.3],
      [0.8, 0.58],
      [0.58, 0.82],
      [0.34, 0.98],
      [0.16, 1.06],
      [0.14, 1.14],
      [0.0001, 1.16],
    ],
    segments,
  );
}

/** Bangle cross-section revolved around Y: radius ~1, with a central ridge and two rails. */
export function createBangleBand(segments = 128): THREE.LatheGeometry {
  const r = 1;
  const geo = lathe(
    [
      [r - 0.05, -0.2],
      [r + 0.02, -0.21],
      [r + 0.06, -0.17],
      [r + 0.06, -0.12],
      [r + 0.035, -0.1],
      [r + 0.05, -0.05],
      [r + 0.085, 0],
      [r + 0.05, 0.05],
      [r + 0.035, 0.1],
      [r + 0.06, 0.12],
      [r + 0.06, 0.17],
      [r + 0.02, 0.21],
      [r - 0.05, 0.2],
      [r - 0.07, 0.1],
      [r - 0.07, -0.1],
      [r - 0.05, -0.2],
    ],
    segments,
  );
  return geo;
}

/** Comfort-fit ring band revolved around Y, inner radius ~0.5. */
export function createRingBand(segments = 96): THREE.LatheGeometry {
  return lathe(
    [
      [0.5, -0.08],
      [0.54, -0.1],
      [0.585, -0.075],
      [0.6, 0],
      [0.585, 0.075],
      [0.54, 0.1],
      [0.5, 0.08],
      [0.49, 0],
      [0.5, -0.08],
    ],
    segments,
  );
}

const _object = new THREE.Object3D();

export function composeMatrix(
  position: THREE.Vector3Like,
  options: { lookAt?: THREE.Vector3; quaternion?: THREE.Quaternion; euler?: THREE.Euler; scale?: number | THREE.Vector3Like } = {},
): THREE.Matrix4 {
  _object.position.set(position.x, position.y, position.z);
  _object.quaternion.identity();
  if (options.quaternion) _object.quaternion.copy(options.quaternion);
  if (options.euler) _object.rotation.copy(options.euler);
  if (options.lookAt) _object.lookAt(options.lookAt);
  const s = options.scale ?? 1;
  if (typeof s === "number") _object.scale.setScalar(s);
  else _object.scale.set(s.x, s.y, s.z);
  _object.updateMatrix();
  return _object.matrix.clone();
}
