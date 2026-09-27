import { getImageProps } from "next/image";
import { jewelleryAssets } from "@/lib/constants/jewellery";

/**
 * Still frame of the opening shot, art-directed for landscape and portrait.
 * It paints immediately (LCP), doubles as the no-WebGL / reduced-motion
 * visual, and cross-fades away once the live 3D stage is ready.
 */
export function HeroPoster() {
  const { necklace: heroWide, necklacePortrait: heroPortrait } = jewelleryAssets.hero;
  const common = { alt: heroWide.alt, sizes: "100vw", quality: 85 };

  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({
    ...common,
    src: heroWide.src,
    width: heroWide.width,
    height: heroWide.height,
  });
  const {
    props: { srcSet: portraitSrcSet, ...rest },
  } = getImageProps({
    ...common,
    src: heroPortrait.src,
    width: heroPortrait.width,
    height: heroPortrait.height,
  });

  return (
    <div className="story__poster" data-stage-poster>
      <picture>
        <source media="(min-aspect-ratio: 17/20)" srcSet={wideSrcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is supplied via getImageProps */}
        <img
          {...rest}
          srcSet={portraitSrcSet}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
          data-poster-image
        />
      </picture>
    </div>
  );
}
