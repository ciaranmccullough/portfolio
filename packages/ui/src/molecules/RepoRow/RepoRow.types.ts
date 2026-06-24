import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for the {@link RepoRow} molecule. Renders an `<li>` containing a link. */
export interface RepoRowProps extends ComponentPropsWithoutRef<"li"> {
  /** Repository name, e.g. "ciaran/enterprise-ui". */
  name: ReactNode;
  /** Link target. */
  href: string;
  /** Star count label. */
  stars?: ReactNode;
}
