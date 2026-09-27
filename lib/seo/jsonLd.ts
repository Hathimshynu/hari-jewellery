import { business, contactLinks } from "@/lib/constants/business";
import { SITE_URL } from "@/lib/constants/site";

type JsonLd = Record<string, unknown>;

/**
 * schema.org JewelryStore built strictly from verified business data.
 * Optional fields (geo, opening hours, profiles, rating) appear only once
 * they are filled in / enabled in lib/constants/business.ts.
 */
export function jewelryStoreJsonLd(): JsonLd {
  const sameAs = [business.profiles.instagram, business.profiles.googleBusiness].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${SITE_URL}/#store`,
    name: business.name,
    alternateName: business.alternateName,
    url: SITE_URL,
    telephone: business.phone.e164,
    image: `${SITE_URL}/images/og-image.jpg`,
    logo: `${SITE_URL}/icon.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.countryCode,
    },
    hasMap: contactLinks.directions,
    areaServed: { "@type": "Place", name: `${business.address.locality}, ${business.address.region}` },
    ...(business.rating.inStructuredData
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.rating.value,
            reviewCount: business.rating.count,
            bestRating: business.rating.best,
            worstRating: 1,
          },
        }
      : {}),
    ...(business.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: business.geo.latitude, longitude: business.geo.longitude } }
      : {}),
    ...(business.openingHours.length
      ? {
          openingHoursSpecification: business.openingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Serialises JSON-LD safely for inline <script> tags. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
