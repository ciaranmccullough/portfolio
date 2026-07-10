/**
 * The `id` every page's `<main>` landmark shares (home, story, legal,
 * ErrorScreen) — a single shared constant rather than the literal string
 * repeated at each render site, so the root layout's `SkipLink` target and
 * every page's `<main>` id can never silently drift apart.
 */
export const MAIN_CONTENT_ID = "main-content";
