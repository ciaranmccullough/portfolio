import { cn } from "../../cn";
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
    <li className={cn("list-none", className)} {...props}>
      <a
        href={href}
        className="flex items-center gap-3 rounded-md border border-line bg-card px-3.5 py-3 text-fg no-underline"
      >
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-brand-violet"
        />
        <span className="font-mono text-sm font-bold">{name}</span>
        {stars != null ? (
          <span className="ml-auto text-sm font-semibold text-fg-muted">
            <span aria-hidden="true">★ </span>
            {stars}
          </span>
        ) : null}
      </a>
    </li>
  );
}
