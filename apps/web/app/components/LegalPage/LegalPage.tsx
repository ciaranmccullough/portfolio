import { Eyebrow, Link, Text } from "@portfolio/ui";
import NextLink from "next/link";

import {
  legalBackClass,
  legalBodyClass,
  legalLeadClass,
  legalMainClass,
  legalMetaClass,
  legalTitleClass,
} from "./LegalPage.styles";
import type { LegalPageProps } from "./LegalPage.types";

/**
 * LegalPage — the shared layout for the Terms and Privacy routes. Static (no
 * client state): an eyebrow, title, "last updated" line, lead and body
 * paragraphs, and a link back home. Content is placeholder for now and injected
 * from the localised dictionary.
 */
export function LegalPage({
  eyebrow,
  title,
  updatedLabel,
  updatedValue,
  lead,
  body,
  backLabel,
  backHref,
}: LegalPageProps) {
  return (
    <main className={legalMainClass}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Text as="h1" variant="h1" className={legalTitleClass}>
        {title}
      </Text>
      <p className={legalMetaClass}>
        {updatedLabel}: {updatedValue}
      </p>
      <Text className={legalLeadClass}>{lead}</Text>
      <div className={legalBodyClass}>
        {body.map((paragraph, index) => (
          <Text key={index}>{paragraph}</Text>
        ))}
      </div>
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
