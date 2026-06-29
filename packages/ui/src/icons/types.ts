import type { IconProps } from "../atoms";

/**
 * Props for a registry glyph: everything the {@link IconProps Icon atom} takes
 * except its `children` (the SVG, which the glyph supplies). `className`,
 * `label` and `aria-*` flow straight through to the underlying Icon.
 */
export type GlyphProps = Omit<IconProps, "children">;
