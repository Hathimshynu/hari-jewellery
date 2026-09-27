import type { Metadata } from "next";
import Link from "next/link";
import { aboutStatement } from "@/components/sections/AboutSection";
import { GoogleRating } from "@/components/sections/GoogleRating";
import { VisitBand } from "@/components/sections/VisitBand";
import { PageIntro } from "@/components/ui/PageIntro";
import { MaskLines } from "@/components/ui/Typography";
import { business } from "@/lib/constants/business";
import { collectionOrder, collections } from "@/lib/constants/collections";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import { siteCopy } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About Sri Hari Jewellers | Kappukadu",
  description:
    "Sri Hari Jewellers is a jewellery store at No: 6/213, Kappukadu, Tamil Nadu, for gold, traditional, bridal and everyday jewellery.",
  path: "/about",
  absoluteTitle: true,
});

export default function AboutPage() {
  return (
    <>
      <PageIntro
        crumb={{ name: "About", path: "/about" }}
        eyebrow={`About ${business.name}`}
        titleLines={["A legacy of", <em key="e">craftsmanship</em>]}
        lead={<p>{aboutStatement}</p>}
        image={jewelleryAssets.macro.goldTexture01}
      />

      <section className="chapter border-t border-line" aria-labelledby="believe-title">
        <div className="container-luxe grid gap-14 py-24 md:py-36 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MaskLines id="believe-title" className="display display-md" lines={["More than", <em key="e">a precious metal</em>]} />
          </div>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7" data-reveal="fade">
            <p className="font-display text-[clamp(1.4rem,2vw,1.9rem)] leading-[1.45] font-light text-ink">{siteCopy.positioning}</p>
            <p className="lead">
              {business.name} is a jewellery store in {business.address.locality}, {business.address.region}. Visitors
              searching for {business.alternateName} will find us at {business.address.street},{" "}
              {business.address.locality}.
            </p>
          </div>
        </div>
      </section>

      <section className="chapter border-t border-line" aria-labelledby="discover-title">
        <div className="container-luxe py-24 md:py-32">
          <h2 id="discover-title" className="eyebrow">
            What you will discover
          </h2>
          <ol className="mt-10 border-t border-line" data-reveal="stagger">
            {collectionOrder.map((id, i) => (
              <li key={id} className="border-b border-line" data-reveal-item>
                <Link href={collections[id].href} className="group grid items-baseline gap-2 py-8 md:grid-cols-12 md:gap-8">
                  <span className="index-number text-xl md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight font-light text-ink uppercase transition-colors duration-500 group-hover:text-gold-ink md:col-span-6">
                    {collections[id].name}
                  </span>
                  <span className="text-[0.95rem] leading-7 text-muted md:col-span-5">{collections[id].description}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <GoogleRating />
      <VisitBand />
    </>
  );
}
