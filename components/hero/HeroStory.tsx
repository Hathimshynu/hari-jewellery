import type { CSSProperties, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { business } from "@/lib/constants/business";
import { jewelleryAssets } from "@/lib/constants/jewellery";
import type { HeroVideoSource } from "@/lib/utils/assets";
import { HeroPoster } from "./HeroPoster";
import { HeroVideo } from "./HeroVideo";
import { StoryDirector } from "./StoryDirector";

const delay = (d: string) => ({ "--d": d }) as CSSProperties;

export const STORY_CHAPTERS = ["Craft", "Detail", "Precision", "Brilliance", "Heritage"] as const;

function Chapter({
  index,
  chapter,
  className,
  lines,
  copy,
  children,
}: {
  index: number;
  /** Which of the five STORY_CHAPTERS this text belongs to (1-based). */
  chapter: number;
  className: string;
  lines: ReactNode[];
  copy?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`story__scene ${className}`} data-scene={index}>
      <div className="scene-block">
        <p className="eyebrow mb-5" data-scene-copy>
          {String(chapter).padStart(2, "0")} — {STORY_CHAPTERS[chapter - 1]}
        </p>
        <h2 className="display display-chapter">
          {lines.map((line, i) => (
            <span key={i} className="mask-line" data-scene-line>
              <span>
                {line}
                {i < lines.length - 1 ? " " : null}
              </span>
            </span>
          ))}
        </h2>
        {copy ? (
          <p className="lead mt-6 max-w-sm text-muted-strong" data-scene-copy>
            {copy}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/**
 * The opening film: one sticky viewport in which the jewellery (live 3D, or
 * the poster/video fallback) moves while five chapters of type rise and fall.
 * Reduced-motion visitors get the same chapters as a simple stacked page.
 */
export function HeroStory({ videoSources }: { videoSources: HeroVideoSource[] }) {
  return (
    <section id="story" className="story" aria-label={`${business.name} — an introduction`}>
      <div className="story__viewport">
        <HeroPoster />
        {videoSources.length ? <HeroVideo sources={videoSources} poster={jewelleryAssets.hero.necklace.src} /> : null}

        <div className="story__scene story__scene--hero" data-scene="0">
          <div className="hero-title">
            {/* Display title (visual). The page's single H1 is the line in the hero foot. */}
            <p className="flex flex-col items-center">
              <span className="mb-5 block md:mb-7" data-hero-fade>
                <span className="eyebrow hero-fade block" style={delay("0.05s")}>
                  {business.name} · {business.address.locality}
                </span>
              </span>
              <span className="mask-line hero-settle display hero-line-1" data-hero-line="1">
                <span style={delay("0.08s")}>Timeless </span>
              </span>
              <span className="mask-line hero-settle hero-line-2" data-hero-line="2">
                <span style={delay("0.18s")}>Craftsmanship</span>
              </span>
            </p>
          </div>

          <div className="hero-foot" data-hero-fade>
            <h1 className="hero-fade hero-h1" style={delay("0.4s")}>
              Timeless Jewellery,
              <br />
              <em>Crafted for Every Celebration</em>
            </h1>
            <div className="hero-fade flex items-center gap-6" style={delay("0.5s")}>
              <span className="scroll-cue" aria-hidden="true">
                <span className="scroll-cue__label">Scroll to discover</span>
                <span className="scroll-cue__track">
                  <span className="scroll-cue__line" />
                </span>
              </span>
              <ButtonLink href="#jewellery-story" variant="outline" icon="arrow" className="max-md:hidden">
                Explore collections
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* 03 MACRO — the camera settles on the pendant while light passes over it. */}
        <Chapter
          index={1}
          chapter={2}
          className="scene-1"
          lines={["Every detail", <em key="e">matters</em>]}
          copy="From the curve of a petal to the setting of a single stone."
        />
        {/* 04 ORBIT — the necklace moves right, type enters from the left. */}
        <Chapter
          index={2}
          chapter={3}
          className="scene-2"
          lines={["Crafted", <em key="e">with precision</em>]}
          copy="Light, line and proportion — considered in every piece we bring to Kappukadu."
        />
        {/* 05 TRANSITION — the ring rises into focus. */}
        <Chapter
          index={3}
          chapter={4}
          className="scene-3"
          lines={["Brilliance,", <em key="e">held in gold</em>]}
          copy="A single stone, lifted into the light."
        />
        {/* 06 COLLECTION — jhumkas, then the bangle, then the invitation. */}
        <Chapter index={4} chapter={5} className="scene-4" lines={["Explore", <em key="e">the collection</em>]}>
          <div className="mt-8" data-scene-copy>
            <ButtonLink href="#jewellery-story" variant="solid" icon="arrow">
              Explore the collection
            </ButtonLink>
          </div>
        </Chapter>

        <div className="story-rail" aria-hidden="true">
          <span className="story-rail__track">
            <span className="story-rail__fill" data-story-fill />
          </span>
          <ol className="story-chapters">
            {STORY_CHAPTERS.map((label, i) => (
              <li key={label} data-chapter={i + 1} data-active={i === 0 || undefined}>
                <span className="story-chapters__index">{String(i + 1).padStart(2, "0")}</span>
                <span className="story-chapters__label">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <StoryDirector />
    </section>
  );
}
