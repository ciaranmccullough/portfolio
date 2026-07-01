import { Eyebrow, Link, Text } from "@portfolio/ui";
import NextLink from "next/link";

import {
  legalBackClass,
  legalMainClass,
  legalTitleClass,
} from "./LegalPage.styles";
import type { LegalPageProps } from "./LegalPage.types";

/**
 * LegalPage — the shared layout for the Terms and Privacy routes: an eyebrow, a
 * title, the page body (`children` — Contentful Rich Text or the placeholder
 * fallback) and a link back home. Static and presentational.
 */
export function LegalPage({
  eyebrow,
  title,
  backLabel,
  backHref,
  children,
}: LegalPageProps) {
  return (
    <main className={legalMainClass}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Text as="h1" variant="h1" className={legalTitleClass}>
        {title}
      </Text>
      {children}
      <Link
        as={NextLink}
        href={backHref}
        variant="nav"
        className={legalBackClass}
      >
        {backLabel}
      </Link>
    </main>
  );
}
