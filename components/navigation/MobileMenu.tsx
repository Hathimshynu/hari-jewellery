"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { business, contactLinks, formattedAddress } from "@/lib/constants/business";
import { primaryNav } from "@/lib/constants/site";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { lockScroll } from "@/lib/utils/smoothScroll";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}

const ease = [0.76, 0, 0.24, 1] as const;

export default function MobileMenu({ open, onClose, isActive }: MobileMenuProps) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const first = panel.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      // Keep focus inside the dialog (the header toggle stays reachable).
      const focusables = [
        document.querySelector<HTMLElement>(".menu-toggle"),
        ...panel.current.querySelectorAll<HTMLElement>("a"),
      ].filter((el): el is HTMLElement => Boolean(el));
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ivory px-6 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.55, ease, delay: 0.1 } }}
          transition={{ duration: reduce ? 0.2 : 0.7, ease }}
        >
          <nav aria-label="Mobile" className="flex-1">
            <ul className="space-y-1">
              {[{ label: "Home", href: "/" }, ...primaryNav].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={reduce ? undefined : { y: "110%", transition: { duration: 0.35, ease } }}
                    transition={{ duration: 0.8, ease, delay: reduce ? 0 : 0.18 + i * 0.055 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive(item.href) && item.href !== "/" ? "page" : undefined}
                      className="flex items-baseline gap-4 min-h-11 py-1 font-display text-[clamp(1.9rem,8.5vw,2.6rem)] leading-[1.05] font-light tracking-[0.02em] text-ink uppercase"
                    >
                      <span className="text-[0.7rem] font-sans font-semibold tracking-[0.2em] text-gold-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {"longLabel" in item && item.longLabel ? item.longLabel : item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="mt-6 space-y-4 border-t border-line pt-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 }}
          >
            <div className="grid grid-cols-2 gap-2">
              <a href={contactLinks.tel} className="btn btn--solid" aria-label={`Call ${business.name} on ${business.phone.display}`}>
                <span className="btn__label">Call</span>
                <PhoneIcon className="btn__icon" />
              </a>
              <a href={contactLinks.directions} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                <span className="btn__label">Directions</span>
                <PinIcon className="btn__icon" />
              </a>
              {contactLinks.whatsapp ? (
                <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--outline col-span-2">
                  <span className="btn__label">WhatsApp</span>
                  <WhatsAppIcon className="btn__icon" />
                </a>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-muted-strong">
              <a href={contactLinks.tel} className="font-display text-xl tracking-[0.05em] text-ink">
                {business.phone.display}
              </a>
              <br />
              {formattedAddress.singleLine}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
