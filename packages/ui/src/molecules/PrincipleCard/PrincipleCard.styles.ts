import type { PrincipleCardTone } from "./PrincipleCard.types";

/* Neo-brutalist card: thick ink border + hard offset shadow, mirroring the
   SkillPill atom's treatment. `shadow-[..]` is a genuine one-off (a bigger
   offset than the shared `shadow-brutal` token) built from the real `--color-ink`
   variable rather than a hardcoded hex. `rounded-3xl` is Tailwind's built-in
   24px step — untouched by this theme's `--radius-*` overrides (which stop at
   `2xl`) — close to the design's 22px with no token changes required. */
export const principleCardClass =
  "list-none rounded-3xl border-2 border-ink bg-card p-6 shadow-[5px_6px_0_var(--color-ink)] sm:p-7";

export const principleCardIndexClass =
  "block font-heading text-[44px] font-extrabold leading-none tracking-tight";

/* Same safe light-surface accent palette as Eyebrow's default tone — the
   bright orange/green fail AA here too, so orange/green use the `-deep`
   shades; violet already clears it bright. */
export const principleCardIndexTone: Record<PrincipleCardTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange-deep",
  green: "text-brand-green-deep",
};

export const principleCardTitleClass = "mt-4";

export const principleCardDescriptionClass = "mt-2";
