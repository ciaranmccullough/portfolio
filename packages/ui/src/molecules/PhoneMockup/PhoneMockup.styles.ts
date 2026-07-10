export const phoneMockupClass = "w-full max-w-[320px]";

/* Device chrome: `#050509` has no token today (genuinely new, device-only
   colour — see design-spec F) so it's a deliberate arbitrary one-off. The
   hard-shadow + soft-drop combo is likewise a one-off shape, built from the
   real `--color-brand-violet` variable rather than a hardcoded hex. */
export const phoneMockupBezelClass =
  "rounded-[46px] border-[1.5px] border-ink bg-[#050509] p-3 shadow-[12px_14px_0_var(--color-brand-violet),0_45px_70px_-30px_rgba(23,22,29,0.55)]";

/* `aspect-[1080/2424]` is the load-bearing device ratio from the design
   (consistent across both source files) — a genuine one-off with no token. */
export const phoneMockupScreenClass =
  "relative aspect-[1080/2424] w-full overflow-hidden rounded-[36px] bg-[#0a0b12]";

export const phoneMockupFallbackClass =
  "flex size-full items-center justify-center p-6 text-center font-mono text-xs font-bold uppercase tracking-wide text-fg-on-dark/70";

export const phoneMockupProgressClass = "mt-5";

export const phoneMockupSegmentsClass = "flex list-none gap-1.5";

/* Background is applied by exactly one of the two state classes below —
   never both. `cn` is a plain joiner (no tailwind-merge), so stacking two
   `bg-*` utilities would leave the winner to the stylesheet's emission
   order, which resolves in `bg-line-strong`'s favour and paints every
   segment grey. */
export const phoneMockupSegmentClass = "h-1.5 flex-1 rounded-full";

export const phoneMockupSegmentActiveClass = "bg-brand-violet";

export const phoneMockupSegmentInactiveClass = "bg-line-strong";

export const phoneMockupProgressLabelRowClass =
  "mt-2.5 flex items-center justify-between gap-3 font-mono text-xs font-bold text-fg";

export const phoneMockupProgressLabelClass = "truncate uppercase tracking-wide";

export const phoneMockupProgressCounterClass = "shrink-0 text-fg-faint";
