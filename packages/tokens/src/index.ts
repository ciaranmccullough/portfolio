/**
 * Design tokens — the primitive values of the design system.
 *
 * Framework-agnostic, serializable constants consumed by @portfolio/ui and apps.
 * Values mirror the "Component Library" design doc.
 */

export const colors = {
  /** Page background (warm paper). */
  paper: "#f4f1e9",
  /** Raised card surface. */
  card: "#fffdf7",
  /** Inset / well surface. */
  inset: "#f6f2e8",
  /** Primary dark (ink) — text and dark panels. */
  ink: "#17161d",
  /** Darker surface for inputs on dark panels. */
  inkSoft: "#15141b",
  brand: {
    violet: "#6a47ff",
    orange: "#ff5836",
    green: "#0fa978",
  },
  accent: {
    android: "#3ddc84",
    react: "#61dafb",
  },
  text: {
    primary: "#17161d",
    secondary: "#46434f",
    muted: "#6a6776",
    faint: "#9a9486",
    inverse: "#f4f1e9",
  },
  border: {
    default: "#e6e1d4",
    soft: "#e2dcce",
    strong: "#ded8c9",
    dark: "#312f3c",
  },
  tint: {
    violet: "#f1edff",
    orange: "#fff0eb",
  },
} as const;

export const fonts = {
  heading: "'Bricolage Grotesque', sans-serif",
  body: "'Hanken Grotesk', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const fontSizes = {
  xs: "12px",
  sm: "13.5px",
  md: "15px",
  lg: "18px",
  xl: "24px",
  "2xl": "clamp(28px, 4vw, 44px)",
  display: "clamp(34px, 6vw, 64px)",
} as const;

export const lineHeights = {
  tight: 1.05,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.6,
} as const;

export const spacing = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "28px",
  "3xl": "44px",
} as const;

export const radii = {
  sm: "6px",
  md: "10px",
  lg: "12px",
  xl: "16px",
  pill: "999px",
} as const;

export const shadows = {
  /** Neobrutalist hard shadow. */
  brutal: "3px 3px 0 #17161d",
} as const;

/** Aggregate token object for convenient single-import consumption. */
export const tokens = {
  colors,
  fonts,
  fontWeights,
  fontSizes,
  lineHeights,
  spacing,
  radii,
  shadows,
} as const;

export type Tokens = typeof tokens;

export default tokens;
