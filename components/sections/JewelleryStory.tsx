import Link from "next/link";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { MaskLines, SplitWords } from "@/components/ui/Typography";
import { collectionOrder, collections } from "@/lib/constants/collections";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import { GoldMotes } from "./GoldMotes";

const homeAnchors: Record<string, string> = {
  contemporary: "#contemporary",
  traditional: "#traditional",
  bridal: "#bridal",
  wedding: "#wedding",
  everyday: "#everyday",
};

export function JewelleryStory() {
  return (
    <section id="jewellery-story" className="chapter overflow-hidden" aria-labelledby="jewellery-story-title">
      <GoldMotes count={10} seed={11} />
      <div className="container-luxe relative grid min-h-svh items-center gap-16 py-28 md:py-40 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow" data-reveal="fade">
            The collections
          </p>
          <MaskLines
            id="jewellery-story-title"
            className="display display-lg mt-7"
            lines={["Jewellery", <em key="e">with a story</em>]}
          />
          <SplitWords
            className="mt-10 max-w-xl font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.45] font-light text-ink"
            text="From timeless traditional craftsmanship to contemporary designs, discover jewellery created for life's most meaningful moments."
          />
          <p className="lead mt-8 max-w-lg" data-reveal="fade">
            Gold, traditional, bridal, wedding and everyday jewellery — all to see in person at our store in Kappukadu,
            Tamil Nadu.
          </p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <EditorialImage
            image={jewelleryAssets.necklaces.temple02}
            sizes="(min-width: 1024px) 30vw, 90vw"
            aspect="3 / 4"
            parallax={0.08}
          />
        </div>

        <nav aria-label="Collections on this page" className="lg:col-span-12">
          <ol className="grid border-t border-line sm:grid-cols-5" data-reveal="stagger">
            {collectionOrder.map((id, i) => (
              <li key={id} data-reveal-item className="border-b border-line sm:border-b-0 sm:border-r sm:last:border-r-0">
                <Link
                  href={homeAnchors[id]}
                  className="group flex items-baseline gap-4 py-6 sm:flex-col sm:gap-3 sm:px-5 sm:first:pl-0"
                >
                  <span className="index-number text-lg">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[0.72rem] font-semibold tracking-[0.2em] text-ink uppercase transition-colors duration-500 group-hover:text-gold-ink">
                    {collections[id].name}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
