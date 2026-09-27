/**
 * JEWELLERY ASSET REGISTRY
 * ------------------------
 * Every jewellery image on the site is referenced from this file only.
 * Files live in /public/images/jewellery/<category>/.
 *
 * The current files are illustrative studio renders of the site's procedural
 * 3D jewellery (see USING_ILLUSTRATIVE_RENDERS). To use real Sri Hari
 * Jewellers photography:
 *
 *   1. Save the photo over the file with the same name (WebP or JPEG,
 *      2000 px+ on the long side for hero/product images).
 *   2. Update `width`/`height` below to the photo's pixel size and rewrite
 *      `alt` to describe the actual piece.
 *   3. When every image is a real photograph, set USING_ILLUSTRATIVE_RENDERS
 *      to false — the "Illustrative render" labels disappear everywhere.
 *
 * A missing file never breaks a page: <JewelleryImage> renders an elegant
 * placeholder instead (and logs a warning during the build).
 */
export const USING_ILLUSTRATIVE_RENDERS = true;

export interface JewelleryAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const asset = (path: string, width: number, height: number, alt: string): JewelleryAsset => ({
  src: `/images/jewellery/${path}`,
  width,
  height,
  alt,
});

const PORTRAIT: [number, number] = [2000, 2500];

export const jewelleryAssets = {
  hero: {
    necklace: asset("hero/hero-necklace.webp", 2880, 1620, "Gold temple necklace with a ruby-set lotus pendant, pearl drops and an emerald drop"),
    necklacePortrait: asset(
      "hero/hero-necklace-portrait.webp",
      1170,
      2532,
      "Gold temple necklace with a ruby-set lotus pendant, pearl drops and an emerald drop",
    ),
  },
  necklaces: {
    temple01: asset("necklaces/temple-necklace-01.webp", ...PORTRAIT, "Traditional gold temple necklace with ruby medallions and pearl drops"),
    temple02: asset("necklaces/temple-necklace-02.webp", ...PORTRAIT, "Gold temple necklace seen from the side, showing graduated medallions and the lotus pendant"),
    finePendant01: asset("necklaces/fine-pendant-01.webp", ...PORTRAIT, "Fine gold chain with a halo-set diamond solitaire pendant"),
  },
  bridal: {
    set01: asset("bridal/bridal-set-01.webp", ...PORTRAIT, "Bridal gold set: temple necklace, jhumka earrings and a temple bangle"),
  },
  rings: {
    solitaire01: asset("rings/solitaire-ring-01.webp", ...PORTRAIT, "Gold solitaire ring with a round brilliant diamond and a pavé halo"),
    solitaire02: asset("rings/solitaire-ring-02.webp", ...PORTRAIT, "Gold solitaire ring from above, showing the six-prong setting and diamond shoulders"),
  },
  bangles: {
    temple01: asset("bangles/temple-bangle-01.webp", ...PORTRAIT, "Gold temple bangle with milgrain edges and alternating rubies and emeralds"),
    pair01: asset("bangles/bangle-pair-01.webp", ...PORTRAIT, "A pair of gold temple bangles"),
  },
  earrings: {
    jhumkaPair01: asset("earrings/jhumka-pair-01.webp", ...PORTRAIT, "A pair of gold jhumka earrings with floral ruby studs and pearl fringes"),
    studs01: asset("earrings/diamond-studs-01.webp", ...PORTRAIT, "Diamond solitaire stud earrings in gold four-prong settings"),
  },
  jhumkas: {
    detail01: asset("jhumkas/jhumka-detail-01.webp", ...PORTRAIT, "Close view of a gold jhumka: granulation rows, ruby accents and a pearl fringe"),
  },
  traditional: {
    templeSet01: asset("traditional/temple-set-01.webp", ...PORTRAIT, "Traditional temple jewellery: gold necklace with jhumka earrings"),
  },
  contemporary: {
    set01: asset("contemporary/contemporary-set-01.webp", ...PORTRAIT, "Contemporary gold jewellery: solitaire pendant, diamond studs and a solitaire ring"),
  },
  wedding: {
    set01: asset("wedding/wedding-set-01.webp", 2800, 1750, "Wedding jewellery set: gold necklace, bangle, jhumka earrings and ring"),
  },
  everyday: {
    set01: asset("everyday/everyday-set-01.webp", ...PORTRAIT, "Lightweight everyday gold jewellery: diamond studs and a slim solitaire ring"),
  },
  macro: {
    pendant01: asset("macro/pendant-detail-01.webp", ...PORTRAIT, "Macro view of gold lotus petals, milgrain beading and a ruby at the heart of a pendant"),
    gemstone01: asset("macro/gemstone-detail-01.webp", ...PORTRAIT, "Macro view of a diamond held in a six-prong gold setting with a halo of small stones"),
    goldTexture01: asset("macro/gold-texture-01.webp", ...PORTRAIT, "Macro view of polished gold granulation and a pearl fringe on a jhumka"),
    chain01: asset("macro/chain-detail-01.webp", ...PORTRAIT, "Macro view of a beaded gold chain with temple medallions and pearl drops"),
  },
} satisfies Record<string, Record<string, JewelleryAsset>>;
