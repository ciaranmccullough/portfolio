/**
 * Icon registry — concrete, named glyphs for the design system's own
 * components (Navbar, Toast, …). Each lives in its own file and renders a
 * single inline SVG **through the Icon atom**, so callers write `<MenuIcon />`
 * instead of hand-rolling `<Icon><svg/></Icon>` (or a raw `<svg>`).
 *
 * App-specific brand icons live in the app instead (`apps/web/app/icons`).
 */
export * from "./types";
export * from "./AlertIcon";
export * from "./ArrowUpRightIcon";
export * from "./CheckIcon";
export * from "./CloseIcon";
export * from "./CookieIcon";
export * from "./LockIcon";
export * from "./MenuIcon";
