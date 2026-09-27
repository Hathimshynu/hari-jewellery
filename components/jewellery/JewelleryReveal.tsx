import { JewelleryImage } from "@/components/jewellery/JewelleryImage";
import { MaskLines } from "@/components/ui/Typography";
import { jewelleryAssets, USING_ILLUSTRATIVE_RENDERS } from "@/lib/constants/jewellery";
import { RevealDirector } from "./RevealDirector";

/**
 * Fullscreen product moment — "The art of gold". As the visitor scrolls the
 * necklace enlarges towards its pendant, the background falls away, the title
 * lifts off and a macro of the pendant opens out of it. Image-based (light on
 * every device); reduced-motion visitors see the same content stacked.
 */
export function JewelleryReveal() {
  return (
    <section id="art-of-gold" className="reveal chapter" aria-labelledby="art-of-gold-title">
      <div className="reveal__sticky">
        <div className="reveal__product" data-reveal-product>
          {/* One art-directed still per orientation; only the visible one is fetched.
              Requested somewhat larger than the viewport because the push magnifies it. */}
          <div className="reveal__art reveal__art--wide">
            <JewelleryImage asset={jewelleryAssets.hero.necklace} sizes="150vw" />
          </div>
          <div className="reveal__art reveal__art--portrait">
            <JewelleryImage asset={jewelleryAssets.hero.necklacePortrait} sizes="150vw" />
          </div>
        </div>
        {/* Champagne vignette that falls away as the camera pushes in. */}
        <div className="reveal__bg" data-reveal-bg aria-hidden="true" />

        <div className="reveal__title" data-reveal-title>
          <p className="eyebrow">A closer look</p>
          <MaskLines id="art-of-gold-title" className="display display-xl mt-6" lines={["The art", <em key="e">of gold</em>]} />
        </div>

        <div className="reveal__macro" data-reveal-macro>
          <JewelleryImage asset={jewelleryAssets.macro.pendant01} sizes="100vw" />
        </div>

        <div className="reveal__caption" data-reveal-caption>
          <p className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] font-light text-ink">
            Look closer.
          </p>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-7 text-muted-strong">
            Gold that holds the light, and detail that holds the eye — petal, bead and stone.
          </p>
        </div>

        {USING_ILLUSTRATIVE_RENDERS ? <span className="illustrative-tag">Illustrative render</span> : null}
      </div>
      <RevealDirector />
    </section>
  );
}
