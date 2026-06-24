import { cn } from "../../cn";
import type { SkillCategoryProps } from "./SkillCategory.types";

/**
 * SkillCategory — a titled, tinted card grouping related skill items. The
 * heading names the group; the items live in a `<ul>`.
 */
export function SkillCategory({
  title,
  children,
  className,
  ...props
}: SkillCategoryProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-tint-violet p-4",
        className,
      )}
      {...props}
    >
      <h3 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-brand-violet">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-brand-violet"
        />
        {title}
      </h3>
      <ul className="flex list-none flex-wrap gap-1.5">{children}</ul>
    </section>
  );
}
