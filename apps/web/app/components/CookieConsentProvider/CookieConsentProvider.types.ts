import type { CookiePreferences } from "@portfolio/ui";
import type { ReactNode } from "react";

/** Shared cookie-consent state exposed through {@link useCookieConsent}. */
export interface CookieConsentContextValue {
  /** Persisted preferences, or `null` until the user makes a choice. */
  consent: CookiePreferences | null;
  /** Whether a remembered choice exists in this browser. */
  hasConsented: boolean;
  /** Whether the consent banner is currently visible. */
  isBannerOpen: boolean;
  /** Accept every category, persist, and close the banner. */
  acceptAll: () => void;
  /** Reject all non-essential categories, persist, and close the banner. */
  rejectAll: () => void;
  /** Persist an explicit set of preferences and close the banner. */
  savePreferences: (preferences: CookiePreferences) => void;
  /** Re-open the banner (e.g. from the footer "Cookie settings" link). */
  openBanner: () => void;
  /** Close the banner without changing the stored choice. */
  closeBanner: () => void;
  /** Clear the stored choice and re-open the banner. */
  reset: () => void;
}

/** Props for {@link CookieConsentProvider}. */
export interface CookieConsentProviderProps {
  children: ReactNode;
}
