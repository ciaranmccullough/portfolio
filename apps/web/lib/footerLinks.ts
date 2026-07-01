import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { SiteFooterLinks } from "@/app/components/SiteFooter/SiteFooter.types";
import { localePath } from "@/lib/localePath";

/**
 * Build the {@link SiteFooter} link set from the dictionary, resolving canonical
 * locale-aware hrefs for the legal routes (the default locale is unprefixed).
 */
export function buildFooterLinks(
  dict: Dictionary,
  lang: string,
): SiteFooterLinks {
  return {
    privacyLabel: dict.footer.links.privacy,
    privacyHref: localePath(lang, "/privacy"),
    termsLabel: dict.footer.links.terms,
    termsHref: localePath(lang, "/terms"),
    cookieSettingsLabel: dict.footer.links.cookieSettings,
  };
}
