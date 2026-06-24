import type { ReactNode } from "react";

import type { IconName, IconProps } from "./Icon.types";

const paths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="4" y="4" width="9" height="9" rx="1.6" />
      <rect x="11" y="11" width="9" height="9" rx="1.6" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(60 12 12)" />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.7"
        transform="rotate(120 12 12)"
      />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </>
  ),
  arrowUpRight: (
    <>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="9 7 17 7 17 15" />
    </>
  ),
};

/**
 * Icon — a monoline glyph drawn with `currentColor`. Decorative by default;
 * pass `title` to expose an accessible label.
 */
export function Icon({ name, size = 22, title, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
