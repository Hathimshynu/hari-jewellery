import { ButtonLink } from "@/components/ui/ButtonLink";
import { StarIcon } from "@/components/ui/Icons";
import { business, contactLinks } from "@/lib/constants/business";

export function RatingStars({ value, className = "h-5 w-5" }: { value: number; className?: string }) {
  return (
    <span className="flex gap-1.5 text-gold" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className={className} fillLevel={Math.max(0, Math.min(1, value - i))} />
      ))}
    </span>
  );
}

export function GoogleRating() {
  const { value, count, best } = business.rating;
  return (
    <section className="chapter border-t border-line" aria-labelledby="rating-title">
      <div className="container-luxe flex flex-col items-center py-24 text-center md:py-32" data-reveal="stagger">
        <h2 id="rating-title" className="eyebrow" data-reveal-item>
          Rated on Google
        </h2>
        <p className="mt-8 flex flex-col items-center" data-reveal-item>
          <span className="font-display text-[clamp(5.5rem,12vw,9.5rem)] leading-[0.85] font-light text-ink">
            {value.toFixed(1)}
          </span>
          <span className="sr-only">
            {value} out of {best} stars from {count} Google reviews
          </span>
        </p>
        <div className="mt-6" data-reveal-item>
          <RatingStars value={value} className="h-6 w-6" />
        </div>
        <p className="mt-5 text-[0.8rem] font-semibold tracking-[0.24em] text-muted-strong uppercase" aria-hidden="true" data-reveal-item>
          {count} Google reviews
        </p>
        <div className="mt-10" data-reveal-item>
          <ButtonLink href={contactLinks.googleReviews} variant="outline" icon="arrow">
            View Google reviews
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
