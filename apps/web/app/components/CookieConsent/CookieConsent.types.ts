import type { CookieBannerCopy, CookieCategory } from "@portfolio/ui";

/** Props for {@link CookieConsent} — the localised copy for the banner. */
export interface CookieConsentProps {
  /** User-facing strings for the banner chrome (headings, buttons, statuses). */
  copy: CookieBannerCopy;
  /** The consent categories shown in the preferences view. */
  categories: CookieCategory[];
  /** Href of the privacy policy, linked from the banner body. */
  privacyHref: string;
}
