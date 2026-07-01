/** The footer's utility links. */
export interface SiteFooterLinks {
  /** Privacy-policy link label + href. */
  privacyLabel: string;
  privacyHref: string;
  /** Terms link label + href. */
  termsLabel: string;
  termsHref: string;
  /** Label for the button that re-opens the cookie banner. */
  cookieSettingsLabel: string;
}

/** Props for {@link SiteFooter}. */
export interface SiteFooterProps {
  /**
   * Colophon template containing a `{year}` placeholder, which is replaced with
   * the live copyright year on the client.
   */
  colophon: string;
  /** Privacy / Terms links and the "Cookie settings" re-open control. */
  links: SiteFooterLinks;
}
