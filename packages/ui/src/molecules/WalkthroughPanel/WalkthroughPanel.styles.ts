export const walkthroughPanelClass = "relative py-6 first:pt-0";

/* Hollow outline numeral: transparent fill + a stroked outline built from the
   real `--color-line-strong` variable. `-webkit-text-stroke` has broad modern
   support (incl. Firefox); the numeral is purely decorative (aria-hidden), so
   the rare non-supporting browser just shows blank space, not a functional
   loss. Size/line-height/tracking measured directly off the design mock's
   pinned-showreel panel (`clamp(78px,9vw,120px)` / `.78` / `-.04em`) — a
   genuine one-off with no equivalent Tailwind utility or token. `mb-2.5`
   (10px) matches the mock's numeral `margin-bottom` exactly. */
export const walkthroughPanelIndexClass =
  "mb-2.5 block font-heading text-[clamp(78px,9vw,120px)] font-extrabold leading-[0.78] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_var(--color-line-strong)]";

/* `mb-3` (12px) matches the mock's kicker `margin-bottom` exactly — the
   title that follows carries no margin-top of its own (see below), so this
   is the entire numeral-to-title rhythm. */
export const walkthroughPanelEyebrowClass = "mb-3";

/* No `Text` variant sits at the mock's exact measured size on its own, but
   `h1` (`--text-heading: clamp(28px,4vw,44px)`, `tracking-tight` = -.025em,
   `leading-tight` = 1.05) is a near-exact match for the panel heading's
   `clamp(28px,3.6vw,44px)` / `-.025em` / `1.04` — reused via the `variant`
   prop (see `WalkthroughPanel.tsx`) rather than duplicating a parallel size
   token. `max-w-[15ch]` matches the mock's heading measure. */
export const walkthroughPanelTitleClass = "max-w-[15ch]";

/* `max-w-[44ch]` matches the mock's measured body width (52ch was a
   guess predating this pass — the mock consistently caps every walkthrough
   panel text block, including the callout below, at 44ch). */
export const walkthroughPanelDescriptionClass =
  "mt-[18px] max-w-[44ch] text-fg-muted";

export const walkthroughPanelCalloutClass =
  "mt-[22px] max-w-[44ch] text-base leading-relaxed";

/* `text-2xs` (11px) + `tracking-wider` (.06em) match the mock's "THE CALL —"
   label exactly (11px / .06em) — `text-xs`/`tracking-wide` (12px/.05em)
   undershot both. */
export const walkthroughPanelCalloutLabelClass =
  "font-mono text-2xs font-bold uppercase tracking-wider text-brand-violet";

export const walkthroughPanelCalloutBodyClass = "text-fg-soft";

export const walkthroughPanelExtraClass = "mt-[22px] max-w-[44ch]";

/** See `WalkthroughPanelProps.compact` — applied to the index numeral and
 *  eyebrow only, never to the title/description/callout. */
export const walkthroughPanelCompactHiddenClass = "max-md:hidden";
