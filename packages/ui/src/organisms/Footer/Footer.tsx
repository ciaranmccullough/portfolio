import { cn } from "../../cn";
import type { FooterProps } from "./Footer.types";

/**
 * Footer — a mono colophon line in a `<footer>` landmark.
 */
export function Footer({ className, children, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "mx-auto max-w-5xl border-t border-line-soft px-6 py-8 font-mono text-sm text-fg-faint",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  );
}
