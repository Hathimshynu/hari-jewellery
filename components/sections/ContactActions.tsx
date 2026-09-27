import { ButtonLink } from "@/components/ui/ButtonLink";
import { business, contactLinks } from "@/lib/constants/business";

/** Call / directions / WhatsApp (only when the number is confirmed on WhatsApp). */
export function ContactActions({ callLabel = "Call now" }: { callLabel?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <ButtonLink href={contactLinks.tel} variant="solid" icon="phone" ariaLabel={`Call ${business.name} on ${business.phone.display}`}>
        {callLabel}
      </ButtonLink>
      <ButtonLink href={contactLinks.directions} variant="outline" icon="pin">
        Get directions
      </ButtonLink>
      {contactLinks.whatsapp ? (
        <ButtonLink href={contactLinks.whatsapp} variant="outline" icon="whatsapp">
          WhatsApp
        </ButtonLink>
      ) : null}
    </div>
  );
}
