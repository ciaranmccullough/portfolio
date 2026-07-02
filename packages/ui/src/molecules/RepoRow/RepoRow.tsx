import { cn } from "../../cn";
import {
  repoRowDescClass,
  repoRowDotBase,
  repoRowDotTone,
  repoRowItemClass,
  repoRowLangClass,
  repoRowLinkClass,
  repoRowNameClass,
  repoRowStarsClass,
} from "./RepoRow.styles";
import type { RepoRowProps } from "./RepoRow.types";

/**
 * RepoRow — a repository link: a tone dot, the name, an optional description and
 * language, and a star count, all in one anchor. The anchor opens the repo in a
 * new tab. Renders an `<li>`; place inside a `<ul>` (the OpenSource panel).
 */
export function RepoRow({
  name,
  href,
  description,
  lang,
  stars,
  tone = "violet",
  className,
  ...props
}: RepoRowProps) {
  const dotClass = cn(repoRowDotBase, repoRowDotTone[tone]);
  return (
    <li className={cn(repoRowItemClass, className)} {...props}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={repoRowLinkClass}
      >
        <span aria-hidden="true" className={dotClass} />
        <span className={repoRowNameClass}>{name}</span>
        {description != null ? (
          <span className={repoRowDescClass}>{description}</span>
        ) : null}
        {lang != null ? (
          <span className={repoRowLangClass}>
            <span aria-hidden="true" className={dotClass} />
            {lang}
          </span>
        ) : null}
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
