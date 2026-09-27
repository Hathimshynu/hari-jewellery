import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

const icons = {
  arrow: ArrowIcon,
  phone: PhoneIcon,
  pin: PinIcon,
  whatsapp: WhatsAppIcon,
} as const;

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  icon?: keyof typeof icons;
  className?: string;
  ariaLabel?: string;
}

/**
 * Call-to-action link. Internal routes use next/link (and get the page
 * transition); tel:, maps and other external URLs render a plain anchor.
 */
export function ButtonLink({ href, children, variant = "outline", icon, className = "", ariaLabel }: ButtonLinkProps) {
  const Icon = icon ? icons[icon] : null;
  const external = /^https?:\/\//.test(href);
  const classes = `btn btn--${variant} ${className}`;
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {Icon ? <Icon className="btn__icon" /> : null}
    </>
  );
  const shared = {
    className: classes,
    "aria-label": ariaLabel,
    "data-magnetic": variant === "text" ? undefined : true,
  };

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...shared}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} {...shared} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {content}
    </a>
  );
}
