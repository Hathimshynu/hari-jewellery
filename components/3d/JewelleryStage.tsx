"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { ImageSequence, type SequenceSources } from "@/components/hero/ImageSequence";
import type { ModelManifest } from "@/lib/constants/models";
import { detectDeviceCapability } from "@/lib/utils/deviceCapability";
import { onEngaged } from "@/lib/utils/engagement";
import { ScrollTrigger } from "@/lib/utils/gsap";
import { isRenderTier, type RenderTier } from "./quality";
import { setStageMode, stageState } from "./stageState";

// three.js, R3F and the scene are split into their own chunk and never block first paint.
const JewelleryScene = dynamic(() => import("./JewelleryScene"), { ssr: false });

class StageErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[Stage] WebGL scene unavailable, falling back to imagery.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type StageRenderer = { kind: "webgl"; tier: RenderTier } | { kind: "sequence" } | null;

interface JewelleryStageProps {
  models: ModelManifest;
  sequences: SequenceSources;
}

/**
 * The homepage's single, persistent jewellery stage, fixed behind the page.
 *
 *   poster first → first interaction → WebGL (full / optimized / light)
 *                                    → or pre-rendered image sequence (no WebGL, or too slow)
 *   reduced motion / data saver      → the poster stays; nothing else loads
 *
 * It renders only while the opening film or the closing chapter is on screen.
 */
export function JewelleryStage({ models, sequences }: JewelleryStageProps) {
  const [renderer, setRenderer] = useState<StageRenderer>(null);
  const [storyVisible, setStoryVisible] = useState(true);
  const [finaleVisible, setFinaleVisible] = useState(false);
  const hasSequence = Boolean(sequences.portrait ?? sequences.wide);

  useEffect(() => {
    const cap = detectDeviceCapability();
    let next: StageRenderer = null;
    if (isRenderTier(cap.tier)) next = { kind: "webgl", tier: cap.tier };
    else if (!cap.webgl && !cap.reducedMotion && !cap.saveData && !cap.slowConnection && hasSequence) next = { kind: "sequence" };
    if (!next) return;
    const chosen = next;
    return onEngaged(() => requestAnimationFrame(() => setRenderer(chosen)));
  }, [hasSequence]);

  useEffect(() => {
    stageState.progress = 0;
    stageState.snap = true;
    setStageMode("story");

    const triggers = [
      ScrollTrigger.create({
        trigger: "#story",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setStoryVisible(self.isActive),
      }),
      ScrollTrigger.create({
        trigger: "#finale",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          setFinaleVisible(self.isActive);
          setStageMode(self.isActive ? "finale" : "story");
        },
      }),
    ];

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      stageState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stageState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("pointermove", onPointer);
      delete document.documentElement.dataset.stage;
    };
  }, []);

  const handleReady = useCallback(() => {
    document.documentElement.dataset.stage = "ready";
  }, []);
  const handleSequenceReady = useCallback(() => {
    document.documentElement.dataset.stage = "sequence";
  }, []);
  const handleError = useCallback(() => {
    setRenderer(null);
    delete document.documentElement.dataset.stage;
  }, []);
  // A phone that cannot hold a usable frame rate hands over to the image sequence.
  const handlePerformanceFallback = useCallback(() => {
    if (!hasSequence) return;
    setRenderer((current) => (current?.kind === "webgl" && current.tier === "light" ? { kind: "sequence" } : current));
  }, [hasSequence]);

  const active = storyVisible || finaleVisible;

  return (
    <div className="stage" data-active={active || undefined} aria-hidden="true">
      {renderer?.kind === "webgl" ? (
        <StageErrorBoundary onError={handleError}>
          <JewelleryScene
            tier={renderer.tier}
            models={models}
            active={active}
            onReady={handleReady}
            onPerformanceFallback={handlePerformanceFallback}
          />
        </StageErrorBoundary>
      ) : null}
      {renderer?.kind === "sequence" ? (
        <ImageSequence sources={sequences} active={storyVisible} onReady={handleSequenceReady} />
      ) : null}
    </div>
  );
}
