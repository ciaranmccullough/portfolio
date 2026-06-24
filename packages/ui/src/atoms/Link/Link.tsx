import type { ElementType } from "react";

import { cn } from "../../cn";
import type { LinkProps, LinkVariant } from "./Link.types";

const variantClass: Record<LinkVariant, string> = {
  nav: "text-fg-muted no-underline",
  inline: "text-fg no-underline border-b-2 border-brand-violet pb-0.5",
};

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
    <Tag
      className={cn("font-semibold", variantClass[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
