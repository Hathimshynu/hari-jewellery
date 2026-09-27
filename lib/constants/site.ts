/**
 * Canonical origin of the production site. Set NEXT_PUBLIC_SITE_URL in the
 * deployment environment (e.g. https://www.yourdomain.in) — it is used for
 * canonical URLs, Open Graph, the sitemap and structured data.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteCopy = {
  tagline: "Celebrate Today. Treasure Forever.",
  positioning:
    "Gold is more than a precious metal — it is part of our traditions, celebrations and cherished memories.",
  footerLine: ["Timeless jewellery.", "Enduring memories."],
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Fuller label where there is room (mobile menu, footer). */
  longLabel?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Collections", href: "/collections" },
  { label: "Bridal", href: "/bridal" },
  { label: "Gold", href: "/gold-jewellery", longLabel: "Gold Jewellery" },
  { label: "Wedding", href: "/wedding" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
