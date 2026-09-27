"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon } from "@/components/ui/Icons";
import { business, contactLinks, formattedAddress } from "@/lib/constants/business";

/**
 * Lightweight map: a static illustrated card until the visitor asks for the
 * map (or, with `autoLoad`, until it nears the viewport). No Maps SDK is
 * loaded — only Google's embeddable iframe, on demand.
 */
export function MapEmbed({ autoLoad = false }: { autoLoad?: boolean }) {
  const [load, setLoad] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoLoad || load || !container.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(container.current);
    return () => io.disconnect();
  }, [autoLoad, load]);

  return (
    <div ref={container} className="relative overflow-hidden border border-line bg-sand" style={{ aspectRatio: "4 / 3" }}>
      {load ? (
        <iframe
          src={contactLinks.mapEmbed}
          title={`Map showing ${business.name}, ${business.address.locality}`}
          className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[15%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <svg className="absolute inset-0 h-full w-full text-gold/35" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M-10 210 C 80 190, 120 120, 210 130 S 330 90, 420 60" />
              <path d="M-10 250 C 90 240, 160 200, 230 205 S 350 180, 420 150" />
              <path d="M60 -10 C 80 80, 70 160, 120 310" />
              <path d="M280 -10 C 260 90, 300 180, 270 310" />
              <path d="M-10 90 C 100 110, 200 60, 420 110" strokeDasharray="3 5" />
            </g>
          </svg>
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-ivory text-gold-ink">
            <PinIcon className="h-6 w-6" />
          </span>
          <p className="relative mt-5 font-display text-2xl text-ink">{business.name}</p>
          <p className="relative mt-2 text-sm text-muted-strong">{formattedAddress.singleLine}</p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn btn--outline bg-ivory" onClick={() => setLoad(true)}>
              <span className="btn__label">Show map</span>
            </button>
            <a href={contactLinks.directions} target="_blank" rel="noopener noreferrer" className="btn btn--text">
              <span className="btn__label">Open in Google Maps</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
