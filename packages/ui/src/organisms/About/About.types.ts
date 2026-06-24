import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface AboutStat {
  value: ReactNode;
  label: ReactNode;
}

/** Props for the {@link About} organism. Renders a `<section>`. */
export interface AboutProps extends ComponentPropsWithoutRef<"section"> {
  /** Optional portrait media slot. */
  portrait?: ReactNode;
  /** Biography copy. */
  bio: ReactNode;
  /** Stat blocks shown beside the bio. */
  stats?: AboutStat[];
}
