export const walkthroughPanelClass = "relative py-6 first:pt-0";

/* Hollow outline numeral: transparent fill + a stroked outline built from the
   real `--color-line-strong` variable. `-webkit-text-stroke` has broad modern
   support (incl. Firefox); the numeral is purely decorative (aria-hidden), so
   the rare non-supporting browser just shows blank space, not a functional
   loss. A genuine one-off with no equivalent Tailwind utility or token. */
export const walkthroughPanelIndexClass =
  "block font-heading text-[clamp(48px,7vw,80px)] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-line-strong)]";

export const walkthroughPanelEyebrowClass = "mt-3";

export const walkthroughPanelTitleClass = "mt-2";

export const walkthroughPanelDescriptionClass =
  "mt-3 max-w-[52ch] text-fg-muted";

export const walkthroughPanelCalloutClass =
  "mt-5 max-w-[52ch] text-base leading-relaxed";

export const walkthroughPanelCalloutLabelClass =
  "font-mono text-xs font-bold uppercase tracking-wide text-brand-violet";

export const walkthroughPanelCalloutBodyClass = "text-fg-soft";

export const walkthroughPanelExtraClass = "mt-5 max-w-[52ch]";
