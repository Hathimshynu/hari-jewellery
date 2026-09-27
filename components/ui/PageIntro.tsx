import type { CSSProperties, ReactNode } from "react";
import { EditorialImage } from "@/components/jewellery/EditorialImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { JewelleryAsset } from "@/lib/constants/jewellery";

interface PageIntroProps {
  eyebrow: string;
  titleLines: ReactNode[];
  lead: ReactNode;
  image?: JewelleryAsset;
  crumb: { name: string; path: string };
  children?: ReactNode;
}

const delay = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/** Opening block for inner pages: breadcrumb, h1 (CSS-animated for fast LCP), lead and hero image. */
export function PageIntro({ eyebrow, titleLines, lead, image, crumb, children }: PageIntroProps) {
  return (
    <section className="chapter pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="container-luxe grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
        <div className={image ? "lg:col-span-7" : "lg:col-span-10"}>
          <Breadcrumbs crumb={crumb} className="hero-fade" style={delay(0.05)} />
          <p className="eyebrow hero-fade mt-10" style={delay(0.08)}>
            {eyebrow}
          </p>
          <h1 className="display display-xl mt-6">
            {titleLines.map((line, i) => (
              <span key={i} className="mask-line hero-settle">
                <span style={delay(0.1 + i * 0.1)}>
                  {line}
                  {i < titleLines.length - 1 ? " " : null}
                </span>
              </span>
            ))}
          </h1>
          <div className="lead hero-fade mt-10 max-w-xl" style={delay(0.35)}>
            {lead}
          </div>
          {children ? (
            <div className="hero-fade mt-10" style={delay(0.45)}>
              {children}
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="hero-fade lg:col-span-5" style={delay(0.15)}>
            <EditorialImage image={image} sizes="(min-width: 1024px) 38vw, 92vw" aspect="4 / 5" reveal={false} eager />
          </div>
        ) : null}
      </div>
    </section>
  );
}
