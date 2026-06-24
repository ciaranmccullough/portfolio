import { cn } from "../../cn";
import {
  statBlockClass,
  statBlockLabelClass,
  statBlockValueClass,
} from "./StatBlock.styles";
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
    <li className={cn(statBlockClass, className)} {...props}>
      <strong className={statBlockValueClass}>{value}</strong>
      <span className={statBlockLabelClass}>{label}</span>
    </li>
  );
}
