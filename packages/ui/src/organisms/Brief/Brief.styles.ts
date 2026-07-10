export const briefClass =
  "mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20";

export const briefEyebrowClass = "mb-6";

/* Statement-scale type: bigger than any existing Text variant tops out at, so
   it's a bespoke clamp (a genuine one-off — see design-spec F) rather than a
   token. Deliberately carries no colour override for nested <strong>/<em> —
   the real CMS `brief` field marks up multiple bold runs, not one specific
   "accent phrase" to colour, so that decision is left to the app's rich-text
   renderer rather than guessed at here with a blanket selector. */
export const briefBodyClass =
  "font-heading text-[clamp(28px,4.6vw,60px)] font-bold leading-[1.08] tracking-tight text-fg";
