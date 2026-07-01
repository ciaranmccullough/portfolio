import type { CookieBannerView, CookiePreferences } from "@portfolio/ui";
import type { ReactNode } from "react";

/** Shared cookie-consent state exposed through {@link useCookieConsent}. */
export interface CookieConsentContextValue {
  /** Persisted preferences, or `null` until the user makes a choice. */
  consent: CookiePreferences | null;
  /** Whether a remembered choice exists in this browser. */
  hasConsented: boolean;
  /** Whether the consent banner is currently visible. */
  isBannerOpen: boolean;
  /** Which view the banner should open in (summary vs. preferences). */
  bannerView: CookieBannerView;
  /** Accept every category, persist, and close the banner. */
  acceptAll: () => void;
  /** Reject all non-essential categories, persist, and close the banner. */
  rejectAll: () => void;
  /** Persist an explicit set of preferences and close the banner. */
  savePreferences: (preferences: CookiePreferences) => void;
  /** Re-open the banner on the summary view. */
  openBanner: () => void;
  /**
   * Re-open the banner straight on the manage-preferences view (e.g. the footer
   * "Cookie settings" link).
   */
  openPreferences: () => void;
  /** Close the banner without changing the stored choice. */
  closeBanner: () => void;
  /** Clear the stored choice and re-open the banner. */
  reset: () => void;
}

/** Props for {@link CookieConsentProvider}. */
export interface CookieConsentProviderProps {
  children: ReactNode;
}
