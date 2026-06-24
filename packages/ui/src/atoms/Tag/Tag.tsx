import { cn } from "../../cn";
import { tagClass } from "./Tag.styles";
import type { TagProps } from "./Tag.types";

/**
 * Tag — a quiet metadata chip. Renders an `<li>`; place inside a `<ul>`/`<ol>`.
 */
export function Tag({ className, ...props }: TagProps) {
  return <li className={cn(tagClass, className)} {...props} />;
}
