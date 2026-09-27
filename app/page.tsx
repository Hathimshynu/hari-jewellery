import type { Metadata } from "next";
import { JewelleryStage } from "@/components/3d/JewelleryStage";
import { HeroStory } from "@/components/hero/HeroStory";
import { JewelleryReveal } from "@/components/jewellery/JewelleryReveal";
import { AboutSection } from "@/components/sections/AboutSection";
import { BridalExperience } from "@/components/sections/BridalExperience";
import { CollectionFeature } from "@/components/sections/CollectionFeature";
import { ContactSection } from "@/components/sections/ContactSection";
import { Craftsmanship } from "@/components/sections/Craftsmanship";
import { FinalCta } from "@/components/sections/FinalCta";
import { GoldRate } from "@/components/sections/GoldRate";
import { GoogleRating } from "@/components/sections/GoogleRating";
import { JewelleryStory } from "@/components/sections/JewelleryStory";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { WeddingGallery } from "@/components/sections/WeddingGallery";
import { collections } from "@/lib/constants/collections";
import { buildMetadata } from "@/lib/seo/metadata";
import { getHeroVideoSources, getModelManifest, getSequenceSources } from "@/lib/utils/assets";

export const metadata: Metadata = buildMetadata({
  title: "Sri Hari Jewellers | Gold & Bridal Jewellery in Kappukadu",
  description:
    "Discover traditional, contemporary and bridal jewellery at Sri Hari Jewellers in Kappukadu, Tamil Nadu. Explore timeless gold jewellery crafted for special moments.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  const models = getModelManifest();
  const videoSources = getHeroVideoSources();
  const sequences = getSequenceSources();

  return (
    <>
      <JewelleryStage models={models} sequences={sequences} />
      <HeroStory videoSources={videoSources} />
      <GoldRate />
      <JewelleryReveal />
      <JewelleryStory />
      <CollectionFeature collection={collections.contemporary} index={1} layout="image-right" />
      <CollectionFeature collection={collections.traditional} index={2} layout="image-left" />
      <BridalExperience index={3} />
      <ProductShowcase
        scene="home"
        id="signature-pieces"
        index={4}
        eyebrow="Signature pieces"
        titleLines={["Turn it", "in the light"]}
        intro="Choose a piece and turn it in the studio light — then see it in person at our store in Kappukadu."
      />
      <Craftsmanship index={5} />
      <WeddingGallery index={6} />
      <CollectionFeature collection={collections.everyday} index={7} layout="centered" />
      <AboutSection />
      <GoogleRating />
      <ContactSection />
      <FinalCta />
    </>
  );
}
