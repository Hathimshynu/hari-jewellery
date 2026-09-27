import type { GoldVariant } from "@/components/3d/materials/GoldMaterial";
import type { Vec3 } from "@/components/3d/tracks";
import { jewelleryAssets, type JewelleryAsset } from "./jewellery";
import type { JewelKind } from "./models";

export type ShowcaseProductId = "temple-necklace" | "bridal-set" | "solitaire-ring" | "jhumka" | "bangle" | "pendant" | "studs";

export interface Placement {
  kind: JewelKind;
  position: Vec3;
  rotation: Vec3;
  scale: number;
  variant?: GoldVariant;
}

export interface ShowcaseProduct {
  id: ShowcaseProductId;
  name: string;
  eyebrow: string;
  description: string;
  href: string;
  cta: string;
  /** Still used when WebGL is not shown (reduced motion, low-end devices, before loading). */
  image: JewelleryAsset;
  pieces: Placement[];
  /** Framing: what to look at, from which direction, and how large the set is. */
  view: { target: Vec3; direction: Vec3; radius: number };
}

export const showcaseProducts: Record<ShowcaseProductId, ShowcaseProduct> = {
  "temple-necklace": {
    id: "temple-necklace",
    name: "Temple necklace",
    eyebrow: "Traditional",
    description: "Graduated temple medallions, rubies and pearl drops around a lotus pendant.",
    href: "/collections#traditional",
    cta: "Explore traditional",
    image: jewelleryAssets.necklaces.temple01,
    pieces: [{ kind: "necklace", position: [0, 0, 0], rotation: [0.42, 0, 0], scale: 1 }],
    view: { target: [0, -0.05, 0], direction: [0, 0.12, 1], radius: 1.45 },
  },
  "bridal-set": {
    id: "bridal-set",
    name: "Bridal set",
    eyebrow: "Bridal",
    description: "Necklace, jhumkas and bangle — a complete look for the day itself.",
    href: "/bridal",
    cta: "Discover bridal",
    image: jewelleryAssets.bridal.set01,
    pieces: [
      { kind: "necklace", position: [0, 0.4, -0.3], rotation: [0.5, 0, 0], scale: 0.88 },
      { kind: "earrings", position: [-1.25, -0.6, 0.4], rotation: [0.08, 0.3, 0], scale: 0.95 },
      { kind: "bangle", position: [1.25, -0.75, 0.3], rotation: [-0.6, -0.4, 0], scale: 0.5 },
    ],
    view: { target: [0, -0.1, 0], direction: [0, 0.2, 1], radius: 1.95 },
  },
  "solitaire-ring": {
    id: "solitaire-ring",
    name: "Solitaire ring",
    eyebrow: "Contemporary",
    description: "A single brilliant held high in six prongs, with a halo and diamond shoulders.",
    href: "/collections#contemporary",
    cta: "Explore contemporary",
    image: jewelleryAssets.rings.solitaire01,
    pieces: [{ kind: "ring", position: [0, 0, 0], rotation: [0.2, -0.4, 0], scale: 1 }],
    view: { target: [0, 0.2, 0], direction: [0.15, 0.3, 1], radius: 0.95 },
  },
  jhumka: {
    id: "jhumka",
    name: "Jhumka earrings",
    eyebrow: "Heritage",
    description: "Temple bells with rows of granulation, ruby accents and a pearl fringe.",
    href: "/collections#traditional",
    cta: "Explore traditional",
    image: jewelleryAssets.earrings.jhumkaPair01,
    pieces: [{ kind: "earrings", position: [0, 0, 0], rotation: [0.08, 0.2, 0], scale: 1.2 }],
    view: { target: [0, -0.08, 0], direction: [0, 0.05, 1], radius: 0.85 },
  },
  bangle: {
    id: "bangle",
    name: "Temple bangle",
    eyebrow: "Gold",
    description: "A ridged kada with milgrain rails and alternating rubies and emeralds.",
    href: "/gold-jewellery",
    cta: "Explore gold",
    image: jewelleryAssets.bangles.temple01,
    pieces: [{ kind: "bangle", position: [0, 0, 0], rotation: [-0.55, 0.5, 0.1], scale: 0.8 }],
    view: { target: [0, 0, 0], direction: [0, 0.25, 1], radius: 1.05 },
  },
  pendant: {
    id: "pendant",
    name: "Solitaire pendant",
    eyebrow: "Contemporary",
    description: "A fine cable chain and a halo-set diamond — light enough for every day.",
    href: "/collections#contemporary",
    cta: "Explore contemporary",
    image: jewelleryAssets.necklaces.finePendant01,
    pieces: [{ kind: "pendant", position: [0, 0, 0], rotation: [0.35, 0, 0], scale: 1 }],
    view: { target: [0, -0.15, 0], direction: [0, 0.1, 1], radius: 1.15 },
  },
  studs: {
    id: "studs",
    name: "Diamond studs",
    eyebrow: "Everyday",
    description: "Four-prong solitaire studs that go with everything.",
    href: "/collections#everyday",
    cta: "Explore everyday",
    image: jewelleryAssets.earrings.studs01,
    pieces: [{ kind: "studs", position: [0, 0, 0], rotation: [0.1, 0.3, 0], scale: 1.3 }],
    view: { target: [0, 0, 0], direction: [0, 0.1, 1], radius: 0.65 },
  },
};

/** Which products each page's 3D scene offers (only pieces represented by assets). */
export const showcaseScenes = {
  home: ["temple-necklace", "bridal-set", "solitaire-ring", "jhumka", "bangle"],
  collections: ["temple-necklace", "bridal-set", "solitaire-ring", "jhumka", "bangle", "pendant", "studs"],
  gold: ["temple-necklace", "bangle", "jhumka", "solitaire-ring", "pendant"],
  bridal: ["bridal-set"],
} satisfies Record<string, ShowcaseProductId[]>;

export type ShowcaseSceneId = keyof typeof showcaseScenes;
