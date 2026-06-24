import type { CSSProperties } from "react";

import { colors, fontWeights } from "@portfolio/tokens";

import type { LinkProps, LinkVariant } from "./Link.types";

const variantStyle: Record<LinkVariant, CSSProperties> = {
  nav: { color: colors.text.secondary, textDecoration: "none" },
  inline: {
    color: colors.ink,
    textDecoration: "none",
    borderBottom: `2px solid ${colors.brand.violet}`,
    paddingBottom: "2px",
  },
};

/** Link — the anchor atom. Nav links and underlined inline links. */
export function Link({
  variant = "nav",
  style,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      style={{
        fontWeight: fontWeights.semibold,
        ...variantStyle[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </a>
  );
}
