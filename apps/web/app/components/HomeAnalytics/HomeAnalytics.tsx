"use client";

import { useEffect } from "react";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { track } from "@/lib/analytics/mixpanel";

import type { HomeAnalyticsProps } from "./HomeAnalytics.types";

/** The feature whose section hosts the project links (scopes `project_clicked`). */
const PROJECT_FEATURE = "project";

/**
 * HomeAnalytics — home-page-only tracking. Renders nothing.
 *
 * Two behaviours, both gated on analytics consent — so nothing is observed
 * before the visitor opts in, and a `feature_viewed` impression isn't "used up"
 * while opted out:
 *
 * - `feature_viewed`: an IntersectionObserver fires once the first time each
 *   section scrolls into view, then stops watching it.
 * - `project_clicked`: a delegated click listener on the work section reports
 *   clicks on project links (title + URL).
 */
export function HomeAnalytics({ sections }: HomeAnalyticsProps) {
  const { consent } = useCookieConsent();
  const analyticsGranted = consent?.analytics === true;

  // feature_viewed — one impression per section, the first time it's seen.
  useEffect(() => {
    if (!analyticsGranted || typeof IntersectionObserver === "undefined")
      return;

    const featureById = new Map(sections.map((s) => [s.id, s.feature]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const feature = featureById.get(entry.target.id);
          if (feature) track("feature_viewed", { feature });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 },
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [analyticsGranted, sections]);

  // project_clicked — delegated to the work section's project links.
  useEffect(() => {
    if (!analyticsGranted) return;
    const workId = sections.find((s) => s.feature === PROJECT_FEATURE)?.id;
    const root = workId ? document.getElementById(workId) : null;
    if (!root) return;

    const handleClick = (event: MouseEvent) => {
      const el = event.target instanceof Element ? event.target : null;
      const anchor = el?.closest<HTMLAnchorElement>("a[href]") ?? null;
      if (!anchor) return;
      track("project_clicked", {
        project: anchor.textContent?.trim() || "unknown",
        project_url: anchor.href,
      });
    };

    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, [analyticsGranted, sections]);

  return null;
}
