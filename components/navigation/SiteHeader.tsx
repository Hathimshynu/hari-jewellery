"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { business, contactLinks } from "@/lib/constants/business";
import { primaryNav } from "@/lib/constants/site";

// The overlay (and Framer Motion) only loads once someone opens the menu.
const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });
const preloadMenu = () => void import("./MobileMenu");

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark className="h-8 w-8 shrink-0 text-gold" />
      <span className="flex flex-col leading-none">
        <span className={`font-display tracking-[0.22em] text-ink ${compact ? "text-[1.05rem]" : "text-[1.2rem]"}`}>
          SRI HARI
        </span>
        <span className="mt-1 text-[0.55rem] font-semibold tracking-[0.46em] text-muted">JEWELLERS</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuRequested, setMenuRequested] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header" data-scrolled={scrolled || undefined}>
        <div className="site-header__inner">
          <Link href="/" aria-label={`${business.name} — home`} className="tap-target relative z-[2]">
            <Wordmark compact={scrolled} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a href={contactLinks.tel} className="hidden text-right lg:block" data-magnetic>
            <span className="block text-[0.6rem] font-semibold tracking-[0.32em] text-gold-ink uppercase">Call us</span>
            <span className="mt-1 block font-display text-[1.2rem] tracking-[0.06em] text-ink">
              {business.phone.display}
            </span>
          </a>

          <button
            type="button"
            className="menu-toggle lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onPointerEnter={preloadMenu}
            onTouchStart={preloadMenu}
            onClick={() => {
              setMenuRequested(true);
              setOpen((v) => !v);
            }}
          >
            <span className="menu-toggle__label">{open ? "Close" : "Menu"}</span>
            <span className="menu-toggle__icon" data-open={open || undefined} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>
      {menuRequested ? <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} /> : null}
    </>
  );
}
