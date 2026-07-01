"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Eyebrow, Switch, Text } from "../../atoms";
import { cn } from "../../cn";
import { CookieIcon } from "../../icons";
import {
  actionAccept,
  actionReject,
  actionSave,
  actionsClass,
  anchorClass,
  badgeClass,
  cardBase,
  cardExpanded,
  cardSummary,
  descriptionClass,
  eyebrowClass,
  headerClass,
  headerTextClass,
  headingClass,
  itemClass,
  itemDescClass,
  itemMetaClass,
  itemRowClass,
  itemTagBase,
  itemTagLocked,
  itemTagOptIn,
  itemTextClass,
  itemTitleClass,
  itemTitleRowClass,
  listClass,
  manageClass,
  privacyLinkClass,
  scrimClass,
} from "./CookieBanner.styles";
import type {
  CookieBannerCopy,
  CookieBannerProps,
  CookieBannerView,
  CookieCategory,
  CookieCategoryKey,
  CookiePreferences,
} from "./CookieBanner.types";

/** Necessary-only preset — the safe default before any choice is made. */
const NECESSARY_ONLY: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

/** The default consent categories (English), matching the design. */
export const defaultCookieCategories: CookieCategory[] = [
  {
    key: "necessary",
    title: "Strictly necessary",
    tag: "Always active",
    locked: true,
    description:
      "Required for the site to work safely — security, network management and remembering this very consent choice.",
    meta: "Legal basis · GDPR Art. 6(1)(f) — Legitimate interests · No consent needed",
  },
  {
    key: "functional",
    title: "Functional",
    tag: "Opt-in",
    description:
      "Remembers choices you make — preferred language or region, dark mode and layout preferences.",
    meta: "Consent · Opt-in required before execution",
  },
  {
    key: "analytics",
    title: "Performance & analytics",
    tag: "Opt-in",
    description:
      "Aggregate insight into how the site is used — page views, bounce rates and crash reports. Never identifies you directly.",
    meta: "Consent · Opt-in required before execution",
  },
  {
    key: "marketing",
    title: "Targeting & marketing",
    tag: "Opt-in",
    description:
      "Third-party advertising cookies that build an interest profile across sites to personalise and measure ads.",
    meta: "Consent · Strict opt-in — blocked by default",
  },
];

/** Built-in English copy; overridden per-key via the `copy` prop. */
export const defaultCookieBannerCopy: CookieBannerCopy = {
  eyebrow: "// Your privacy",
  summaryHeading: "We value your privacy",
  preferencesHeading: "Manage your cookies",
  description:
    "We use cookies to keep the site running, remember your preferences and understand how it's used. Strictly necessary cookies are always on. Everything else stays off until you say yes.",
  privacyLabel: "Privacy policy",
  acceptAll: "Accept all",
  rejectAll: "Reject all",
  manage: "Manage preferences",
  save: "Save my preferences",
  dialogLabel: "Cookie consent",
};

/**
 * CookieBanner — the consent organism. Fixed to the foot of the screen, it opens
 * as a compact summary (accept / reject / manage) and expands into a modal
 * preferences dialog with a per-category {@link Switch}. Presentational: the only
 * React state is which view is showing. The per-category toggles are uncontrolled
 * — each `Switch` seeds from `preferences` via `defaultChecked` and its value is
 * read from the DOM (through refs) on save. Decisions are reported back through
 * the `onAcceptAll` / `onRejectAll` / `onSavePreferences` callbacks.
 */
export function CookieBanner({
  open,
  initialView = "summary",
  preferences,
  categories = defaultCookieCategories,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  copy,
  privacyHref = "#",
  className,
}: CookieBannerProps) {
  const text = { ...defaultCookieBannerCopy, ...copy };
  const [view, setView] = useState<CookieBannerView>(initialView);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRefs = useRef<
    Partial<Record<CookieCategoryKey, HTMLInputElement | null>>
  >({});

  const expanded = view === "preferences";

  // Each time the banner (re)opens, reset to the requested `initialView`. The
  // per-category toggles are uncontrolled and re-seed from `preferences` when the
  // preferences list (re)mounts on expand.
  useEffect(() => {
    if (open) setView(initialView);
  }, [open, initialView]);

  // Move focus into the dialog when it becomes a modal (preferences view), and
  // let Escape collapse it back to the summary.
  useEffect(() => {
    if (!open || !expanded) return;
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setView("summary");
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, expanded]);

  function handleSave() {
    // Read the current toggle states straight from the DOM (uncontrolled).
    const next: CookiePreferences = { ...NECESSARY_ONLY };
    for (const category of categories) {
      next[category.key] = category.locked
        ? true
        : Boolean(inputRefs.current[category.key]?.checked);
    }
    onSavePreferences(next);
  }

  return (
    <>
      {open && expanded ? (
        <div
          aria-hidden="true"
          onClick={() => setView("summary")}
          className={scrimClass}
        />
      ) : null}

      {open ? (
        <div className={anchorClass}>
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal={expanded}
            aria-label={text.dialogLabel}
            tabIndex={-1}
            className={cn(
              cardBase,
              expanded ? cardExpanded : cardSummary,
              className,
            )}
          >
            <div className={headerClass}>
              <span className={badgeClass}>
                <CookieIcon />
              </span>
              <div className={headerTextClass}>
                <Eyebrow className={eyebrowClass}>{text.eyebrow}</Eyebrow>
                <Text as="h2" variant="h2" className={headingClass}>
                  {expanded ? text.preferencesHeading : text.summaryHeading}
                </Text>
              </div>
            </div>

            <Text className={descriptionClass}>
              {text.description}{" "}
              <a href={privacyHref} className={privacyLinkClass}>
                {text.privacyLabel}
              </a>
              .
            </Text>

            {expanded ? (
              <ul className={listClass}>
                {categories.map((category) => (
                  <li key={category.key} className={itemClass}>
                    <div className={itemRowClass}>
                      <div className={itemTextClass}>
                        <div className={itemTitleRowClass}>
                          <span className={itemTitleClass}>
                            {category.title}
                          </span>
                          <span
                            className={cn(
                              itemTagBase,
                              category.locked ? itemTagLocked : itemTagOptIn,
                            )}
                          >
                            {category.tag}
                          </span>
                        </div>
                        <Text variant="small" className={itemDescClass}>
                          {category.description}
                        </Text>
                      </div>
                      <Switch
                        ref={(el) => {
                          inputRefs.current[category.key] = el;
                        }}
                        name={category.key}
                        defaultChecked={
                          category.locked
                            ? true
                            : (preferences?.[category.key] ?? false)
                        }
                        locked={category.locked}
                        aria-label={category.title}
                      />
                    </div>
                    <p className={itemMetaClass}>{category.meta}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className={actionsClass}>
              <Button
                variant="dark"
                onClick={onAcceptAll}
                className={actionAccept}
              >
                {text.acceptAll}
              </Button>
              <Button
                variant="ghost"
                onClick={onRejectAll}
                className={actionReject}
              >
                {text.rejectAll}
              </Button>
              {expanded ? (
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className={actionSave}
                >
                  {text.save}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => setView("preferences")}
                  className={manageClass}
                >
                  {text.manage}
                </button>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
