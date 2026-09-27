import { JewellerySelector, type SelectorProduct } from "@/components/jewellery/JewellerySelector";
import { MaskLines } from "@/components/ui/Typography";
import { showcaseProducts, showcaseScenes, type ShowcaseSceneId } from "@/lib/constants/3dScenes";
import { getModelManifest, publicFileExists } from "@/lib/utils/assets";

interface ProductShowcaseProps {
  scene: ShowcaseSceneId;
  id: string;
  eyebrow: string;
  titleLines: [string, string];
  intro?: string;
  index?: number;
  tone?: "ivory" | "sand";
}

/**
 * A page's interactive product scene: selector + lightweight 3D viewer.
 * Heading, descriptions and links are HTML (crawlable, accessible); the
 * canvas only enhances them.
 */
export function ProductShowcase({ scene, id, eyebrow, titleLines, intro, index, tone = "ivory" }: ProductShowcaseProps) {
  const products: SelectorProduct[] = showcaseScenes[scene].map((pid) => {
    const product = showcaseProducts[pid];
    return { ...product, imageAvailable: publicFileExists(product.image.src) };
  });
  const models = getModelManifest();

  return (
    <section id={id} className={`chapter overflow-hidden ${tone === "sand" ? "bg-sand" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="container-luxe py-24 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-5" data-reveal="fade">
              {index ? <span className="index-number text-[2.4rem] leading-none">{String(index).padStart(2, "0")}</span> : null}
              {index ? <span className="h-px w-14 bg-gold/60" aria-hidden="true" /> : null}
              <span className="eyebrow">{eyebrow}</span>
            </div>
            <MaskLines id={`${id}-title`} className="display display-lg mt-8" lines={[titleLines[0], <em key="e">{titleLines[1]}</em>]} />
          </div>
          {intro ? (
            <p className={`lead lg:col-span-4 lg:col-start-9 ${tone === "sand" ? "text-muted-strong" : ""}`} data-reveal="fade">
              {intro}
            </p>
          ) : null}
        </div>
        <div className="mt-14 md:mt-20">
          <JewellerySelector products={products} models={models} idPrefix={id} headingLevel="h3" />
        </div>
      </div>
    </section>
  );
}
