import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.6 3.8h2.6l1.4 4-1.9 1.3a11 11 0 0 0 6.2 6.2l1.3-1.9 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 6a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
      <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5l.9 2-.6.8a5 5 0 0 0 2.3 2.2l.8-.6 2 .9v.5c0 .3 0 .6-.5.8-1.8.9-6.6-2.8-6.2-6.1Z" />
    </svg>
  );
}

export function StarIcon({ fillLevel = 1, ...props }: IconProps & { fillLevel?: number }) {
  const id = `star-${Math.round(fillLevel * 100)}`;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fillLevel * 100}%`} stopColor="currentColor" />
          <stop offset={`${fillLevel * 100}%`} stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <path
        d="m12 3.2 2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9-4.4-4.1 6-.8Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}
