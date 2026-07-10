import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  caseStudyHeroBackgroundClass,
  caseStudyHeroBackgroundMediaClass,
  caseStudyHeroClass,
  caseStudyHeroContentClass,
  caseStudyHeroDescriptionClass,
  caseStudyHeroEyebrowClass,
  caseStudyHeroMetaClass,
  caseStudyHeroMetaItemClass,
  caseStudyHeroMetaLabelClass,
  caseStudyHeroMetaValueClass,
  caseStudyHeroScrollCueArrowClass,
  caseStudyHeroScrollCueClass,
  caseStudyHeroTitleClass,
  caseStudyHeroWashBottomClass,
  caseStudyHeroWashFlatClass,
  caseStudyHeroWashLeftClass,
} from "./CaseStudyHero.styles";
import type { CaseStudyHeroProps } from "./CaseStudyHero.types";

/**
 * CaseStudyHero — the case-study landing section: an optional masked/faded
 * background image, eyebrow, H1 title, standfirst, a labelled meta row (e.g.
 * ROLE/PLATFORM/YEAR) and a decorative scroll cue. `backgroundImage` is fully
 * optional — when the CMS asset is missing, the hero simply renders without
 * that layer instead of showing a broken slot.
 */
export function CaseStudyHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  meta,
  scrollCueLabel,
  className,
  ...props
}: CaseStudyHeroProps) {
  return (
    <section className={cn(caseStudyHeroClass, className)} {...props}>
      {backgroundImage ? (
        <div aria-hidden="true" className={caseStudyHeroBackgroundClass}>
          <div className={caseStudyHeroBackgroundMediaClass}>
            {backgroundImage}
          </div>
          <div className={caseStudyHeroWashFlatClass} />
          <div className={caseStudyHeroWashLeftClass} />
          <div className={caseStudyHeroWashBottomClass} />
        </div>
      ) : null}

      <div className={caseStudyHeroContentClass}>
        {eyebrow ? (
          <Eyebrow className={caseStudyHeroEyebrowClass}>{eyebrow}</Eyebrow>
        ) : null}

        <Text variant="display-xl" className={caseStudyHeroTitleClass}>
          {title}
        </Text>

        {description ? (
          <p className={caseStudyHeroDescriptionClass}>{description}</p>
        ) : null}

        {meta && meta.length > 0 ? (
          <dl className={caseStudyHeroMetaClass}>
            {meta.map((item, index) => (
              <div key={index} className={caseStudyHeroMetaItemClass}>
                <dt className={caseStudyHeroMetaLabelClass}>{item.label}</dt>
                <dd className={caseStudyHeroMetaValueClass}>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {scrollCueLabel ? (
          <p className={caseStudyHeroScrollCueClass}>
            <span
              aria-hidden="true"
              className={caseStudyHeroScrollCueArrowClass}
            >
              ↓
            </span>
            {scrollCueLabel}
          </p>
        ) : null}
      </div>
    </section>
  );
}
