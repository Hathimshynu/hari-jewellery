import type { Metadata } from "next";
import { PieceGrid } from "@/components/jewellery/PieceGrid";
import { GoldRate } from "@/components/sections/GoldRate";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { VisitBand } from "@/components/sections/VisitBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageIntro } from "@/components/ui/PageIntro";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import { siteCopy } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Gold Jewellery in Kappukadu | Sri Hari Jewellers",
  description:
    "Gold necklaces, bangles, earrings and rings at Sri Hari Jewellers, Kappukadu, Tamil Nadu — traditional and contemporary gold ornaments for every occasion.",
  path: "/gold-jewellery",
  absoluteTitle: true,
});

export default function GoldJewelleryPage() {
  return (
    <>
      <PageIntro
        crumb={{ name: "Gold Jewellery", path: "/gold-jewellery" }}
        eyebrow="Gold jewellery · Kappukadu"
        titleLines={["Gold", <em key="e">jewellery</em>]}
        lead={
          <p>
            Explore gold jewellery at Sri Hari Jewellers, Kappukadu, with designs ranging from traditional pieces to
            contemporary styles for everyday wear and special occasions. {siteCopy.positioning}
          </p>
        }
        image={jewelleryAssets.bangles.pair01}
      >
        <ButtonLink href="#gold-rate" variant="outline" icon="arrow">
          Today&apos;s gold rate
        </ButtonLink>
      </PageIntro>

      <GoldRate />

      <ProductShowcase
        scene="gold"
        id="gold-studio"
        tone="sand"
        eyebrow="Gold, up close"
        titleLines={["Polished", "to catch the light"]}
        intro="Turn each piece to see how the gold is finished — polished edges, satin fields and fine granulation."
      />

      <PieceGrid
        id="gold-pieces"
        eyebrow="Gold ornaments"
        titleLines={["Crafted to", "be treasured"]}
        intro="Traditional and contemporary gold ornaments for celebrations and for every day."
        pieces={[
          { title: "Necklaces", copy: "From fine chains to temple necklaces.", image: jewelleryAssets.necklaces.temple02, href: "/collections#traditional" },
          { title: "Rings", copy: "Rings for gifting, promising and everyday wear.", image: jewelleryAssets.rings.solitaire01, href: "/collections#contemporary" },
          { title: "Bangles", copy: "Everyday bangles and ceremonial kadas.", image: jewelleryAssets.bangles.pair01, href: "/collections#traditional" },
          { title: "Earrings", copy: "Studs, drops and jhumkas.", image: jewelleryAssets.earrings.jhumkaPair01, href: "/collections#traditional" },
        ]}
      />

      <VisitBand />
    </>
  );
}
