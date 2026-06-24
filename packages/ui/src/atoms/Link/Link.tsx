import type { ElementType } from "react";

import { cn } from "../../cn";
import { linkBase, linkVariant } from "./Link.styles";
import type { LinkProps } from "./Link.types";

/**
 * Link — the anchor atom. A styled `<a>` by default; pass `as` (e.g. the app's
 * `next/link`) to keep these styles on a routing component.
 */
export function Link({
  as,
  variant = "nav",
  className,
  children,
  ...props
}: LinkProps) {
  const Tag = (as ?? "a") as ElementType;
  return (
    <Tag className={cn(linkBase, linkVariant[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
