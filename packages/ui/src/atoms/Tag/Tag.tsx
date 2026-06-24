import { cn } from "../../cn";
import type { TagProps } from "./Tag.types";

/**
 * Tag — a quiet metadata chip. Renders an `<li>`; place inside a `<ul>`/`<ol>`.
 */
export function Tag({ className, ...props }: TagProps) {
  return (
    <li
      className={cn(
        "inline-flex list-none items-center rounded-sm border border-line bg-chip px-2 py-1 font-mono text-xs font-medium text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}
