export type JewelKind = "necklace" | "ring" | "earrings" | "bangle" | "pendant" | "studs";

export const jewelKinds: JewelKind[] = ["necklace", "ring", "earrings", "bangle", "pendant", "studs"];

/**
 * Drop real .glb files with these names into /public/models and they replace
 * the procedural pieces automatically on the next build.
 * See public/models/README.md for the Blender export requirements.
 */
export const modelFiles: Record<JewelKind, string> = {
  necklace: "bridal-necklace.glb",
  ring: "gold-ring.glb",
  earrings: "jhumka-earrings.glb",
  bangle: "bangle.glb",
  pendant: "pendant-necklace.glb",
  studs: "stud-earrings.glb",
};

/**
 * Largest dimension each piece occupies in scene units. Supplied models are
 * normalised to this size so any Blender scale works.
 */
export const modelSizes: Record<JewelKind, number> = {
  necklace: 2.7,
  ring: 1.3,
  earrings: 1,
  bangle: 2.3,
  pendant: 2,
  studs: 0.95,
};

export type ModelManifest = Record<JewelKind, string | null>;

export const emptyModelManifest: ModelManifest = {
  necklace: null,
  ring: null,
  earrings: null,
  bangle: null,
  pendant: null,
  studs: null,
};
