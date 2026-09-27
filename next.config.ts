import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    // Most visitors are first-time local customers on mobile: inlining the
    // (small, Tailwind) stylesheet removes the only render-blocking request.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
  },
};

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    // Canonical URLs, Open Graph, the sitemap and JSON-LD are built from this
    // value; a production build must never ship "localhost" in any of them.
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    if (!/^https?:\/\//.test(site) || /localhost|127\.0\.0\.1/.test(site)) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be set to the live domain for production builds, e.g. NEXT_PUBLIC_SITE_URL=https://www.your-domain.in",
      );
    }
  }
  return nextConfig;
}
