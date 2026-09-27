import Link from "next/link";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MaskLines } from "@/components/ui/Typography";
import { collections } from "@/lib/constants/collections";
import { jewelleryAssets, type JewelleryAsset } from "@/lib/constants/jewellery";
import { HorizontalDirector } from "./HorizontalDirector";

const pieces: { title: string; copy: string; image: JewelleryAsset }[] = [
  { title: "Necklaces", copy: "The centrepiece of the celebration look.", image: jewelleryAssets.necklaces.temple02 },
  { title: "Bangles", copy: "Worn in pairs, stacked for the occasion.", image: jewelleryAssets.bangles.pair01 },
  { title: "Earrings", copy: "Jhumkas and drops that move with every moment.", image: jewelleryAssets.earrings.jhumkaPair01 },
  { title: "Rings", copy: "For the exchange of promises.", image: jewelleryAssets.rings.solitaire01 },
];

/** Horizontal gallery on desktop (scroll moves the track sideways); vertical elsewhere. */
export function WeddingGallery({ index }: { index: number }) {
  const wedding = collections.wedding;
  return (
    <section id="wedding" className="chapter wedding" aria-labelledby="wedding-title">
      <div className="wedding__sticky">
        <div className="wedding__track" data-wedding-track>
          <div className="wedding__intro">
            <div className="flex items-baseline gap-5" data-reveal="fade">
              <span className="index-number text-[2.4rem] leading-none">{String(index).padStart(2, "0")}</span>
              <span className="h-px w-14 bg-gold/60" aria-hidden="true" />
              <span className="eyebrow">{wedding.name}</span>
            </div>
            <MaskLines
              id="wedding-title"
              className="display display-md mt-8"
              lines={["Your", <em key="a">celebration.</em>, "Your", <em key="b">jewellery.</em>]}
            />
            <p className="lead mt-8 max-w-sm" data-reveal="fade">
              {wedding.description}
            </p>
          </div>

          {pieces.map((piece, i) => (
            <article key={piece.title} className="wedding__panel">
              <Link href={wedding.href} className="media-hover block" data-cursor="view" aria-label={`${piece.title} — ${wedding.cta}`}>
                <EditorialImage image={piece.image} sizes="(min-width: 1024px) 28vw, 92vw" aspect="3 / 4" parallax={0} />
              </Link>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="index-number text-xl">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[2rem] leading-none font-light tracking-[0.02em] text-ink uppercase">
                  {piece.title}
                </h3>
              </div>
              <p className="mt-3 max-w-xs text-[0.95rem] leading-7 text-muted">{piece.copy}</p>
            </article>
          ))}

          <div className="wedding__outro">
            <p className="font-display text-[clamp(2rem,3vw,2.8rem)] leading-tight font-light text-ink">
              Chosen together,
              <br />
              <em className="text-gold-ink">worn for a lifetime.</em>
            </p>
            <div className="mt-10">
              <ButtonLink href={wedding.href} variant="outline" icon="arrow">
                {wedding.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
      <HorizontalDirector />
    </section>
  );
}
