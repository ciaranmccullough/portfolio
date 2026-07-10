/* Section wrapper — matches Contact's pattern: align with the shared content
   width, `pb` only (the top gap comes from the previous section's own
   padding, matching the design doc's own `padding-top:0` on this wrapper).
   Bottom fluid rhythm measured off the design doc (clamp(70px,10vw,130px)),
   approximated on the Tailwind breakpoint scale. */
export const roleClass =
  "mx-auto max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-14 lg:pb-32";

/* The dark card. `rounded-3xl` is Tailwind's built-in 24px step (untouched by
   this theme's `--radius-*` overrides, which stop at `2xl`) — close to the
   design's 28px with no token changes required. The shadow is a genuine
   one-off offset built from the real `--color-brand-violet` variable. */
export const rolePanelClass =
  "rounded-3xl bg-ink px-6 py-10 shadow-[8px_10px_0_var(--color-brand-violet)] sm:px-10 sm:py-14";

export const roleEyebrowClass = "mb-4";

export const roleTitleClass = "max-w-[20ch] text-fg-inverse";

export const roleDescriptionClass = "mt-5 max-w-[60ch] text-fg-on-dark";

export const roleActionsClass = "mt-8 flex flex-wrap items-center gap-3";
