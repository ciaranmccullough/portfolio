import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";

import { i18n } from "./i18n-config";

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
 * Next 16 proxy (formerly "middleware"): redirect locale-less paths to the
 * negotiated locale so every route is served under `/<locale>`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  // Skip Next internals and any path with a file extension (static assets).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
