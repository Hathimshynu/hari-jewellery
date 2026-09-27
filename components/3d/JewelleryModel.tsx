"use client";

import { createContext, useContext, type ReactNode } from "react";
import { emptyModelManifest, modelSizes, type JewelKind, type ModelManifest } from "@/lib/constants/models";
import { FinePendant } from "./FinePendant";
import { GoldBangle } from "./GoldBangle";
import { GoldNecklace } from "./GoldNecklace";
import { GoldRing } from "./GoldRing";
import { JhumkaEarrings } from "./JhumkaEarrings";
import type { GoldVariant } from "./materials";
import { ModelLoader } from "./ModelLoader";
import { StudEarrings } from "./StudEarrings";

const ModelsContext = createContext<ModelManifest>(emptyModelManifest);

/** Makes the server-detected model manifest available to every piece in a canvas. */
export function ModelsProvider({ models, children }: { models: ModelManifest; children: ReactNode }) {
  return <ModelsContext.Provider value={models}>{children}</ModelsContext.Provider>;
}

interface JewelleryModelProps {
  kind: JewelKind;
  variant?: GoldVariant;
  /** Geometry detail for procedural pieces (device-dependent). */
  detail?: number;
}

function ProceduralPiece({ kind, variant, detail }: Required<JewelleryModelProps>) {
  switch (kind) {
    case "necklace":
      return <GoldNecklace detail={detail} variant={variant} />;
    case "ring":
      return <GoldRing variant={variant} />;
    case "earrings":
      return <JhumkaEarrings variant={variant} />;
    case "bangle":
      return <GoldBangle detail={detail} variant={variant} />;
    case "pendant":
      return <FinePendant detail={detail} variant={variant} />;
    case "studs":
      return <StudEarrings variant={variant} />;
  }
}

/**
 * One jewellery piece: the supplied .glb from /public/models when available,
 * otherwise the procedural stand-in. Missing or broken files never crash.
 */
export function JewelleryModel({ kind, variant = "yellow", detail = 1 }: JewelleryModelProps) {
  const models = useContext(ModelsContext);
  const procedural = <ProceduralPiece kind={kind} variant={variant} detail={detail} />;
  const url = models[kind];
  if (!url) return procedural;
  return <ModelLoader url={url} size={modelSizes[kind]} goldVariant={variant} fallback={procedural} />;
}
