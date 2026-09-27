import { MaskLines } from "@/components/ui/Typography";
import { business, formattedAddress } from "@/lib/constants/business";
import { siteCopy } from "@/lib/constants/site";
import { ContactActions } from "./ContactActions";
import { GoldMotes } from "./GoldMotes";

/** Closing call to action for inner pages. */
export function VisitBand({ title = siteCopy.tagline }: { title?: string }) {
  const [first, ...rest] = title.split(". ");
  return (
    <section className="chapter relative overflow-hidden border-t border-line bg-sand" aria-labelledby="visit-title">
      <GoldMotes count={12} seed={21} />
      <div className="container-luxe relative grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow" data-reveal="fade">
            Visit {business.name}
          </p>
          <MaskLines
            id="visit-title"
            className="display display-lg mt-7"
            lines={rest.length ? [`${first}.`, <em key="e">{rest.join(". ")}</em>] : [title]}
          />
        </div>
        <div className="lg:col-span-5" data-reveal="fade">
          <p className="text-[0.95rem] leading-7 text-muted-strong">
            {formattedAddress.singleLine}
            <br />
            Phone: {business.phone.display}
          </p>
          <div className="mt-8">
            <ContactActions />
          </div>
        </div>
      </div>
    </section>
  );
}
