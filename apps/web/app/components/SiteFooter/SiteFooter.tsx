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
 * Client-only on purpose: the year initialises from the render-time date and is
 * refreshed on mount, so it stays correct without a rebuild — unlike a
 * build-time `new Date()` baked into a statically generated page. The Footer
 * itself stays presentational in @portfolio/ui; this wrapper owns the clock.
 */
export function SiteFooter({ colophon }: SiteFooterProps) {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <Footer className={siteFooterClass}>
      {colophon.replace("{year}", String(year))}
    </Footer>
  );
}
