import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContactSection } from "@/components/sections/ContactSection";
import { RatingStars } from "@/components/sections/GoogleRating";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { business, contactLinks, formatOpeningHours, formattedAddress } from "@/lib/constants/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact Sri Hari Jewellers | Kappukadu, Tamil Nadu",
  description:
    "Call Sri Hari Jewellers on 999 6666 216 or get directions to our jewellery shop at No: 6/213, Kappukadu, Tamil Nadu 629162.",
  path: "/contact",
  absoluteTitle: true,
});

export default function ContactPage() {
  const details: { label: string; value: ReactNode }[] = [
    { label: "Business", value: business.name },
    { label: "Category", value: business.category },
    {
      label: "Address",
      value: (
        <address className="not-italic">
          {formattedAddress.lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </address>
      ),
    },
    {
      label: "Phone",
      value: (
        <a href={contactLinks.tel} className="link-underline">
          {business.phone.display}
        </a>
      ),
    },
    {
      label: "Google rating",
      value: (
        <span className="flex flex-wrap items-center gap-3">
          <span>
            {business.rating.value} / {business.rating.best}
          </span>
          <RatingStars value={business.rating.value} className="h-4 w-4" />
          <a href={contactLinks.googleReviews} target="_blank" rel="noopener noreferrer" className="link-underline tap-target text-muted">
            {business.rating.count} Google reviews
          </a>
        </span>
      ),
    },
    ...(business.openingHours.length ? [{ label: "Opening hours", value: business.openingHours.map(formatOpeningHours).join("; ") }] : []),
  ];

  return (
    <>
      <div className="container-luxe pt-28 md:pt-36">
        <Breadcrumbs crumb={{ name: "Contact", path: "/contact" }} />
      </div>
      <ContactSection headingLevel="h1" autoLoadMap />

      <section className="chapter border-t border-line" aria-labelledby="business-info-title">
        <div className="container-luxe grid gap-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="business-info-title" className="eyebrow">
              Business information
            </h2>
            <p className="mt-6 max-w-xs text-[0.95rem] leading-7 text-muted">
              {business.name} — a jewellery shop in {business.address.locality}, {business.address.region}, for gold,
              traditional and bridal jewellery.
            </p>
          </div>
          <dl className="lg:col-span-7 lg:col-start-6">
            {details.map((d) => (
              <div key={d.label} className="grid gap-2 border-b border-line py-6 first:border-t sm:grid-cols-3">
                <dt className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-ink uppercase">{d.label}</dt>
                <dd className="text-[1.05rem] leading-7 text-ink sm:col-span-2">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
