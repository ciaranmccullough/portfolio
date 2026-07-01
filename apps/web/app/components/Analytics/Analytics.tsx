"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { setAnalyticsConsent, track } from "@/lib/analytics/mixpanel";
import { screenFromPathname } from "@/lib/analytics/screen";

/**
 * Analytics — mounts Mixpanel and keeps it in step with cookie consent.
 *
 * Renders nothing. It lives inside {@link CookieConsentProvider} so it can read
 * the granular `analytics` choice: whenever that flag changes it opts Mixpanel
 * in or out (the SDK stays opted-out until then, so no event fires before
 * consent). Once consent is granted it emits a `navigation` event on first load
 * and on every client-side route change, carrying the current and previous
 * screen. Before a decision is made `consent` is `null` — treated as "not
 * granted", so tracking stays off by default.
 */
export function Analytics() {
  const { consent } = useCookieConsent();
  const analyticsGranted = consent?.analytics === true;
  const pathname = usePathname();
  // The screen of the previous `navigation` event, so we can report where the
  // visitor came from. Undefined until the first navigation of the session.
  const previousScreen = useRef<string | undefined>(undefined);

  // Mirror the consent choice into Mixpanel (opt in / opt out).
  useEffect(() => {
    setAnalyticsConsent(analyticsGranted);
  }, [analyticsGranted]);

  // Fire a `navigation` event per route — but only once analytics is opted in.
  // `track` no-ops while opted out, so this is safe even before consent.
  useEffect(() => {
    if (!analyticsGranted) return;
    const screen = screenFromPathname(pathname);
    track(
      "navigation",
      previousScreen.current !== undefined
        ? { screen, previous_screen: previousScreen.current }
        : { screen },
    );
    previousScreen.current = screen;
  }, [analyticsGranted, pathname]);

  return null;
}
