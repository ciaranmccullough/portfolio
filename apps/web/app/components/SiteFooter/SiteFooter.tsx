"use client";

import { Footer } from "@portfolio/ui";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { useCookieConsent } from "@/hooks/useCookieConsent";

import {
  siteFooterButtonClass,
  siteFooterClass,
  siteFooterInnerClass,
  siteFooterLinkClass,
  siteFooterNavClass,
} from "./SiteFooter.styles";
import type { SiteFooterProps } from "./SiteFooter.types";

/**
 * SiteFooter — app-level wrapper around the presentational Footer. It fills the
 * colophon's `{year}` placeholder with a *live* copyright year read from the
 * browser clock (client-only, so no SSR/hydration mismatch around New Year), and
 * adds the utility links: Privacy, Terms and a "Cookie settings" button that
 * re-opens the consent banner straight on its manage-preferences view (via
 * {@link useCookieConsent}'s `openPreferences`).
 */
export function SiteFooter({ colophon, links }: SiteFooterProps) {
  const [year, setYear] = useState<number | null>(null);
  const { openPreferences } = useCookieConsent();

  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <Footer className={siteFooterClass}>
      <div className={siteFooterInnerClass}>
        <span>
          {colophon.replace("{year}", year === null ? "" : String(year))}
        </span>
        <nav aria-label="Footer" className={siteFooterNavClass}>
          <NextLink href={links.privacyHref} className={siteFooterLinkClass}>
            {links.privacyLabel}
          </NextLink>
          <NextLink href={links.termsHref} className={siteFooterLinkClass}>
            {links.termsLabel}
          </NextLink>
          <button
            type="button"
            onClick={openPreferences}
            className={siteFooterButtonClass}
          >
            {links.cookieSettingsLabel}
          </button>
        </nav>
      </div>
    </Footer>
  );
}
