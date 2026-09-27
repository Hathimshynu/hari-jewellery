import Link from "next/link";
import { Wordmark } from "@/components/navigation/SiteHeader";
import { business, contactLinks } from "@/lib/constants/business";
import { primaryNav, siteCopy } from "@/lib/constants/site";

export function SiteFooter() {
  const social = [
    business.profiles.instagram ? { label: "Instagram", href: business.profiles.instagram } : null,
    { label: "Google", href: contactLinks.googleReviews },
    contactLinks.whatsapp ? { label: "WhatsApp", href: contactLinks.whatsapp } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <footer className="relative z-10 border-t border-line bg-ivory">
      <div className="container-luxe grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <Link href="/" aria-label={`${business.name} — home`} className="tap-target">
            <Wordmark />
          </Link>
          <p className="mt-10 font-display text-[2.1rem] leading-[1.1] font-light text-ink md:text-[2.6rem]">
            {siteCopy.footerLine[0]}
            <br />
            <em className="text-gold-ink">{siteCopy.footerLine[1]}</em>
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow">Visit</h2>
          <address className="mt-5 text-[0.95rem] leading-7 text-muted not-italic">
            {business.address.street}, {business.address.locality}
            <br />
            {business.address.region} {business.address.postalCode}
          </address>
          <a href={contactLinks.tel} className="link-underline tap-target mt-2 font-display text-2xl tracking-[0.05em] text-ink">
            {business.phone.display}
          </a>
          <p className="mt-4">
            <a href={contactLinks.directions} target="_blank" rel="noopener noreferrer" className="link-underline tap-target text-sm text-ink">
              Get directions
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-3">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline tap-target text-[0.95rem] text-ink">
                  {item.longLabel ?? item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="eyebrow">Follow</h2>
          <ul className="mt-3">
            {social.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline tap-target text-[0.95rem] text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-luxe flex flex-col gap-3 border-t border-line py-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {business.name}, {business.address.locality}, {business.address.region}.
        </p>
        <p className="tracking-[0.2em] uppercase">{siteCopy.tagline}</p>
      </div>
    </footer>
  );
}
