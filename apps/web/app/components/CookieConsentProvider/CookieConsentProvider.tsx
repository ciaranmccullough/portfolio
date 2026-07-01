"use client";

import type { CookiePreferences } from "@portfolio/ui";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ALL_GRANTED,
  NECESSARY_ONLY,
  clearConsent,
  readConsent,
  writeConsent,
} from "@/lib/cookieConsent";

import type {
  CookieConsentContextValue,
  CookieConsentProviderProps,
} from "./CookieConsentProvider.types";

/**
 * Context carrying the app-wide cookie-consent state. `null` when read outside a
 * provider — {@link useCookieConsent} turns that into a helpful error.
 */
export const CookieConsentContext =
  createContext<CookieConsentContextValue | null>(null);

/**
 * CookieConsentProvider — owns the consent state and shares it across the app.
 *
 * The stored choice is hydrated from `localStorage` after mount (client-only, so
 * there's no SSR/hydration mismatch); if nothing is stored the banner opens for a
 * first-time decision. Accept / reject / save persist through the localStorage
 * helpers and close the banner; `openBanner` brings it back (footer "Cookie
 * settings"); `reset` forgets the choice and re-opens it.
 */
export function CookieConsentProvider({
  children,
}: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) setConsent(stored);
    else setIsBannerOpen(true);
  }, []);

  const persist = useCallback((preferences: CookiePreferences) => {
    setConsent(writeConsent(preferences));
    setIsBannerOpen(false);
  }, []);

  const acceptAll = useCallback(() => persist(ALL_GRANTED), [persist]);
  const rejectAll = useCallback(() => persist(NECESSARY_ONLY), [persist]);
  const savePreferences = useCallback(
    (preferences: CookiePreferences) => persist(preferences),
    [persist],
  );
  const openBanner = useCallback(() => setIsBannerOpen(true), []);
  const closeBanner = useCallback(() => setIsBannerOpen(false), []);
  const reset = useCallback(() => {
    clearConsent();
    setConsent(null);
    setIsBannerOpen(true);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      hasConsented: consent !== null,
      isBannerOpen,
      acceptAll,
      rejectAll,
      savePreferences,
      openBanner,
      closeBanner,
      reset,
    }),
    [
      consent,
      isBannerOpen,
      acceptAll,
      rejectAll,
      savePreferences,
      openBanner,
      closeBanner,
      reset,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
