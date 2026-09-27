import Link from "next/link";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowIcon } from "@/components/ui/Icons";
import { MaskLines } from "@/components/ui/Typography";
import type { Collection } from "@/lib/constants/collections";

interface CollectionFeatureProps {
  collection: Collection;
  index: number;
  layout?: "image-right" | "image-left" | "centered";
  /** Optional section id override (defaults to the collection id). */
  id?: string;
}

/** Editorial chapter for one collection: index, oversized title, framed image. */
export function CollectionFeature({ collection, index, layout = "image-right", id }: CollectionFeatureProps) {
  const headingId = `${collection.id}-title`;
  const number = String(index).padStart(2, "0");

  const image = (
    <Link
      href={collection.href}
      className="media-hover group relative block"
      aria-label={`${collection.cta} — ${collection.name}`}
      data-cursor="view"
    >
      <EditorialImage
        image={collection.image}
        sizes={layout === "centered" ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 48vw, 92vw"}
        aspect="4 / 5"
      />
      <span className="hover-caption" aria-hidden="true">
        <span>{collection.cta}</span>
        <ArrowIcon className="h-4 w-4" />
      </span>
    </Link>
  );

  const text = (
    <div className={layout === "centered" ? "mx-auto max-w-2xl text-center" : ""}>
      <div className={`flex items-baseline gap-5 ${layout === "centered" ? "justify-center" : ""}`} data-reveal="fade">
        <span className="index-number text-[2.4rem] leading-none">{number}</span>
        <span className="h-px w-14 bg-gold/60" aria-hidden="true" />
        <span className="eyebrow">{collection.name}</span>
      </div>
      <MaskLines
        id={headingId}
        className="display display-feature mt-8"
        lines={[collection.titleLines[0], <em key="e">{collection.titleLines[1]}</em>]}
      />
      <p className={`lead mt-8 max-w-md ${layout === "centered" ? "mx-auto" : ""}`} data-reveal="fade">
        {collection.description} {collection.story}
      </p>
      <div className="mt-10" data-reveal="fade">
        <ButtonLink href={collection.href} variant="text" icon="arrow">
          {collection.cta}
        </ButtonLink>
      </div>
    </div>
  );

  if (layout === "centered") {
    return (
      <section id={id ?? collection.id} className="chapter py-24 md:py-40" aria-labelledby={headingId}>
        <div className="container-luxe">
          {text}
          <div className="mx-auto mt-16 max-w-[34rem] md:mt-20">{image}</div>
        </div>
      </section>
    );
  }

  const imageFirst = layout === "image-left";
  return (
    <section id={id ?? collection.id} className="chapter py-24 md:py-36" aria-labelledby={headingId}>
      <div className="container-luxe grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className={imageFirst ? "lg:col-start-8 lg:col-end-13 lg:row-start-1" : "lg:col-span-6"}>{text}</div>
        <div className={imageFirst ? "lg:col-start-1 lg:col-end-7 lg:row-start-1" : "lg:col-start-7 lg:col-end-13"}>{image}</div>
      </div>
    </section>
  );
}
