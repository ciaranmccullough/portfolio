import { cn } from "../../cn";
import {
  repoRowDotClass,
  repoRowItemClass,
  repoRowLinkClass,
  repoRowNameClass,
  repoRowStarsClass,
} from "./RepoRow.styles";
import type { RepoRowProps } from "./RepoRow.types";

/**
 * RepoRow — a repository link: status dot, name and star count in one anchor.
 * Renders an `<li>`; place inside a `<ul>`.
 */
export function RepoRow({
  name,
  href,
  stars,
  className,
  ...props
}: RepoRowProps) {
  return (
    <li className={cn(repoRowItemClass, className)} {...props}>
      <a href={href} className={repoRowLinkClass}>
        <span aria-hidden="true" className={repoRowDotClass} />
        <span className={repoRowNameClass}>{name}</span>
        {stars != null ? (
          <span className={repoRowStarsClass}>
            <span aria-hidden="true">★ </span>
            {stars}
          </span>
        ) : null}
      </a>
    </li>
  );
}
