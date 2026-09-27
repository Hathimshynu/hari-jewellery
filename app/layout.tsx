import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { MobileActionBar } from "@/components/navigation/MobileActionBar";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageTransition } from "@/components/ui/PageTransition";
import { PointerEffects } from "@/components/ui/PointerEffects";
import { ScrollReveals } from "@/components/ui/ScrollReveals";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { jewelryStoreJsonLd } from "@/lib/seo/jsonLd";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body>
        <noscript>
          {/* Without JavaScript the story chapters simply stack. */}
          <style>{`.story{height:auto!important}.story__viewport{position:relative!important;height:auto!important}.story__scene:not(.story__scene--hero){position:relative!important;opacity:1!important;visibility:visible!important;min-height:60vh!important;display:flex!important;align-items:center}`}</style>
        </noscript>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileActionBar />
        <PageTransition />
        <PointerEffects />
        <SmoothScroll />
        <ScrollReveals />
        <JsonLd data={jewelryStoreJsonLd()} />
      </body>
    </html>
  );
}
