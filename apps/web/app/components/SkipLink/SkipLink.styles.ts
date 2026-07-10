/* Visually hidden until focused (Tailwind's documented `sr-only` +
   `focus:not-sr-only` pattern), then pinned to the top-left corner above
   everything else on the page. Styled on-brand — violet chip, hard shadow,
   mono label — rather than a plain unstyled link, so the one moment it's
   visible still reads as this design system's own, not a generic browser
   default. `focus:` (not `focus-visible:`) is deliberate: this link is only
   ever reached by keyboard/AT in practice, so there's no mouse-focus case to
   guard against, and using the broader pseudo-class sidesteps any browser's
   :focus-visible heuristics for a link that's invisible until focused. */
export const skipLinkClass =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-ink focus:bg-brand-violet focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:font-bold focus:text-white focus:no-underline focus:shadow-brutal";
