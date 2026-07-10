import { Eyebrow } from "../../atoms";
import { cn } from "../../cn";
import { briefBodyClass, briefClass, briefEyebrowClass } from "./Brief.styles";
import type { BriefProps } from "./Brief.types";

/**
 * Brief — a large statement section: an eyebrow above a heading-scale
 * statement. `body` is a ReactNode slot — the app renders Contentful Rich
 * Text (or any other markup) into it; Brief applies only the typographic
 * treatment.
 */
export function Brief({ eyebrow, body, className, ...props }: BriefProps) {
  return (
    <section className={cn(briefClass, className)} {...props}>
      {eyebrow ? (
        <Eyebrow className={briefEyebrowClass}>{eyebrow}</Eyebrow>
      ) : null}
      <div className={briefBodyClass}>{body}</div>
    </section>
  );
}
