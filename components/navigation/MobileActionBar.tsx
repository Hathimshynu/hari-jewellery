import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { business, contactLinks } from "@/lib/constants/business";

/**
 * Compact fixed action bar for phones and tablets: call and directions are
 * always one tap away. It reserves its own space (see --action-bar in
 * globals.css) so it never covers content, respects the iPhone home
 * indicator, and sits beneath the menu overlay. WhatsApp appears only once
 * the number is confirmed in lib/constants/business.ts.
 */
export function MobileActionBar() {
  return (
    <nav aria-label="Quick contact" className="action-bar lg:hidden">
      <a href={contactLinks.tel} className="action-bar__item action-bar__item--primary" aria-label={`Call ${business.name} on ${business.phone.display}`}>
        <PhoneIcon className="h-5 w-5" />
        <span>Call</span>
      </a>
      {contactLinks.whatsapp ? (
        <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="action-bar__item">
          <WhatsAppIcon className="h-5 w-5" />
          <span>WhatsApp</span>
        </a>
      ) : null}
      <a href={contactLinks.directions} target="_blank" rel="noopener noreferrer" className="action-bar__item">
        <PinIcon className="h-5 w-5" />
        <span>Directions</span>
      </a>
    </nav>
  );
}
