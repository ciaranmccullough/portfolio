import { cn } from "../../cn";
import { inputClass } from "./Input.styles";
import type { InputProps } from "./Input.types";

/**
 * Input — uncontrolled text-field atom (dark surface, violet border).
 *
 * Pass a `ref` and `defaultValue` and read the value from the DOM. The native
 * focus outline is preserved for keyboard accessibility.
 */
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputClass, className)} {...props} />;
}
