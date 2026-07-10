import { cn } from "../../cn";
import {
  storyHeaderBackLinkClass,
  storyHeaderBrandClass,
  storyHeaderClass,
} from "./StoryHeader.styles";
import type { StoryHeaderProps } from "./StoryHeader.types";

/**
 * StoryHeader — a minimal case-study page header: a brand/wordmark link
 * opposite a "back to work" link. Deliberately not the full `Navbar` (no
 * primary nav, no hamburger sheet, no CTA).
 */
export function StoryHeader({
  brand,
  brandHref,
  backLabel,
  backHref,
  className,
  ...props
}: StoryHeaderProps) {
  return (
    <header className={cn(storyHeaderClass, className)} {...props}>
      <a href={brandHref} className={storyHeaderBrandClass}>
        {brand}
      </a>
      <a href={backHref} className={storyHeaderBackLinkClass}>
        <span aria-hidden="true">←</span> {backLabel}
      </a>
    </header>
  );
}
