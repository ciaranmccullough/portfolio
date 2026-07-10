import { Eyebrow, Link, Text } from "@portfolio/ui";

import { MAIN_CONTENT_ID } from "@/lib/mainContentId";

import {
  errorScreenActionClass,
  errorScreenClass,
  errorScreenMessageClass,
  errorScreenTitleClass,
} from "./ErrorScreen.styles";
import type { ErrorScreenProps } from "./ErrorScreen.types";

/**
 * ErrorScreen — a full-height fallback shown when a page's primary data can't be
 * loaded (e.g. the Contentful Hero). Presentational; copy is injected from the
 * localized dictionary. Renders its own `<main>` so it can replace the page.
 */
export function ErrorScreen({
  eyebrow,
  title,
  message,
  retryLabel,
  retryHref = "/",
}: ErrorScreenProps) {
  return (
    <main id={MAIN_CONTENT_ID} className={errorScreenClass}>
      {eyebrow ? <Eyebrow tone="orange">{eyebrow}</Eyebrow> : null}
      <Text variant="display" className={errorScreenTitleClass}>
        {title}
      </Text>
      {message ? (
        <Text variant="body" className={errorScreenMessageClass}>
          {message}
        </Text>
      ) : null}
      {retryLabel ? (
        <Link
          href={retryHref}
          variant="primary"
          className={errorScreenActionClass}
        >
          {retryLabel}
        </Link>
      ) : null}
    </main>
  );
}
