import { jewelleryAssets, type JewelleryAsset } from "./jewellery";

export type CollectionId = "contemporary" | "traditional" | "bridal" | "wedding" | "everyday";

export interface Collection {
  id: CollectionId;
  /** Display name used in lists and navigation. */
  name: string;
  titleLines: [string, string];
  description: string;
  /** Longer copy for the collections page. */
  story: string;
  href: string;
  cta: string;
  image: JewelleryAsset;
}

export const collections: Record<CollectionId, Collection> = {
  contemporary: {
    id: "contemporary",
    name: "Contemporary Jewellery",
    titleLines: ["Contemporary", "Jewellery"],
    description: "Modern silhouettes crafted for today's style.",
    story:
      "Clean lines, light forms and considered details — contemporary gold jewellery that moves easily from the workday to an evening out.",
    href: "/collections#contemporary",
    cta: "Explore Contemporary",
    image: jewelleryAssets.contemporary.set01,
  },
  traditional: {
    id: "traditional",
    name: "Traditional & Classic Collections",
    titleLines: ["Traditional", "Collections"],
    description: "Timeless designs inspired by Indian heritage.",
    story:
      "Explore traditional jewellery inspired by Indian craftsmanship and timeless design — temple motifs, graduated medallions and the familiar forms handed down through generations.",
    href: "/collections#traditional",
    cta: "Explore Traditional",
    image: jewelleryAssets.traditional.templeSet01,
  },
  bridal: {
    id: "bridal",
    name: "Bridal Jewellery Collections",
    titleLines: ["Bridal", "Jewellery"],
    description: "Statement pieces for unforgettable celebrations.",
    story:
      "Discover bridal jewellery designed for wedding celebrations, including traditional gold necklaces, earrings and bangles — chosen for the day itself and treasured for many more.",
    href: "/bridal",
    cta: "Explore Bridal Collection",
    image: jewelleryAssets.bridal.set01,
  },
  wedding: {
    id: "wedding",
    name: "Wedding & Special Occasion Jewellery",
    titleLines: ["Wedding &", "Special Occasions"],
    description: "Jewellery for the ceremonies, gatherings and milestones you celebrate together.",
    story:
      "For the family wedding, the festival, the anniversary — pieces that bring a sense of occasion to every celebration.",
    href: "/wedding",
    cta: "Explore Wedding Jewellery",
    image: jewelleryAssets.wedding.set01,
  },
  everyday: {
    id: "everyday",
    name: "Everyday Jewellery",
    titleLines: ["Everyday", "Elegance"],
    description: "Elegant jewellery designed for everyday moments.",
    story: "Rings, studs and fine chains light enough to wear every day — and lovely enough to notice every time.",
    href: "/collections#everyday",
    cta: "Explore Everyday",
    image: jewelleryAssets.everyday.set01,
  },
};

export const collectionOrder: CollectionId[] = ["contemporary", "traditional", "bridal", "wedding", "everyday"];
