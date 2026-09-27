import { JewelleryImage } from "@/components/jewellery/JewelleryImage";
import { MaskLines } from "@/components/ui/Typography";
import { USING_ILLUSTRATIVE_RENDERS, jewelleryAssets } from "@/lib/constants/jewellery";
import { CraftsmanshipDirector } from "./CraftsmanshipDirector";

const details = [
  {
    label: "Craftsmanship",
    title: "Form & proportion",
    copy: "Every curve, petal and bead shapes how a piece sits, moves and catches the light.",
    image: jewelleryAssets.macro.pendant01,
  },
  {
    label: "Detail",
    title: "Stones & settings",
    copy: "Each gemstone is framed in gold so it can be seen — and so it stays exactly where it belongs.",
    image: jewelleryAssets.macro.gemstone01,
  },
  {
    label: "Finish",
    title: "Polish & texture",
    copy: "From mirror-bright surfaces to fine granulation, the finish is what you feel first.",
    image: jewelleryAssets.macro.goldTexture01,
  },
  {
    label: "Pattern",
    title: "Chain & medallion",
    copy: "Bead by bead and medallion by medallion, pattern gives a necklace its rhythm.",
    image: jewelleryAssets.macro.chain01,
  },
];

/**
 * Macro close-ups with sequential labels. On desktop the chapter holds while
 * the images unmask one after another; elsewhere it is a simple stacked list.
 */
export function Craftsmanship({ index }: { index: number }) {
  return (
    <section id="craftsmanship" className="chapter craft" aria-labelledby="craft-title">
      <div className="craft__sticky">
        <div className="container-luxe grid w-full items-center gap-14 py-24 lg:grid-cols-12 lg:gap-10 lg:py-0">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-5" data-reveal="fade">
              <span className="index-number text-[2.4rem] leading-none">{String(index).padStart(2, "0")}</span>
              <span className="h-px w-14 bg-gold/60" aria-hidden="true" />
              <span className="eyebrow">Macro</span>
            </div>
            <MaskLines
              id="craft-title"
              className="display display-md mt-8"
              lines={["Crafted in", <em key="e">every detail</em>]}
            />

            <ol className="mt-12 space-y-7">
              {details.map((d, i) => (
                <li key={d.label} className="craft__item" data-craft-item data-reveal="fade">
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, "0")} — {d.label}
                  </p>
                  <h3 className="mt-3 font-display text-[1.9rem] leading-tight font-light text-ink">{d.title}</h3>
                  <p className="mt-2 max-w-sm text-[0.95rem] leading-7 text-muted">{d.copy}</p>
                  <div className="craft__inline-media media-frame mt-6" style={{ aspectRatio: "4 / 5" }}>
                    <JewelleryImage asset={d.image} sizes="92vw" />
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="craft__stack lg:col-span-6 lg:col-start-7" aria-hidden="true">
            <div className="media-frame relative mx-auto w-full max-w-[36rem]" style={{ aspectRatio: "4 / 5" }}>
              {details.map((d, i) => (
                <div
                  key={d.label}
                  className="absolute inset-0"
                  data-craft-image
                  style={i === 0 ? undefined : { clipPath: "inset(100% 0% 0% 0%)" }}
                >
                  <div className="absolute inset-0" data-craft-drift>
                    <JewelleryImage asset={{ ...d.image, alt: "" }} sizes="(min-width: 1024px) 40vw, 92vw" />
                  </div>
                </div>
              ))}
              {USING_ILLUSTRATIVE_RENDERS ? <span className="illustrative-tag">Illustrative render</span> : null}
            </div>
            <div className="mx-auto mt-6 flex max-w-[36rem] items-center gap-4">
              <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-strong" data-craft-count>
                01
              </span>
              <span className="relative h-px flex-1 bg-line">
                <span className="absolute inset-0 origin-left scale-x-0 bg-gold" data-craft-progress />
              </span>
              <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-strong">
                {String(details.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <CraftsmanshipDirector />
    </section>
  );
}
