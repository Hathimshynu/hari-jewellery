import { MaskLines } from "@/components/ui/Typography";
import { business, contactLinks } from "@/lib/constants/business";
import { formatRateDate, formatRupees, goldRate, hasPublishedGoldRate } from "@/lib/constants/goldRate";
import { siteCopy } from "@/lib/constants/site";

function RateColumn({ purity, value }: { purity: string; value: number | null }) {
  return (
    <div className="flex flex-col" data-reveal-item>
      <p className="eyebrow">{purity} Gold</p>
      {value !== null ? (
        <p className="mt-5 font-display text-[clamp(2.8rem,5.5vw,5rem)] leading-none font-light text-ink">
          <span className="mr-2 align-top text-[0.45em] text-gold-ink">₹</span>
          {formatRupees(value)}
        </p>
      ) : (
        <p className="mt-5 font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-none font-light text-ink italic">
          On request
        </p>
      )}
      <p className="mt-3 text-[0.8rem] tracking-[0.18em] text-muted uppercase">per 10 g</p>
    </div>
  );
}

export function GoldRate() {
  const published = hasPublishedGoldRate(goldRate) ? goldRate : null;

  return (
    <section id="gold-rate" className="chapter border-t border-line" aria-labelledby="gold-rate-title">
      <div className="container-luxe grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal="fade">
            {business.address.locality} · Daily rate
          </p>
          <MaskLines
            id="gold-rate-title"
            className="display display-md mt-6"
            lines={["Today's", <em key="e">gold rate</em>]}
          />
          <p className="lead mt-8 max-w-md" data-reveal="fade">
            {siteCopy.positioning}
          </p>
        </div>

        <div className="lg:col-span-7 lg:pl-10">
          <div
            className="grid gap-12 border-y border-line py-12 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-line"
            data-reveal="stagger"
          >
            <div className="sm:pr-10">
              <RateColumn purity="24K" value={goldRate.gold24k} />
            </div>
            <div className="sm:pl-10">
              <RateColumn purity="22K" value={goldRate.gold22k} />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
            {published ? (
              <>
                <p>
                  Updated: <time dateTime={published.date}>{formatRateDate(published.date)}</time>
                </p>
                <p>Rates are indicative. Please confirm the final price in store.</p>
              </>
            ) : (
              <p>
                Gold rates change daily. Call{" "}
                <a href={contactLinks.tel} className="link-underline font-semibold text-ink">
                  {business.phone.display}
                </a>{" "}
                for today&apos;s 22K and 24K rate.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
