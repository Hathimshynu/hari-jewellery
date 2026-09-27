import type { Metadata } from "next";
import { PieceGrid } from "@/components/jewellery/PieceGrid";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { GoldMotes } from "@/components/sections/GoldMotes";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { VisitBand } from "@/components/sections/VisitBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageIntro } from "@/components/ui/PageIntro";
import { MaskLines, SplitWords } from "@/components/ui/Typography";
import { contactLinks } from "@/lib/constants/business";
import { collections } from "@/lib/constants/collections";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Bridal Jewellery in Kappukadu | Sri Hari Jewellers",
  description:
    "Discover bridal jewellery collections including necklaces, earrings, bangles and wedding jewellery at Sri Hari Jewellers, Kappukadu.",
  path: "/bridal",
  absoluteTitle: true,
});

export default function BridalPage() {
  const bridal = collections.bridal;
  return (
    <>
      <PageIntro
        crumb={{ name: "Bridal Jewellery", path: "/bridal" }}
        eyebrow={bridal.name}
        titleLines={["Bridal", <em key="e">jewellery</em>]}
        lead={
          <p>
            {bridal.description} Bridal jewellery at Sri Hari Jewellers in Kappukadu is chosen for the day itself — and
            for every anniversary, festival and family celebration that follows.
          </p>
        }
        image={jewelleryAssets.bridal.set01}
      >
        <ButtonLink href={contactLinks.tel} variant="solid" icon="phone">
          Call to plan your visit
        </ButtonLink>
      </PageIntro>

      <section className="chapter relative overflow-hidden bg-sand" aria-labelledby="bridal-moment-title">
        <GoldMotes count={16} seed={5} />
        <div className="container-luxe relative grid items-center gap-16 py-24 md:py-36 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <EditorialImage image={jewelleryAssets.macro.pendant01} sizes="(min-width: 1024px) 38vw, 92vw" aspect="4 / 5" parallax={0.1} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <MaskLines
              id="bridal-moment-title"
              className="display display-lg"
              lines={["For the", "moments that", <em key="e">become memories</em>]}
            />
            <SplitWords
              className="mt-10 max-w-lg font-display text-[clamp(1.3rem,1.9vw,1.7rem)] leading-[1.5] font-light text-ink"
              text="A bridal set is chosen slowly — with family, with care, and with the whole celebration in mind. Take your time with every piece in store."
            />
          </div>
        </div>
      </section>

      <ProductShowcase
        scene="bridal"
        id="bridal-scene"
        eyebrow="The bridal set"
        titleLines={["Necklace, jhumkas,", "bangle"]}
        intro="A complete bridal look in the studio light. Drag to turn the set."
      />

      <PieceGrid
        id="bridal-pieces"
        eyebrow="The bridal set"
        titleLines={["Pieces to", "treasure"]}
        intro="Explore the pieces that complete a bridal look, and see the full collection in store in Kappukadu."
        pieces={[
          { title: "Bridal necklaces", copy: "Statement necklaces with temple motifs, stones and pearl drops.", image: jewelleryAssets.necklaces.temple01, href: "/collections#traditional" },
          { title: "Bangles", copy: "Bangles to wear in pairs or stack for the ceremony.", image: jewelleryAssets.bangles.pair01, href: "/gold-jewellery" },
          { title: "Earrings", copy: "Jhumkas and drops that complete the neckline.", image: jewelleryAssets.earrings.jhumkaPair01, href: "/collections#traditional" },
          { title: "Complete sets", copy: "Necklace, earrings and bangles chosen to be worn together.", image: jewelleryAssets.bridal.set01, href: "#bridal-scene" },
        ]}
      />

      <VisitBand />
    </>
  );
}
