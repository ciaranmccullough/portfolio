import { cn } from "../../cn";
import { footerClass } from "./Footer.styles";
import type { FooterProps } from "./Footer.types";

/**
 * Footer — a mono colophon line in a `<footer>` landmark.
 */
export function Footer({ className, children, ...props }: FooterProps) {
  return (
    <footer className={cn(footerClass, className)} {...props}>
      {children}
    </footer>
  );
}
