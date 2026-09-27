import type { Metadata } from "next";
import { business } from "@/lib/constants/business";
import { SITE_URL } from "@/lib/constants/site";

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${business.name} — gold and bridal jewellery in ${business.address.locality}, ${business.address.region}`,
};

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Use the title exactly as given (the homepage), skipping the brand suffix. */
  absoluteTitle?: boolean;
}

/** Consistent title, description, canonical, Open Graph and Twitter metadata. */
export function buildMetadata({ title, description, path, absoluteTitle = false }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${business.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: path,
      siteName: business.name,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${business.name} | Gold & Bridal Jewellery in ${business.address.locality}`,
    template: `%s | ${business.name}`,
  },
  applicationName: business.name,
  category: "jewellery",
  formatDetection: { telephone: true, address: true, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};
