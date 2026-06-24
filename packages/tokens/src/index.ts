/**
 * Design tokens — the primitive values of the design system.
 *
 * Framework-agnostic, serializable constants consumed by @portfolio/ui and apps.
 * Keep these as plain data so any renderer (CSS, RN, email) can use them.
 */

export const colors = {
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    inverse: "#ffffff",
  },
  background: {
    default: "#ffffff",
    subtle: "#f9fafb",
  },
  brand: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
  },
  border: {
    default: "#e5e7eb",
  },
} as const;

export const spacing = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.5rem",
  "2xl": "2rem",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const radii = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  full: "9999px",
} as const;

export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/** Aggregate token object for convenient single-import consumption. */
export const tokens = {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  radii,
  lineHeights,
} as const;

export type Tokens = typeof tokens;

export default tokens;
