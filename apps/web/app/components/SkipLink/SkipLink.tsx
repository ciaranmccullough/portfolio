import { skipLinkClass } from "./SkipLink.styles";
import type { SkipLinkProps } from "./SkipLink.types";

/**
 * SkipLink — the first focusable element on every page (rendered in the root
 * layout, ahead of the header/nav each page renders itself): a keyboard/
 * screen-reader shortcut straight to the `<main>` landmark, so those users
 * don't have to tab through the header/nav on every single page. Invisible
 * until it receives focus.
 */
export function SkipLink({ label, targetId }: SkipLinkProps) {
  return (
    <a href={`#${targetId}`} className={skipLinkClass}>
      {label}
    </a>
  );
}
