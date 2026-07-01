import type { CookiePreferences } from "@portfolio/ui";

/**
 * Cookie-consent persistence — the browser-side source of truth.
 *
 * The user's choice is stored in `localStorage` under {@link CONSENT_STORAGE_KEY}
 * as the four category flags plus a timestamp. Every read is normalised so
 * `necessary` is always granted and unknown/corrupt data degrades to `null`
 * (treated as "no decision yet"). All helpers are SSR-safe — they no-op when
 * `window` is unavailable — so they can be imported anywhere.
 */
export const CONSENT_STORAGE_KEY = "ck-consent-v1";

/** A persisted consent record: the category choices plus when they were saved. */
export interface StoredConsent extends CookiePreferences {
  /** Epoch milliseconds the choice was saved. */
  ts: number;
}

/** Necessary-only — applied on "Reject all" and as the pre-decision default. */
export const NECESSARY_ONLY: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

/** Everything granted — applied on "Accept all". */
export const ALL_GRANTED: CookiePreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

/** Coerce an arbitrary parsed value into valid preferences (necessary always on). */
function normalise(value: Partial<Record<keyof CookiePreferences, unknown>>) {
  return {
    necessary: true,
    functional: value.functional === true,
    analytics: value.analytics === true,
    marketing: value.marketing === true,
  } satisfies CookiePreferences;
}

/** Read the persisted preferences, or `null` if none exist or are unreadable. */
export function readConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return normalise(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Persist `preferences` (stamped with the current time); returns what was stored. */
export function writeConsent(
  preferences: CookiePreferences,
): CookiePreferences {
  const value = normalise(preferences);
  if (typeof window !== "undefined") {
    try {
      const record: StoredConsent = { ...value, ts: Date.now() };
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore quota / private-mode failures — the choice just won't persist.
    }
  }
  return value;
}

/** Remove any stored consent (used by "reset"). */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignore — nothing to clean up if storage is unavailable.
  }
}
