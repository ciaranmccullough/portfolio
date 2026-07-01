import mixpanel from "mixpanel-browser";

/**
 * Mixpanel analytics — the single source of truth for product event tracking.
 *
 * Consent-gated by design. Mixpanel is initialised with
 * `opt_out_tracking_by_default: true`, so it persists nothing and sends no
 * network requests until {@link setAnalyticsConsent} is called with the user's
 * granted `analytics` consent (wired to the cookie banner in
 * `app/components/Analytics`). Revoking consent opts back out and clears the
 * stored distinct-id. Every function is SSR-safe — it no-ops when `window` is
 * unavailable or when no token is configured — so the module can be imported
 * anywhere without crashing the server render.
 *
 * The event catalogue below IS the tracking plan: names are `snake_case`,
 * past-tense `object_verb`, and each event's property shape is typed so callers
 * can't drift from the plan. No PII is ever collected (data minimisation).
 */

/** The project's public analytics token (client-exposed; safe in the bundle). */
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

/** The home-page sections, tracked as `feature_viewed` impressions. */
export type Feature = "hero" | "project" | "toolbox" | "about" | "contact";

/** The tracked events and the exact property shape each one carries. */
export interface AnalyticsEventProperties {
  /** A route was viewed — fired on load and on each client navigation.
      `screen` is the coarse route name; `previous_screen` is omitted on the
      first navigation of a session. */
  navigation: { screen: string; previous_screen?: string };
  /** A home-page section first scrolled into view (fires once per section). */
  feature_viewed: { feature: Feature };
  /** The Value Moment — a visitor opened the résumé from the hero. */
  resume_viewed: { resume_url: string };
  /** A visitor clicked through to one of the work projects. */
  project_clicked: { project: string; project_url: string };
  /** The Value Moment — a visitor successfully sent a form. */
  form_sent: { form: string };
  /** A form submission failed (network / endpoint error). */
  form_send_failed: { form: string; reason: string };
}

/** Union of every event name in the tracking plan. */
export type AnalyticsEvent = keyof AnalyticsEventProperties;

/** Module-level guard so `init` runs at most once per page load. */
let initialised = false;

/** True only in a browser with a configured token — the precondition for any call. */
function isEnabled(): boolean {
  return typeof window !== "undefined" && Boolean(MIXPANEL_TOKEN);
}

/**
 * Initialise Mixpanel once, opted-out by default. Safe to call repeatedly (the
 * second call is a no-op) and safe on the server (returns immediately). No data
 * is tracked or persisted until {@link setAnalyticsConsent} grants consent.
 */
export function initAnalytics(): void {
  if (initialised || !isEnabled()) return;

  mixpanel.init(MIXPANEL_TOKEN as string, {
    // EU data residency: this project lives on eu.mixpanel.com, so events must
    // go to the EU ingestion host. Without this the SDK defaults to the US host
    // (api-js.mixpanel.com), which returns 200 but the data never reaches an
    // EU project.
    api_host: "https://api-eu.mixpanel.com",
    // Consent gate: nothing is stored or sent until the user opts in.
    opt_out_tracking_by_default: true,
    // localStorage keeps the anonymous distinct-id without extra cookies —
    // it stays inside the "analytics" consent the user granted.
    persistence: "localStorage",
    // We fire a named `navigation` event ourselves (SPA-aware) instead.
    track_pageview: false,
    // Keep the tracking plan intentional — no unplanned autocaptured events.
    autocapture: false,
    debug: process.env.NODE_ENV !== "production",
  });

  initialised = true;
}

/**
 * Reflect the user's `analytics` cookie-consent choice into Mixpanel: opt in
 * (and register the `platform` super property) when granted, opt out and reset
 * the stored id when revoked. Initialises on first grant if needed.
 */
export function setAnalyticsConsent(granted: boolean): void {
  if (!isEnabled()) return;
  if (granted && !initialised) initAnalytics();
  if (!initialised) return;

  if (granted) {
    mixpanel.opt_in_tracking();
    // Attached to every subsequent event; set after opt-in so it persists.
    mixpanel.register({ platform: "web" });
  } else if (mixpanel.has_opted_in_tracking()) {
    // Was granted, now revoked: stop tracking and forget the anonymous id.
    mixpanel.reset();
    mixpanel.opt_out_tracking();
  } else {
    mixpanel.opt_out_tracking();
  }
}

/**
 * Track a planned event. Type-safe against {@link AnalyticsEventProperties};
 * no-ops on the server, without a token, or while the user is opted out — so
 * callers can fire freely without guarding on consent themselves.
 */
export function track<E extends AnalyticsEvent>(
  event: E,
  ...properties: AnalyticsEventProperties[E] extends Record<string, never>
    ? [properties?: AnalyticsEventProperties[E]]
    : [properties: AnalyticsEventProperties[E]]
): void {
  if (!initialised || !isEnabled()) return;
  mixpanel.track(event, properties[0]);
}
