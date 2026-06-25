import { cn } from "../../cn";
import { textareaClass } from "./Textarea.styles";
import type { TextareaProps } from "./Textarea.types";

/**
 * Textarea — uncontrolled multi-line text-field atom (dark surface, subtle
 * border that turns violet on focus). Mirrors {@link Input}: pass a `ref` and
 * `defaultValue` and read the value from the DOM. The native focus outline is
 * preserved for accessibility.
 */
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn(textareaClass, className)} {...props} />;
}
