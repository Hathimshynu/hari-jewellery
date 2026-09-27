import Image from "next/image";
import { BrandMark } from "@/components/ui/BrandMark";
import { USING_ILLUSTRATIVE_RENDERS, type JewelleryAsset } from "@/lib/constants/jewellery";
import { publicFileExists } from "@/lib/utils/assets";

interface JewelleryImageProps {
  asset: JewelleryAsset;
  /** Responsive sizes hint — always pass a realistic value so phones never download desktop sizes. */
  sizes: string;
  /** CSS aspect-ratio for a self-contained frame (e.g. "4 / 5"). Omit to fill a positioned parent. */
  aspect?: string;
  className?: string;
  imageClassName?: string;
  /** Only for the LCP image on a page: preloads and fetches at high priority. */
  priority?: boolean;
  /** Above the fold but not the LCP element: load immediately, without preload or high priority. */
  eager?: boolean;
  fit?: "cover" | "contain";
  /** Show the "Illustrative render" label while placeholder renders are in use. */
  label?: boolean;
}

/** Shown if an image file is missing, so a page never shows a broken image. */
export function ImagePlaceholder({ alt, className = "" }: { alt: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sand text-gold ${className}`}
    >
      <BrandMark className="h-10 w-10" />
      <span className="text-[0.6rem] font-semibold tracking-[0.24em] text-muted-strong uppercase">Photograph coming soon</span>
    </div>
  );
}

/**
 * The one image primitive for jewellery photography: next/image with
 * responsive sizes, lazy loading by default, AVIF/WebP delivery, and a
 * graceful placeholder when a file has not been supplied yet.
 */
export function JewelleryImage({
  asset,
  sizes,
  aspect,
  className = "",
  imageClassName = "",
  priority = false,
  eager = false,
  fit = "cover",
  label = false,
}: JewelleryImageProps) {
  const exists = publicFileExists(asset.src);
  const image = exists ? (
    <Image
      src={asset.src}
      alt={asset.alt}
      fill
      sizes={sizes}
      preload={priority}
      loading={priority ? undefined : eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={`${fit === "cover" ? "object-cover" : "object-contain"} ${imageClassName}`}
    />
  ) : (
    <ImagePlaceholder alt={asset.alt} />
  );

  if (!aspect) return image;

  return (
    <div className={`media-frame ${className}`} style={{ aspectRatio: aspect }}>
      {image}
      {label && exists && USING_ILLUSTRATIVE_RENDERS ? <span className="illustrative-tag">Illustrative render</span> : null}
    </div>
  );
}
