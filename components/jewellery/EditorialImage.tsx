import { USING_ILLUSTRATIVE_RENDERS, type JewelleryAsset } from "@/lib/constants/jewellery";
import { JewelleryImage } from "./JewelleryImage";

interface EditorialImageProps {
  image: JewelleryAsset;
  sizes: string;
  /** CSS aspect-ratio, e.g. "4 / 5". */
  aspect?: string;
  className?: string;
  /** Scroll parallax strength (0 disables). */
  parallax?: number;
  reveal?: boolean;
  /** Cursor label when hovered. */
  cursor?: "view" | "explore";
  preload?: boolean;
  /** Above the fold but not the LCP: load immediately without preloading. */
  eager?: boolean;
}

/**
 * Layered editorial image. Each transform lives on its own layer so the
 * clip reveal, parallax, cursor drift and hover zoom never fight:
 * frame (clip) → parallax → settle (reveal scale) → drift → image (hover zoom).
 */
export function EditorialImage({
  image,
  sizes,
  aspect = "4 / 5",
  className = "",
  parallax = 0.06,
  reveal = true,
  cursor,
  preload = false,
  eager = false,
}: EditorialImageProps) {
  return (
    <div
      className={`media-frame ${className}`}
      style={{ aspectRatio: aspect }}
      data-reveal={reveal ? "clip" : undefined}
      data-cursor={cursor}
    >
      <div className="absolute inset-x-0 -inset-y-[8%]" data-parallax={parallax || undefined}>
        <div className="absolute inset-0" data-reveal-media>
          <div className="drift absolute inset-0" data-drift>
            <JewelleryImage asset={image} sizes={sizes} priority={preload} eager={eager} />
          </div>
        </div>
      </div>
      {USING_ILLUSTRATIVE_RENDERS ? <span className="illustrative-tag">Illustrative render</span> : null}
    </div>
  );
}
