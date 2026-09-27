import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MaskLines } from "@/components/ui/Typography";
import { business, contactLinks } from "@/lib/constants/business";
import { jewelleryAssets } from "@/lib/constants/jewellery";

/**
 * The closing frame. Its background is transparent so the homepage's WebGL
 * stage shows the necklace beside the type; without WebGL a still is shown.
 */
export function FinalCta() {
  return (
    <section id="finale" className="finale" aria-labelledby="finale-title">
      <div className="finale__fallback" aria-hidden="true">
        <Image src={jewelleryAssets.bridal.set01.src} alt="" fill sizes="(min-aspect-ratio: 17/20) 50vw, 100vw" className="object-contain" />
      </div>
      <div className="container-luxe relative">
        <div className="finale__copy">
          <p className="eyebrow" data-reveal="fade">
            {business.name} · {business.address.locality}
          </p>
          <MaskLines
            id="finale-title"
            className="display display-lg mt-7"
            lines={["Celebrate today.", <em key="e">Treasure forever.</em>]}
          />
          <p className="lead mt-8 max-w-md text-muted-strong" data-reveal="fade">
            Visit {business.name}, {business.address.locality} and discover jewellery made for your moments.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="fade">
            <ButtonLink href={contactLinks.tel} variant="solid" icon="phone">
              Call {business.phone.display}
            </ButtonLink>
            <ButtonLink href={contactLinks.directions} variant="outline" icon="pin">
              Get directions
            </ButtonLink>
            <ButtonLink href="/collections" variant="text" icon="arrow">
              Explore collections
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
