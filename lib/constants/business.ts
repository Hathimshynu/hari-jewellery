/**
 * Verified business information for Sri Hari Jewellers.
 *
 * Only add details here that the business has confirmed. Optional fields are
 * intentionally left empty — they are omitted from the UI and structured data
 * until they are filled in.
 */

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

/** One opening-hours rule, e.g. { days: ["Monday", …, "Saturday"], opens: "09:30", closes: "20:30" }. */
export interface OpeningHours {
  days: DayOfWeek[];
  /** 24-hour "HH:MM". */
  opens: string;
  closes: string;
}

export interface BusinessInfo {
  name: string;
  alternateName: string;
  category: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    countryCode: string;
  };
  phone: {
    /** Human-friendly format shown on the site. */
    display: string;
    /** E.164 format for tel: links. */
    e164: string;
  };
  rating: {
    value: number;
    count: number;
    best: number;
    /**
     * Whether to add aggregateRating to the JSON-LD. Google's review-snippet
     * guidelines do not allow marking up ratings aggregated from another site
     * (these come from Google reviews), so this stays false unless the rating
     * is collected on this website. The rating is still shown on the page.
     */
    inStructuredData: boolean;
  };
  /** Set to true only once the business confirms this number is on WhatsApp. */
  whatsappEnabled: boolean;
  /** Confirmed opening hours. Leave empty until the business confirms them. */
  openingHours: OpeningHours[];
  /** Exact coordinates of the storefront. Leave null until confirmed. */
  geo: { latitude: number; longitude: number } | null;
  /** Official profiles (Instagram, Google Business Profile, Facebook…). */
  profiles: {
    instagram: string | null;
    googleBusiness: string | null;
  };
}

export const business: BusinessInfo = {
  name: "Sri Hari Jewellers",
  alternateName: "Sree Hari Jewellers",
  category: "Jewellery Store",
  address: {
    street: "No: 6/213",
    locality: "Kappukadu",
    region: "Tamil Nadu",
    postalCode: "629162",
    countryCode: "IN",
  },
  phone: {
    display: "999 6666 216",
    e164: "+919996666216",
  },
  rating: {
    value: 4.4,
    count: 22,
    best: 5,
    inStructuredData: false,
  },
  whatsappEnabled: false,
  openingHours: [],
  geo: null,
  profiles: {
    instagram: null,
    googleBusiness: null,
  },
};

const mapsQuery = encodeURIComponent(
  `${business.name}, ${business.address.street}, ${business.address.locality}, ${business.address.region} ${business.address.postalCode}`,
);

export const contactLinks = {
  tel: `tel:${business.phone.e164}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  mapEmbed: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
  /** Uses the Google Business Profile when configured, otherwise a Google search for the store. */
  googleReviews:
    business.profiles.googleBusiness ??
    `https://www.google.com/search?q=${encodeURIComponent(`${business.name} ${business.address.locality} reviews`)}`,
  whatsapp: business.whatsappEnabled
    ? `https://wa.me/${business.phone.e164.replace("+", "")}`
    : null,
} as const;

export const formattedAddress = {
  lines: [
    `${business.address.street},`,
    `${business.address.locality},`,
    `${business.address.region} ${business.address.postalCode}`,
  ],
  singleLine: `${business.address.street}, ${business.address.locality}, ${business.address.region} ${business.address.postalCode}`,
};

/** "Monday–Saturday, 09:30–20:30" style label for visible opening hours. */
export function formatOpeningHours(hours: OpeningHours): string {
  const days = hours.days.length > 2 ? `${hours.days[0]}–${hours.days[hours.days.length - 1]}` : hours.days.join(" & ");
  return `${days}, ${hours.opens}–${hours.closes}`;
}
