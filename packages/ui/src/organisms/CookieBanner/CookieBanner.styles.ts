/* Full-screen click-catcher behind the expanded preferences dialog: clicking it
   collapses the dialog. Deliberately transparent — the background is left
   un-blurred AND un-dimmed, so nothing behind the banner is obscured. */
export const scrimClass = "fixed inset-0 z-[80]";

/* Fixed anchor pinning the card to the foot of the viewport: full-width with
   gutters on mobile, hugging the bottom-*right* from `sm` up. Bottom-right
   (not -left): every page's primary reading content — the home hero copy,
   the story hero's H1/standfirst/ROLE-PLATFORM-YEAR meta row — starts flush
   against the left content edge, so a bottom-left-anchored banner sits
   directly on top of it on any viewport short enough for both to occupy the
   same vertical band (e.g. 1280×800 on the story page). The right edge has
   no competing readable copy, only decorative hero imagery, so anchoring
   there is a containment fix with zero effect on the banner's own content,
   copy or behaviour. */
export const anchorClass =
  "fixed inset-x-4 bottom-4 z-[90] flex justify-center sm:inset-x-6 sm:bottom-6 sm:justify-end";

export const cardBase =
  "w-full overflow-hidden rounded-[24px] border border-ink bg-card shadow-cookie motion-safe:animate-cookie-rise focus:outline-none";

/** Width switches with the view: compact summary vs. wide preferences. */
export const cardSummary = "max-w-[440px]";
export const cardExpanded = "max-w-[860px]";

export const headerClass =
  "flex items-start gap-3.5 px-5 pb-4 pt-5 sm:px-7 sm:pt-6";

export const badgeClass =
  "flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-ink bg-brand-violet text-white shadow-brutal";

export const headerTextClass = "min-w-0 flex-1";

export const eyebrowClass = "mb-1 text-2xs";

export const headingClass = "text-2xl font-extrabold";

export const descriptionClass =
  "max-w-[62ch] px-5 font-body text-md leading-relaxed text-fg-muted sm:px-7";

export const privacyLinkClass =
  "border-b border-brand-violet font-semibold text-brand-violet no-underline hover:opacity-80";

export const listClass = "m-0 mt-4 list-none px-5 sm:px-7";

export const itemClass = "border-b border-line-soft py-4 last:border-b-0";

export const itemRowClass = "flex items-start justify-between gap-3.5";

export const itemTextClass = "min-w-0 flex-1";

export const itemTitleRowClass = "mb-1.5 flex flex-wrap items-center gap-2";

export const itemTitleClass =
  "font-heading text-base font-bold tracking-snug text-fg";

export const itemTagBase =
  "rounded-sm px-1.5 py-0.5 font-mono text-2xs font-bold uppercase tracking-wide";

export const itemTagLocked = "bg-tint-green text-brand-green-deep";
export const itemTagOptIn = "bg-tint-violet text-brand-violet";

export const itemDescClass = "text-sm leading-normal text-fg-soft";

export const itemMetaClass =
  "mt-2 font-mono text-2xs leading-normal text-fg-faint";

export const actionsClass =
  "flex flex-wrap items-center gap-2.5 px-5 pb-5 pt-4 sm:px-7";

export const actionAccept = "order-1 flex-1 basis-[150px]";
export const actionReject = "order-2 flex-1 basis-[130px]";
export const actionSave = "order-3 basis-full";

export const manageClass =
  "order-3 basis-full cursor-pointer border-none bg-transparent p-1.5 font-mono text-xs font-bold tracking-wide text-fg-soft underline underline-offset-2 hover:text-fg";
