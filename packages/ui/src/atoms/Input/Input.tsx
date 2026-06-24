import { cn } from "../../cn";
import type { InputProps } from "./Input.types";

/**
 * Input — uncontrolled text-field atom (dark surface, violet border).
 *
 * Pass a `ref` and `defaultValue` and read the value from the DOM. The native
 * focus outline is preserved for keyboard accessibility.
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-brand-violet bg-ink-soft px-3.5 py-3 font-body text-base text-fg-inverse",
        className,
      )}
      {...props}
    />
  );
}
