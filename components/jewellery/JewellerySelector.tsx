"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ViewerInteraction } from "@/components/3d/ModelViewer";
import { isRenderTier } from "@/components/3d/quality";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ShowcaseProduct } from "@/lib/constants/3dScenes";
import { USING_ILLUSTRATIVE_RENDERS } from "@/lib/constants/jewellery";
import type { ModelManifest } from "@/lib/constants/models";
import { useDeviceCapability } from "@/lib/hooks/useDeviceCapability";
import { onEngaged } from "@/lib/utils/engagement";

// Shares the three.js chunk with the homepage stage; loads only when needed.
const ModelViewer = dynamic(() => import("@/components/3d/ModelViewer"), { ssr: false });

export interface SelectorProduct extends ShowcaseProduct {
  /** False when the still image file has not been supplied yet. */
  imageAvailable: boolean;
}

interface JewellerySelectorProps {
  products: SelectorProduct[];
  models: ModelManifest;
  /** Heading level of the product name inside the panel. */
  headingLevel?: "h3" | "h2";
  idPrefix: string;
}

/**
 * Premium jewellery selector: choosing a piece transitions the 3D scene
 * (position, rotation, scale, camera, light) without reloading anything.
 * The HTML panel carries all content; the canvas is enhancement only.
 */
export function JewellerySelector({ products, models, headingLevel = "h3", idPrefix }: JewellerySelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const capability = useDeviceCapability();
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const interaction = useRef<ViewerInteraction>({ targetYaw: 0, pointer: { x: 0, y: 0 } });
  const drag = useRef<{ id: number; x: number } | null>(null);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);

  const active = products[activeIndex];
  const Heading = headingLevel;
  const renderTier = isRenderTier(capability?.tier) ? capability.tier : null;
  const use3d = renderTier !== null && engaged && nearby;

  useEffect(() => onEngaged(() => setEngaged(true)), []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNearby(true);
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = useCallback((index: number, focus = false) => {
    const next = (index + products.length) % products.length;
    setActiveIndex(next);
    interaction.current.targetYaw = 0;
    if (focus) tabs.current[next]?.focus();
  }, [products.length]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select(activeIndex + 1, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select(activeIndex - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(products.length - 1, true);
    }
  };

  // Mouse: drag turns the piece. Touch: a horizontal swipe changes the piece
  // (vertical page scrolling is untouched — touch-action: pan-y).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      if (use3d) drag.current = { id: e.pointerId, x: e.clientX };
    } else {
      swipe.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) select(activeIndex + (dx < 0 ? 1 : -1));
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const i = interaction.current;
    if (e.pointerType === "mouse") {
      const r = e.currentTarget.getBoundingClientRect();
      i.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      i.pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    }
    if (drag.current && drag.current.id === e.pointerId) {
      i.targetYaw += (e.clientX - drag.current.x) * 0.012;
      drag.current.x = e.clientX;
    }
  };
  const endDrag = () => {
    drag.current = null;
    swipe.current = null;
  };
  const onPointerLeave = () => {
    endDrag();
    interaction.current.pointer.x = 0;
    interaction.current.pointer.y = 0;
  };

  const panelId = `${idPrefix}-panel`;

  return (
    <div className="selector">
      <div
        ref={stage}
        className="selector__stage"
        data-viewer={use3d && viewerReady ? "ready" : undefined}
        data-cursor={use3d ? "drag" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={use3d ? onPointerMove : undefined}
        onPointerUp={onPointerUp}
        onPointerCancel={endDrag}
        onPointerLeave={onPointerLeave}
      >
        {products.map((product, i) => (
          <div key={product.id} className="selector__still" data-active={i === activeIndex || undefined} aria-hidden={i !== activeIndex}>
            {product.imageAvailable ? (
              <Image
                src={product.image.src}
                alt={i === activeIndex ? product.image.alt : ""}
                fill
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="object-cover"
              />
            ) : null}
          </div>
        ))}
        {use3d && renderTier ? (
          <div className="selector__canvas">
            <ModelViewer
              products={products}
              activeId={active.id}
              tier={renderTier}
              models={models}
              active={visible}
              interaction={interaction}
              onReady={() => setViewerReady(true)}
            />
          </div>
        ) : null}
        {products.length > 1 ? (
          <p className="selector__hint selector__hint--touch" aria-hidden="true">
            Swipe to browse
          </p>
        ) : null}
        {use3d && viewerReady ? (
          <p className="selector__hint selector__hint--mouse" aria-hidden="true">
            Drag to turn
          </p>
        ) : USING_ILLUSTRATIVE_RENDERS ? (
          <span className="illustrative-tag">Illustrative render</span>
        ) : null}
      </div>

      <div className="selector__panel">
        <div role="tablist" aria-label="Choose a piece" className="selector__tabs" hidden={products.length < 2}>
          {products.map((product, i) => (
            <button
              key={product.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${product.id}`}
              aria-selected={i === activeIndex}
              aria-controls={panelId}
              tabIndex={i === activeIndex ? 0 : -1}
              className="selector__tab"
              onClick={() => select(i)}
              onKeyDown={onTabKey}
            >
              <span className="selector__tab-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="selector__tab-label">{product.name}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={panelId} aria-labelledby={`${idPrefix}-tab-${active.id}`} className="selector__details" aria-live="polite">
          <p className="eyebrow">{active.eyebrow}</p>
          <Heading className="mt-4 font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-none font-light tracking-[0.01em] text-ink uppercase">
            {active.name}
          </Heading>
          <p className="lead mt-5 max-w-sm">{active.description}</p>
          <div className="mt-8">
            <ButtonLink href={active.href} variant="text" icon="arrow">
              {active.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
