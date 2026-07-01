"use client";

import { CookieBanner } from "@portfolio/ui";

import { useCookieConsent } from "@/hooks/useCookieConsent";

import type { CookieConsentProps } from "./CookieConsent.types";

/**
 * CookieConsent — app-level bridge between the {@link useCookieConsent} state and
 * the presentational `CookieBanner` organism. Kept always-mounted (the banner's
 * `open` flag gates its own visibility) so the confirmation status pill survives
 * the banner collapsing after a choice.
 */
export function CookieConsent({
  copy,
  categories,
  privacyHref,
}: CookieConsentProps) {
  const { consent, isBannerOpen, acceptAll, rejectAll, savePreferences } =
    useCookieConsent();

  return (
    <CookieBanner
      open={isBannerOpen}
      preferences={consent ?? undefined}
      categories={categories}
      copy={copy}
      privacyHref={privacyHref}
      onAcceptAll={acceptAll}
      onRejectAll={rejectAll}
      onSavePreferences={savePreferences}
    />
  );
}
