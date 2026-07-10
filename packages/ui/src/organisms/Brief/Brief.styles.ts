/* Asymmetric top/bottom rhythm, measured off the design doc: top tops out at
   64px (smaller than this section used to render at desktop) while bottom
   keeps growing to ~120px — the statement needs comparatively little air
   above it (right under the hero) but a generous gap before Principles. */
export const briefClass =
  "mx-auto max-w-7xl px-6 pt-8 pb-14 sm:px-10 sm:pt-10 sm:pb-20 lg:px-14 lg:pt-16 lg:pb-28 xl:pb-32";

export const briefEyebrowClass = "mb-6";

/* Statement-scale type: bigger than any existing Text variant tops out at, so
   it's a bespoke clamp (a genuine one-off — see design-spec F) rather than a
   token. Deliberately carries no colour override for nested <strong>/<em> —
   the real CMS `brief` field marks up multiple bold runs, not one specific
   "accent phrase" to colour, so that decision is left to the app's rich-text
   renderer rather than guessed at here with a blanket selector. */
export const briefBodyClass =
  "font-heading text-[clamp(28px,4.6vw,60px)] font-bold leading-[1.08] tracking-tight text-fg";
