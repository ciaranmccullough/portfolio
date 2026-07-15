import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";

import { i18n } from "./i18n-config";

/** Pick the visitor's best-matching locale from the Accept-Language header. */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  return match(languages, locales, i18n.defaultLocale);
}

/**
 * Next 16 proxy (formerly "middleware"). The default locale is served WITHOUT a
 * URL prefix: `/` renders it in place, and `/en` permanently redirects to `/`
 * so there is a single canonical URL. Any other locale keeps its prefix
 * (`/de/…`), so this scales to more languages without further changes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { defaultLocale, locales } = i18n;

  // Strip the default-locale prefix: `/en` → `/`, `/en/x` → `/x` (canonical).
  if (
    pathname === `/${defaultLocale}` ||
    pathname.startsWith(`/${defaultLocale}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${defaultLocale}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  // A non-default locale subtree (e.g. `/de/…`) is served as-is.
  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  // Unprefixed path: the default locale renders in place (internal rewrite — the
  // URL never changes); any other negotiated locale redirects to its prefix.
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  if (locale === defaultLocale) {
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the first-party Mixpanel ingestion proxy (`/mp/*`
  // rewrites straight to api-eu.mixpanel.com in next.config.mjs — locale
  // handling would 404 it via `/en/mp/…`), and any path with a file
  // extension (static assets).
  matcher: ["/((?!_next|mp/|.*\\..*).*)"],
};
