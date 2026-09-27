import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="chapter flex min-h-svh items-center">
      <div className="container-luxe py-40 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display display-lg mt-6">
          This piece
          <br />
          <em>is not here</em>
        </h1>
        <p className="lead mx-auto mt-8 max-w-md">The page you were looking for may have moved. Let us take you back to the collections.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="solid" icon="arrow">
            Return home
          </ButtonLink>
          <ButtonLink href="/collections" variant="outline">
            View collections
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
