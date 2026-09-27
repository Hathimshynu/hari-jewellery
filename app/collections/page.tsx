import type { Metadata } from "next";
import { PieceGrid } from "@/components/jewellery/PieceGrid";
import { CollectionFeature } from "@/components/sections/CollectionFeature";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { VisitBand } from "@/components/sections/VisitBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageIntro } from "@/components/ui/PageIntro";
import { collectionOrder, collections } from "@/lib/constants/collections";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Gold Jewellery Collections | Sri Hari Jewellers Kappukadu",
  description:
    "Explore gold, traditional, contemporary and special occasion jewellery collections from Sri Hari Jewellers, Kappukadu.",
  path: "/collections",
  absoluteTitle: true,
});

const layouts = ["image-right", "image-left"] as const;

export default function CollectionsPage() {
  return (
    <>
      <PageIntro
        crumb={{ name: "Collections", path: "/collections" }}
        eyebrow="Sri Hari Jewellers · Kappukadu"
        titleLines={["Jewellery", <em key="e">collections</em>]}
        lead={
          <p>
            Five collections, one idea: jewellery made for the moments that matter. Explore contemporary, traditional,
            bridal, wedding and everyday gold jewellery — then see every piece in person at our store in Kappukadu,
            Tamil Nadu.
          </p>
        }
        image={jewelleryAssets.wedding.set01}
      >
        <ButtonLink href="#contemporary" variant="outline" icon="arrow">
          Begin with contemporary
        </ButtonLink>
      </PageIntro>

      <ProductShowcase
        scene="collections"
        id="pieces"
        tone="sand"
        eyebrow="In the studio"
        titleLines={["Every piece,", "in the round"]}
        intro="Select a piece to see it from every side. Drag to turn it; every piece is on view in our Kappukadu store."
      />

      {collectionOrder.map((id, i) => (
        <CollectionFeature key={id} collection={collections[id]} index={i + 1} layout={layouts[i % 2]} />
      ))}

      <PieceGrid
        id="traditional-pieces"
        eyebrow="Traditional & temple jewellery"
        titleLines={["Heritage,", "piece by piece"]}
        intro="Temple necklaces, jhumkas and bangles in the forms handed down through generations."
        pieces={[
          { title: "Temple necklaces", copy: "Graduated medallions, rubies and pearl drops.", image: jewelleryAssets.necklaces.temple01, href: "/bridal" },
          { title: "Traditional necklaces", copy: "Classic forms for festivals and family occasions.", image: jewelleryAssets.traditional.templeSet01, href: "/gold-jewellery" },
          { title: "Jhumkas", copy: "Temple bells with granulation and pearl fringes.", image: jewelleryAssets.jhumkas.detail01, href: "/wedding" },
          { title: "Bangles", copy: "Ridged kadas with milgrain and coloured stones.", image: jewelleryAssets.bangles.temple01, href: "/gold-jewellery" },
        ]}
      />

      <PieceGrid
        id="contemporary-pieces"
        eyebrow="Contemporary & lightweight"
        titleLines={["Modern,", "light, lasting"]}
        intro="Clean lines and lightweight designs — easy to wear from morning to evening."
        pieces={[
          { title: "Pendants", copy: "A fine chain and a single halo-set stone.", image: jewelleryAssets.necklaces.finePendant01, href: "#pieces" },
          { title: "Solitaire rings", copy: "One brilliant, held high in gold.", image: jewelleryAssets.rings.solitaire02, href: "#pieces" },
          { title: "Stud earrings", copy: "Four-prong solitaires for every day.", image: jewelleryAssets.earrings.studs01, href: "#pieces" },
          { title: "Everyday sets", copy: "Lightweight pieces made to be worn together.", image: jewelleryAssets.everyday.set01, href: "#everyday" },
        ]}
      />

      <VisitBand />
    </>
  );
}
