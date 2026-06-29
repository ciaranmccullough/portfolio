"use client";

import { Footer } from "@portfolio/ui";
import { useEffect, useState } from "react";

import { siteFooterClass } from "./SiteFooter.styles";
import type { SiteFooterProps } from "./SiteFooter.types";

/**
 * SiteFooter — app-level wrapper around the presentational Footer that fills the
 * colophon's `{year}` placeholder with a *live* copyright year read from the
 * browser clock.
 *
 * The year is read purely client-side (after mount), never server-rendered: the
 * server emits the colophon without the year and the client fills it in, so
 * there's no build-time-frozen year and no SSR/client hydration mismatch around
 * the New-Year boundary. The Footer itself stays presentational in
 * @portfolio/ui; this wrapper owns the clock.
 */
export function SiteFooter({ colophon }: SiteFooterProps) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <Footer className={siteFooterClass}>
      {colophon.replace("{year}", year === null ? "" : String(year))}
    </Footer>
  );
}
