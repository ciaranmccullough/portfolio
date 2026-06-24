import { colors, fonts, fontWeights } from "@portfolio/tokens";

import type { EyebrowProps, EyebrowTone } from "./Eyebrow.types";

const toneColor: Record<EyebrowTone, string> = {
  violet: colors.brand.violet,
  orange: colors.brand.orange,
  green: colors.brand.green,
};

/**
 * Eyebrow — a mono, uppercase kicker that sits above a heading. Renders a `<p>`.
 */
export function Eyebrow({ tone = "violet", style, ...props }: EyebrowProps) {
  return (
    <p
      style={{
        fontFamily: fonts.mono,
        fontWeight: fontWeights.bold,
        fontSize: "13px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: toneColor[tone],
        ...style,
      }}
      {...props}
    />
  );
}
