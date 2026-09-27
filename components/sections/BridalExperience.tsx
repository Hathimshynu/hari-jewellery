import Link from "next/link";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MaskLines } from "@/components/ui/Typography";
import { collections } from "@/lib/constants/collections";
import { GoldMotes } from "./GoldMotes";

export function BridalExperience({ index }: { index: number }) {
  const bridal = collections.bridal;
  return (
    <section id="bridal" className="chapter overflow-hidden bg-sand" aria-labelledby="bridal-title">
      <GoldMotes count={18} seed={3} />
      <div className="container-luxe relative grid items-center gap-16 py-28 md:py-40 lg:grid-cols-12 lg:gap-0">
        <div className="relative z-10 lg:col-span-7 lg:pr-6">
          <div className="flex items-baseline gap-5" data-reveal="fade">
            <span className="index-number text-[2.4rem] leading-none">{String(index).padStart(2, "0")}</span>
            <span className="h-px w-14 bg-gold/60" aria-hidden="true" />
            <span className="eyebrow">{bridal.name}</span>
          </div>
          <MaskLines
            id="bridal-title"
            className="display display-lg mt-8"
            lines={["For the", "moments that", <em key="e">become memories</em>]}
          />
          <p className="mt-10 max-w-md text-[1.05rem] leading-8 text-muted-strong" data-reveal="fade">
            {bridal.description} {bridal.story}
          </p>
          <div className="mt-12" data-reveal="fade">
            <ButtonLink href={bridal.href} variant="solid" icon="arrow">
              Discover bridal
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5 lg:-ml-16">
          <Link href={bridal.href} className="media-hover block" aria-label={bridal.cta} data-cursor="view">
            <EditorialImage image={bridal.image} sizes="(min-width: 1024px) 42vw, 92vw" aspect="4 / 5" parallax={0.12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
