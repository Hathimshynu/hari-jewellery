import type { Key, Vec3 } from "./tracks";

/** The four pieces that perform in the homepage film. */
export type StoryKind = "necklace" | "ring" | "earrings" | "bangle";
export const storyKinds: StoryKind[] = ["necklace", "ring", "earrings", "bangle"];

export interface PieceTrack {
  position: Key<Vec3>[];
  rotation: Key<Vec3>[];
  scale: Key<number>[];
}

export interface Choreography {
  camera: { position: Key<Vec3>[]; target: Key<Vec3>[] };
  pieces: Record<StoryKind, PieceTrack>;
  /** Opacity of the soft contact shadow under the closing composition. */
  shadow: Key<number>[];
}

export interface LightingTracks {
  sweepX: Key<number>[];
  sweepStrength: Key<number>[];
  key: Key<number>[];
  env: Key<number>[];
}

const hidden: PieceTrack = {
  position: [{ at: 0, value: [0, -6, 0] }],
  rotation: [{ at: 0, value: [0, 0, 0] }],
  scale: [{ at: 0, value: 0 }],
};

/**
 * Chapters (scroll progress):
 *  1 INTRO       0.00–0.14  necklace centred, turning slowly, title visible
 *  2 APPROACH    0.14–0.30  camera moves in, necklace grows, title parts
 *  3 MACRO       0.30–0.45  camera on the pendant, light sweeps ("Every detail matters")
 *  4 ORBIT       0.45–0.60  camera orbits, necklace shifts right ("Crafted with precision")
 *  5 TRANSITION  0.60–0.75  necklace exits right and back; ring rises from below and turns
 *  6 COLLECTION  0.75–1.00  ring leaves; jhumkas come forward from the back, then the bangle
 */
export const storyLighting: LightingTracks = {
  sweepX: [
    { at: 0, value: -6 },
    { at: 0.34, value: -6 },
    { at: 0.43, value: 6 },
    { at: 0.45, value: 6 },
    // Reset while the light is dimmed, then pass again for the ring and the collection.
    { at: 0.62, value: -6 },
    { at: 0.73, value: 6 },
    { at: 0.88, value: -6 },
    { at: 0.98, value: 6 },
  ],
  sweepStrength: [
    { at: 0, value: 0.15 },
    { at: 0.33, value: 0.2 },
    { at: 0.36, value: 1 },
    { at: 0.42, value: 1 },
    { at: 0.45, value: 0.12 },
    { at: 0.62, value: 0.12 },
    { at: 0.65, value: 1 },
    { at: 0.72, value: 1 },
    { at: 0.76, value: 0.12 },
    { at: 0.88, value: 0.12 },
    { at: 0.91, value: 1 },
    { at: 1, value: 0.7 },
  ],
  key: [
    { at: 0, value: 1 },
    { at: 0.3, value: 1.1 },
    { at: 0.44, value: 1.15 },
    { at: 0.54, value: 0.95 },
    { at: 0.67, value: 1.1 },
    { at: 1, value: 1 },
  ],
  env: [
    { at: 0, value: 1 },
    { at: 0.3, value: 1.08 },
    { at: 0.44, value: 1.15 },
    { at: 0.54, value: 1 },
    { at: 0.7, value: 1.1 },
    { at: 1, value: 1 },
  ],
};

export const storyWide: Choreography = {
  camera: {
    position: [
      { at: 0, value: [0, 0.15, 6.4] },
      { at: 0.14, value: [0, 0.15, 6.4] },
      { at: 0.3, value: [0, -0.05, 4.6] },
      { at: 0.37, value: [-0.1, -0.28, 2.45] },
      { at: 0.44, value: [-0.14, -0.34, 2.3] },
      { at: 0.54, value: [2.3, 0.45, 5.2] },
      { at: 0.6, value: [2.1, 0.4, 5.5] },
      { at: 0.67, value: [0.55, 0.15, 5.3] },
      { at: 0.75, value: [0.4, 0.1, 5.1] },
      { at: 0.82, value: [0, 0.1, 5.2] },
      { at: 0.9, value: [0, 0.15, 6.2] },
      { at: 1, value: [0, 0.2, 6.6] },
    ],
    target: [
      { at: 0, value: [0, -0.05, 0] },
      { at: 0.14, value: [0, -0.05, 0] },
      { at: 0.3, value: [0, -0.35, 0.5] },
      { at: 0.37, value: [-0.52, -0.7, 0.95] },
      { at: 0.44, value: [-0.54, -0.74, 0.95] },
      { at: 0.54, value: [0.95, -0.15, 0] },
      { at: 0.6, value: [1.05, -0.1, 0] },
      { at: 0.67, value: [0.45, -0.05, 0.4] },
      { at: 0.75, value: [0.45, 0, 0.4] },
      { at: 0.82, value: [0, -0.2, 0] },
      { at: 1, value: [0, -0.25, 0] },
    ],
  },
  pieces: {
    necklace: {
      position: [
        { at: 0, value: [0, -0.05, 0] },
        { at: 0.14, value: [0, -0.05, 0] },
        { at: 0.3, value: [0, -0.12, 0.5] },
        { at: 0.44, value: [0, -0.1, 0.35] },
        { at: 0.54, value: [1.75, -0.05, 0] },
        { at: 0.6, value: [1.9, 0, -0.2] },
        { at: 0.7, value: [3.9, 0.25, -2.8] },
      ],
      rotation: [
        { at: 0, value: [0.42, 0, 0] },
        { at: 0.14, value: [0.42, 0.15, 0] },
        { at: 0.3, value: [0.5, 0, 0] },
        { at: 0.44, value: [0.48, 0, 0] },
        { at: 0.54, value: [0.34, -0.8, 0.08] },
        { at: 0.6, value: [0.3, -1.05, 0.1] },
        { at: 0.7, value: [0.2, -1.9, 0.2] },
      ],
      scale: [
        { at: 0, value: 0.94 },
        { at: 0.14, value: 0.94 },
        { at: 0.3, value: 1.08 },
        { at: 0.44, value: 1.05 },
        { at: 0.6, value: 0.98 },
        { at: 0.68, value: 0.75 },
        { at: 0.71, value: 0 },
      ],
    },
    ring: {
      position: [
        { at: 0, value: [0.95, -3.4, 0.9] },
        { at: 0.59, value: [0.95, -3.4, 0.9] },
        { at: 0.67, value: [0.95, -0.05, 0.4] },
        { at: 0.75, value: [0.95, 0, 0.4] },
        { at: 0.83, value: [-2.4, 1.4, -1.6] },
      ],
      rotation: [
        { at: 0.59, value: [1.1, -0.9, 0.3] },
        { at: 0.67, value: [0.18, -0.3, 0.05] },
        { at: 0.75, value: [0.12, 0.25, 0] },
        { at: 0.83, value: [0.5, 0.9, 0.3] },
      ],
      scale: [
        { at: 0.585, value: 0 },
        { at: 0.59, value: 1 },
        { at: 0.8, value: 0.95 },
        { at: 0.83, value: 0.5 },
        { at: 0.85, value: 0 },
      ],
    },
    earrings: {
      position: [
        { at: 0, value: [0, -0.35, -7] },
        { at: 0.74, value: [0, -0.35, -7] },
        { at: 0.83, value: [0, -0.45, 0.3] },
        { at: 0.88, value: [0, -0.45, 0.3] },
        { at: 0.95, value: [-1.35, -0.5, 0.2] },
        { at: 1, value: [-1.4, -0.5, 0.2] },
      ],
      rotation: [
        { at: 0.74, value: [0.2, 1.3, 0] },
        { at: 0.83, value: [0.08, 0, 0] },
        { at: 1, value: [0.05, 0.3, 0] },
      ],
      scale: [
        { at: 0.735, value: 0 },
        { at: 0.74, value: 1.3 },
      ],
    },
    bangle: {
      position: [
        { at: 0, value: [3.8, -2.4, 0.6] },
        { at: 0.86, value: [3.8, -2.4, 0.6] },
        { at: 0.95, value: [1.35, -0.45, 0] },
        { at: 1, value: [1.4, -0.4, 0] },
      ],
      rotation: [
        { at: 0.86, value: [-1.2, 1.2, 0.3] },
        { at: 0.95, value: [-0.42, 0.5, 0.1] },
        { at: 1, value: [-0.35, 0.35, 0] },
      ],
      scale: [
        { at: 0.855, value: 0 },
        { at: 0.86, value: 0.62 },
      ],
    },
  },
  shadow: [
    { at: 0, value: 0 },
    { at: 0.84, value: 0 },
    { at: 0.93, value: 0.3 },
    { at: 1, value: 0.3 },
  ],
};

/**
 * Portrait phones and tablets — deliberately simpler than desktop: vertical
 * camera travel, gentle zoom, slow rotation, scale and position only. No
 * orbit; every piece enters and leaves vertically. Type sits below the
 * jewellery.
 */
export const storyNarrow: Choreography = {
  camera: {
    position: [
      { at: 0, value: [0, 0.2, 11.5] },
      { at: 0.14, value: [0, 0.2, 11.5] },
      { at: 0.3, value: [0, -0.1, 9.2] },
      { at: 0.37, value: [0, -0.55, 6.2] },
      { at: 0.44, value: [0, -0.6, 6] },
      { at: 0.54, value: [0, 0.3, 10.5] },
      { at: 0.6, value: [0, 0.3, 10.5] },
      { at: 0.67, value: [0, 0.4, 8.2] },
      { at: 0.75, value: [0, 0.4, 8] },
      { at: 0.82, value: [0, 0.4, 10] },
      { at: 1, value: [0, 0.4, 11] },
    ],
    target: [
      { at: 0, value: [0, -0.35, 0] },
      { at: 0.14, value: [0, -0.35, 0] },
      { at: 0.3, value: [0, -0.6, 0.4] },
      { at: 0.37, value: [0, -1.4, 0.8] },
      { at: 0.44, value: [0, -1.45, 0.8] },
      { at: 0.54, value: [0, 0.4, 0] },
      { at: 0.6, value: [0, 0.45, 0] },
      { at: 0.67, value: [0, 0.05, 0.4] },
      { at: 0.75, value: [0, 0.1, 0.4] },
      { at: 0.82, value: [0, 0.2, 0] },
      { at: 1, value: [0, 0.1, 0] },
    ],
  },
  pieces: {
    necklace: {
      position: [
        { at: 0, value: [0, -0.45, 0] },
        { at: 0.14, value: [0, -0.45, 0] },
        { at: 0.3, value: [0, -0.55, 0.4] },
        { at: 0.44, value: [0, -0.45, 0.3] },
        { at: 0.54, value: [0, 1, 0] },
        { at: 0.6, value: [0, 1.3, -0.2] },
        { at: 0.7, value: [0, 4.4, -1.5] },
      ],
      rotation: [
        { at: 0, value: [0.42, 0, 0] },
        { at: 0.3, value: [0.5, 0, 0] },
        { at: 0.44, value: [0.48, 0, 0] },
        { at: 0.54, value: [0.4, -0.5, 0] },
        { at: 0.7, value: [0.3, -1.2, 0] },
      ],
      scale: [
        { at: 0, value: 0.92 },
        { at: 0.14, value: 0.92 },
        { at: 0.3, value: 1.02 },
        { at: 0.44, value: 1 },
        { at: 0.54, value: 0.82 },
        { at: 0.68, value: 0.6 },
        { at: 0.71, value: 0 },
      ],
    },
    ring: {
      position: [
        { at: 0, value: [0, -4.5, 0.6] },
        { at: 0.59, value: [0, -4.5, 0.6] },
        { at: 0.67, value: [0, 0.45, 0.4] },
        { at: 0.75, value: [0, 0.5, 0.4] },
        { at: 0.83, value: [0, 3.6, -1] },
      ],
      rotation: [
        { at: 0.59, value: [0.6, -0.4, 0.1] },
        { at: 0.67, value: [0.18, -0.3, 0.05] },
        { at: 0.83, value: [0.3, 0.4, 0] },
      ],
      scale: storyWide.pieces.ring.scale.map((k) => ({ ...k, value: k.value * 0.78 })),
    },
    earrings: {
      position: [
        { at: 0, value: [0, -4.5, 0.3] },
        { at: 0.74, value: [0, -4.5, 0.3] },
        { at: 0.83, value: [0, 1, 0.3] },
        { at: 0.88, value: [0, 1, 0.3] },
        { at: 0.95, value: [0, 1.5, 0.1] },
        { at: 1, value: [0, 1.55, 0.1] },
      ],
      rotation: [
        { at: 0.74, value: [0.2, 0.4, 0] },
        { at: 0.83, value: [0.08, 0, 0] },
        { at: 1, value: [0.05, 0.3, 0] },
      ],
      scale: [
        { at: 0.735, value: 0 },
        { at: 0.74, value: 1.1 },
      ],
    },
    bangle: {
      position: [
        { at: 0, value: [0, -4.8, 0.3] },
        { at: 0.86, value: [0, -4.8, 0.3] },
        { at: 0.95, value: [0, -0.6, 0] },
        { at: 1, value: [0, -0.55, 0] },
      ],
      rotation: [
        { at: 0.86, value: [-0.9, 0.5, 0] },
        { at: 0.95, value: [-0.42, 0.5, 0.1] },
        { at: 1, value: [-0.35, 0.35, 0] },
      ],
      scale: [
        { at: 0.855, value: 0 },
        { at: 0.86, value: 0.58 },
      ],
    },
  },
  shadow: [{ at: 0, value: 0 }],
};

/** Closing composition behind the final call to action — the film ends where it began. */
export const finaleWide: Choreography = {
  camera: {
    position: [{ at: 0, value: [0, 0.1, 6.4] }],
    target: [{ at: 0, value: [0, -0.05, 0] }],
  },
  pieces: {
    necklace: {
      position: [{ at: 0, value: [1.62, -0.02, 0] }],
      rotation: [{ at: 0, value: [0.42, -0.35, 0.04] }],
      scale: [{ at: 0, value: 0.88 }],
    },
    ring: hidden,
    earrings: hidden,
    bangle: hidden,
  },
  shadow: [{ at: 0, value: 0 }],
};

export const finaleNarrow: Choreography = {
  camera: {
    position: [{ at: 0, value: [0, 0.2, 11.5] }],
    target: [{ at: 0, value: [0, -0.2, 0] }],
  },
  pieces: {
    necklace: {
      position: [{ at: 0, value: [0, 1.7, 0] }],
      rotation: [{ at: 0, value: [0.42, 0, 0] }],
      scale: [{ at: 0, value: 0.8 }],
    },
    ring: hidden,
    earrings: hidden,
    bangle: hidden,
  },
  shadow: [{ at: 0, value: 0 }],
};

export const finaleLighting: LightingTracks = {
  sweepX: [{ at: 0, value: 2.2 }],
  sweepStrength: [{ at: 0, value: 0.5 }],
  key: [{ at: 0, value: 1 }],
  env: [{ at: 0, value: 1.05 }],
};
