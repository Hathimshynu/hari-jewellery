import type { Metadata } from "next";
import { VisitBand } from "@/components/sections/VisitBand";
import { WeddingGallery } from "@/components/sections/WeddingGallery";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageIntro } from "@/components/ui/PageIntro";
import { collections } from "@/lib/constants/collections";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Wedding Jewellery | Sri Hari Jewellers Kappukadu",
  description:
    "Wedding and special occasion jewellery from Sri Hari Jewellers — necklaces, bangles, jhumkas and rings chosen for ceremonies, festivals and family celebrations.",
  path: "/wedding",
  absoluteTitle: true,
});

export default function WeddingPage() {
  const wedding = collections.wedding;
  return (
    <>
      <PageIntro
        crumb={{ name: "Wedding Jewellery", path: "/wedding" }}
        eyebrow={wedding.name}
        titleLines={["Wedding", <em key="e">jewellery</em>]}
        lead={
          <p>
            {wedding.description} {wedding.story}
          </p>
        }
        image={jewelleryAssets.wedding.set01}
      >
        <ButtonLink href="#wedding" variant="outline" icon="arrow">
          See the pieces
        </ButtonLink>
      </PageIntro>

      <WeddingGallery index={1} />

      <VisitBand />
    </>
  );
}
