import { ButtonLink } from "@/components/ui/ButtonLink";
import { MaskLines, SplitWords } from "@/components/ui/Typography";
import { business } from "@/lib/constants/business";

export const aboutStatement =
  "At Sri Hari Jewellers, jewellery is more than an ornament. It is a celebration of tradition, craftsmanship and the moments that become part of a family's story.";

export function AboutSection() {
  return (
    <section id="about" className="chapter border-t border-line" aria-labelledby="about-title">
      <div className="container-luxe grid gap-14 py-28 md:py-40 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="eyebrow" data-reveal="fade">
            About {business.name}
          </p>
          <p className="mt-6 max-w-xs text-[0.95rem] leading-7 text-muted" data-reveal="fade">
            A jewellery store in {business.address.locality}, {business.address.region} — for gold, traditional,
            bridal and everyday jewellery.
          </p>
        </div>
        <div className="lg:col-span-8">
          <MaskLines
            id="about-title"
            className="display display-lg"
            lines={["A legacy of", <em key="e">craftsmanship</em>]}
          />
          <SplitWords
            className="mt-12 max-w-3xl font-display text-[clamp(1.45rem,2.3vw,2.2rem)] leading-[1.4] font-light text-ink"
            text={aboutStatement}
          />
          <div className="mt-12" data-reveal="fade">
            <ButtonLink href="/about" variant="text" icon="arrow">
              About us
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
