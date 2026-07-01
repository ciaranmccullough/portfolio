import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { SiteFooterLinks } from "@/app/components/SiteFooter/SiteFooter.types";

/**
 * Build the {@link SiteFooter} link set from the dictionary, prefixing the
 * legal-page hrefs with the active locale (routes live under `/[lang]/…`).
 */
export function buildFooterLinks(
  dict: Dictionary,
  lang: string,
): SiteFooterLinks {
  return {
    privacyLabel: dict.footer.links.privacy,
    privacyHref: `/${lang}/privacy`,
    termsLabel: dict.footer.links.terms,
    termsHref: `/${lang}/terms`,
    cookieSettingsLabel: dict.footer.links.cookieSettings,
  };
}
