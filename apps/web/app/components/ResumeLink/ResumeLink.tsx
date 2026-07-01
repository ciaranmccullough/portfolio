"use client";

import { ArrowUpRightIcon, Link } from "@portfolio/ui";

import { track } from "@/lib/analytics/mixpanel";

import { resumeLinkIconClass } from "./ResumeLink.styles";
import type { ResumeLinkProps } from "./ResumeLink.types";

/**
 * ResumeLink — the hero's résumé call-to-action, wrapped so the click is
 * tracked as the `resume_viewed` Value Moment. A thin client wrapper over the
 * `@portfolio/ui` {@link Link} (the page itself is a Server Component, so the
 * `onClick` has to live here). Tracking no-ops until analytics consent is
 * granted; the link works regardless.
 */
export function ResumeLink({ href, label }: ResumeLinkProps) {
  return (
    <Link
      href={href}
      variant="primary"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("resume_viewed", { resume_url: href })}
    >
      {label}
      <ArrowUpRightIcon className={resumeLinkIconClass} />
    </Link>
  );
}
