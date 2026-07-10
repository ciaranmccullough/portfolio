export const pollBarClass = "list-none space-y-3";

export const pollBarLabelRowClass =
  "mb-1.5 flex items-baseline justify-between gap-3 font-mono text-xs font-bold";

export const pollBarLabelClass = "uppercase tracking-wide text-fg-muted";

export const pollBarLabelLeadingClass = "text-brand-violet";

export const pollBarValueClass = "text-fg-faint";

export const pollBarTrackClass = "h-2 overflow-hidden rounded-full bg-chip";

/* Width is the one genuinely dynamic, data-driven value (an arbitrary CMS/poll
   percentage) that no static Tailwind class can express — set via `style`,
   same narrow exception as ScrollProgressBar's transform. The transition
   still comes from a utility class. */
export const pollBarFillClass =
  "h-full rounded-full transition-[width] duration-700 ease-out";

export const pollBarFillLeadingClass = "bg-brand-violet";

export const pollBarFillDefaultClass = "bg-line-strong";
