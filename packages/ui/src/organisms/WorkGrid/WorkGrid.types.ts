import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface WorkProject {
  title: ReactNode;
  tags?: string[];
  /** Optional media slot (e.g. a `next/image`). */
  media?: ReactNode;
}

/** Props for the {@link WorkGrid} organism. Renders a `<section>`. */
export interface WorkGridProps extends ComponentPropsWithoutRef<"section"> {
  projects: WorkProject[];
}
