"use client";

import { CookieBanner } from "@portfolio/ui";

import { useCookieConsent } from "@/hooks/useCookieConsent";

import type { CookieConsentProps } from "./CookieConsent.types";

/**
 * CookieConsent — app-level bridge between the {@link useCookieConsent} state and
 * the presentational `CookieBanner` organism: it feeds the persisted consent in
 * and wires the accept / reject / save callbacks back to the provider. The
 * banner's own `open` flag gates its visibility.
 */
export function CookieConsent({
  copy,
  categories,
  privacyHref,
}: CookieConsentProps) {
  const {
    consent,
    isBannerOpen,
    bannerView,
    acceptAll,
    rejectAll,
    savePreferences,
  } = useCookieConsent();

  return (
    <CookieBanner
      open={isBannerOpen}
      initialView={bannerView}
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
