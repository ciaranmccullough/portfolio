import { cn } from "../../cn";
import type { StatBlockProps } from "./StatBlock.types";

/**
 * StatBlock — a number paired with a label. Renders an `<li>`; place in a list.
 */
export function StatBlock({
  value,
  label,
  className,
  ...props
}: StatBlockProps) {
  return (
    <li
      className={cn(
        "list-none rounded-2xl border border-line bg-card p-4",
        className,
      )}
      {...props}
    >
      <strong className="block font-heading text-3xl font-extrabold tracking-snug text-fg">
        {value}
      </strong>
      <span className="mt-0.5 block font-body text-sm text-fg-soft">
        {label}
      </span>
    </li>
  );
}
