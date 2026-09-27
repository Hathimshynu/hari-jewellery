import Link from "next/link";
import type { CSSProperties } from "react";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD (inner pages only). */
export function Breadcrumbs({ crumb, className = "", style }: { crumb: { name: string; path: string }; className?: string; style?: CSSProperties }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, crumb])} />
      <nav aria-label="Breadcrumb" className={className} style={style}>
        <ol className="flex flex-wrap items-center gap-x-3 text-[0.7rem] font-semibold tracking-[0.2em] text-muted-strong uppercase">
          <li>
            <Link href="/" className="link-underline tap-target">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gold-ink">
            {crumb.name}
          </li>
        </ol>
      </nav>
    </>
  );
}
