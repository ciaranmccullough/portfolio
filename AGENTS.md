# Analytics Tracking — Mixpanel

This project uses **Mixpanel** for all product analytics. Mixpanel is the single source of truth for event tracking and behavioral data. Do not introduce any other analytics tools, SDKs, or tracking libraries without explicit instruction from a user.

---

## Before You Add or Modify Any Tracking

⛔ **Do not write Mixpanel tracking code without reading this file first.**

Wrong assumptions about platform, identity, or consent will produce broken Mixpanel data that requires manual cleanup or data deletion requests.

### Mandatory checklist before writing any Mixpanel code

- [ ] Use the shared wrapper in `apps/web/lib/analytics/mixpanel.ts` — never import `mixpanel-browser` directly in feature files
- [ ] This project does **not** route through a CDP — events go through the Mixpanel browser SDK
- [ ] Consent gating **is required** (EU/UK visitors): no event may fire before the visitor grants the `analytics` cookie category. The wrapper enforces this — keep it that way
- [ ] Review the tracking plan below and reuse existing events/properties before adding new ones

---

## Tech Stack

| Detail                              | Value                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| **Platform**                        | Next.js 16 (App Router, Turbopack) + React 19, TypeScript (`apps/web`)              |
| **Mixpanel SDK**                    | `mixpanel-browser`                                                                  |
| **SDK version**                     | `^2.80.0`                                                                           |
| **Tracking method**                 | client-side                                                                         |
| **CDP (if any)**                    | none                                                                                |
| **Consent required**                | yes — gated on the `analytics` cookie category                                      |
| **Data residency**                  | **EU** — SDK `api_host` is pinned to `https://api-eu.mixpanel.com`                  |
| **Mixpanel project token location** | `apps/web/.env.local` → `NEXT_PUBLIC_MIXPANEL_TOKEN` (documented in `.env.example`) |

---

## Mixpanel Initialization

Mixpanel is wrapped in one module and mounted once.

**Wrapper:** [`apps/web/lib/analytics/mixpanel.ts`](apps/web/lib/analytics/mixpanel.ts) — `initAnalytics`, `setAnalyticsConsent`, `track`, and the typed event catalogue.

**Mount point:** [`apps/web/app/components/Analytics/Analytics.tsx`](apps/web/app/components/Analytics/Analytics.tsx) — a `null`-rendering client component in the root layout ([`apps/web/app/[lang]/layout.tsx`](apps/web/app/%5Blang%5D/layout.tsx)), inside `CookieConsentProvider`.

**EU data residency:** the project lives on `eu.mixpanel.com`, so `init` pins `api_host: "https://api-eu.mixpanel.com"`. Without it the SDK defaults to the US host (`api-js.mixpanel.com`), which returns HTTP 200 but the data never reaches the EU project — silent data loss. Do not remove it.

**Consent gate (how it works):**

- `mixpanel.init(...)` runs with `opt_out_tracking_by_default: true` — nothing is stored or sent until the visitor opts in.
- `Analytics` reads the `analytics` flag from `useCookieConsent()` and calls `setAnalyticsConsent(granted)`, which opts Mixpanel in (grant) or resets + opts out (revoke / no decision).
- `track()` no-ops while opted out, so callers never have to guard on consent themselves.

**Do not:**

- Initialize Mixpanel in multiple places or create additional instances
- Import `mixpanel-browser` directly in feature files — always go through the wrapper's `track()`
- Fire events before consent, or bypass the consent gate

---

## Mixpanel Identity

**This project has no authentication** — it is a public, single-page portfolio with anonymous visitors only.

- Do **not** call `mixpanel.identify()` or set User Profiles — there are no logged-in users to identify.
- Mixpanel uses its anonymous device id (`$device_id`) as the `distinct_id`. That is correct here.
- `setAnalyticsConsent(false)` calls `mixpanel.reset()` when consent is revoked, to forget the stored anonymous id.
- If authentication is ever added, revisit this section: wire `mixpanel.identify(user.id)` on login/session-restore and `mixpanel.reset()` on logout, using a stable internal id (never email).

---

## Mixpanel Tracking Plan

These are the Mixpanel events currently tracked. **All new events must follow the same conventions.**

### Naming conventions

- Event names: `snake_case`, past tense `object_verb` (e.g., `resume_viewed`, `form_sent`). Exception: `navigation` is kept as a plain noun by product preference.
- Property names: `snake_case`, full words, no abbreviations
- Boolean properties: `is_` prefix
- Property values: lowercase, consistent strings
- Add each new event to the typed `AnalyticsEventProperties` map in `mixpanel.ts` — that map IS the tracking plan and keeps callers type-safe

### Current Mixpanel events

| Mixpanel Event     | Trigger                                                   | Key Properties                                         | File                                                                           |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `navigation`       | Route viewed — first load and each route change           | `screen`, `previous_screen` (omitted on first)         | [`Analytics.tsx`](apps/web/app/components/Analytics/Analytics.tsx)             |
| `feature_viewed`   | A home-page section first scrolls into view               | `feature` (hero / project / toolbox / about / contact) | [`HomeAnalytics.tsx`](apps/web/app/components/HomeAnalytics/HomeAnalytics.tsx) |
| `resume_viewed`    | Visitor opens the résumé from the hero (**Value Moment**) | `resume_url`                                           | [`ResumeLink.tsx`](apps/web/app/components/ResumeLink/ResumeLink.tsx)          |
| `project_clicked`  | Visitor clicks a work-project link                        | `project`, `project_url`                               | [`HomeAnalytics.tsx`](apps/web/app/components/HomeAnalytics/HomeAnalytics.tsx) |
| `form_sent`        | A form was sent successfully (**Value Moment**)           | `form`                                                 | [`ContactForm.tsx`](apps/web/app/components/ContactForm/ContactForm.tsx)       |
| `form_send_failed` | A form submission failed                                  | `form`, `reason`                                       | [`ContactForm.tsx`](apps/web/app/components/ContactForm/ContactForm.tsx)       |

---

## How to Add a New Mixpanel Event

1. **Check the tracking plan above** — reuse an existing event/property if one fits. Do not create duplicates.
2. **Name it** with the conventions above: `snake_case`, past tense, descriptive.
3. **Add it to the catalogue** — extend `AnalyticsEventProperties` in `apps/web/lib/analytics/mixpanel.ts` with the event and its typed property shape.
4. **Fire it** through the shared `track()` helper, **after** the action succeeds (after the API response, not on button click). Only include properties available at that moment; **never PII** (no emails, names, message content, IPs).
5. **Update this file** — add the new event to the tracking plan table.
6. **Verify in Mixpanel Live View** — confirm it appears with the right properties before considering it done.

### Mixpanel event template

```ts
import { track } from "@/lib/analytics/mixpanel";

// after the action has succeeded:
track("event_name", { property_name: value });
```

---

## What Not to Do

- **Do not introduce other analytics tools.** All tracking goes through Mixpanel via the shared wrapper.
- **Do not track events on page load** other than the deliberate `page_viewed`. Events represent user actions.
- **Do not track PII** — no emails, names, phone numbers, IPs, message content, or payment details in properties.
- **Do not fire events inside loops** — each `track()` call is a network request.
- **Do not hardcode the project token** — read it from `NEXT_PUBLIC_MIXPANEL_TOKEN`.
- **Do not bypass the consent gate** — no event may fire before the visitor grants the `analytics` cookie category.
- **Do not call `mixpanel.identify()`** — this site has no authenticated users.
