import { MaskLines } from "@/components/ui/Typography";
import { business, contactLinks, formattedAddress } from "@/lib/constants/business";
import { ContactActions } from "./ContactActions";
import { MapEmbed } from "./MapEmbed";

export function ContactSection({ headingLevel = "h2", autoLoadMap = false }: { headingLevel?: "h1" | "h2"; autoLoadMap?: boolean }) {
  const Sub = headingLevel === "h1" ? "h2" : "h3";
  return (
    <section id="contact" className="chapter border-t border-line" aria-labelledby="contact-title">
      <div className="container-luxe grid gap-16 py-28 md:py-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow" data-reveal="fade">
            Visit us in {business.address.locality}
          </p>
          <MaskLines
            as={headingLevel}
            id="contact-title"
            className="display display-lg mt-7"
            lines={["Come discover", <em key="e">your next treasure</em>]}
          />

          <div className="mt-12 grid gap-10 sm:grid-cols-2" data-reveal="stagger">
            <div data-reveal-item>
              <Sub className="eyebrow">Address</Sub>
              <address className="mt-4 font-display text-[1.45rem] leading-snug text-ink not-italic">
                {formattedAddress.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <div data-reveal-item>
              <Sub className="eyebrow">Phone</Sub>
              <a href={contactLinks.tel} className="link-underline mt-4 inline-block font-display text-[1.9rem] tracking-[0.04em] text-ink">
                {business.phone.display}
              </a>
              <p className="mt-2 text-sm text-muted">Call us for today&apos;s gold rate and availability.</p>
            </div>
          </div>

          <div className="mt-12" data-reveal="fade">
            <ContactActions />
          </div>
        </div>

        <div className="lg:col-span-6" data-reveal="fade">
          <MapEmbed autoLoad={autoLoadMap} />
        </div>
      </div>
    </section>
  );
}
