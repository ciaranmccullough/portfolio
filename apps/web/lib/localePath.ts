import { i18n } from "../i18n-config";

/**
 * Build a canonical in-app path for a locale. The default locale is served
 * without a URL prefix (see `proxy.ts`), so `localePath("en", "/privacy")` is
 * `/privacy`, while `localePath("de", "/privacy")` is `/de/privacy`. Avoids the
 * extra redirect hop a `/en/…` link would incur.
 */
export function localePath(lang: string, path: string): string {
  const prefix = lang === i18n.defaultLocale ? "" : `/${lang}`;
  const suffix = prefix && path === "/" ? "" : path;
  return `${prefix}${suffix}` || "/";
}
