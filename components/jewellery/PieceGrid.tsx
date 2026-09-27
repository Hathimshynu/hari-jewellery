import Link from "next/link";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { MaskLines } from "@/components/ui/Typography";
import type { JewelleryAsset } from "@/lib/constants/jewellery";

export interface Piece {
  title: string;
  copy: string;
  image: JewelleryAsset;
  /** Collection to open from this item. */
  href?: string;
}

interface PieceGridProps {
  id: string;
  eyebrow: string;
  titleLines: [string, string];
  intro?: string;
  pieces: Piece[];
}

function PieceCard({ piece, index }: { piece: Piece; index: number }) {
  const body = (
    <>
      <EditorialImage image={piece.image} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" aspect="3 / 4" />
      <span className="piece-card__line" aria-hidden="true" />
      <div className="piece-card__title mt-6 flex items-baseline gap-4" data-reveal="fade">
        <span className="index-number text-lg">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="font-display text-[1.8rem] leading-none font-light tracking-[0.02em] text-ink uppercase">{piece.title}</h3>
      </div>
      <p className="mt-3 text-[0.95rem] leading-7 text-muted" data-reveal="fade">
        {piece.copy}
      </p>
      {piece.href ? (
        <span className="piece-card__cta" aria-hidden="true">
          View collection
        </span>
      ) : null}
    </>
  );
  if (!piece.href) return <div className="piece-card">{body}</div>;
  return (
    <Link href={piece.href} className="piece-card media-hover block" data-cursor="view">
      {body}
    </Link>
  );
}

/** Staggered editorial grid of jewellery types. */
export function PieceGrid({ id, eyebrow, titleLines, intro, pieces }: PieceGridProps) {
  return (
    <section className="chapter border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="container-luxe py-24 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal="fade">
              {eyebrow}
            </p>
            <MaskLines
              id={`${id}-title`}
              className="display display-lg mt-7"
              lines={[titleLines[0], <em key="e">{titleLines[1]}</em>]}
            />
          </div>
          {intro ? (
            <p className="lead lg:col-span-4 lg:col-start-9" data-reveal="fade">
              {intro}
            </p>
          ) : null}
        </div>

        <ul className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {pieces.map((piece, i) => (
            <li key={piece.title} className={i % 2 === 1 ? "lg:mt-24" : ""}>
              <PieceCard piece={piece} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
