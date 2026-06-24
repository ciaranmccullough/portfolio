import { cn } from "../../cn";
import { openSourceClass, openSourcePanelClass } from "./OpenSource.styles";
import type { OpenSourceProps } from "./OpenSource.types";

/**
 * OpenSource — a list of RepoRow items inside one bordered panel.
 */
export function OpenSource({ className, children, ...props }: OpenSourceProps) {
  return (
    <section className={cn(openSourceClass, className)} {...props}>
      <ul className={openSourcePanelClass}>{children}</ul>
    </section>
  );
}
