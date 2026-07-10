import { Eyebrow, Tag, Text } from "../../atoms";
import { cn } from "../../cn";
import { ArrowUpRightIcon } from "../../icons";
import {
  workCardArrowClass,
  workCardArrowIconClass,
  workCardBodyClass,
  workCardClass,
  workCardDescriptionClass,
  workCardLinkClass,
  workCardMediaClass,
  workCardTagsClass,
  workCardTitleClass,
  workGridClass,
  workGridEyebrowClass,
  workGridHeaderClass,
  workGridListClass,
  workGridMetaClass,
} from "./WorkGrid.styles";
import type { WorkGridProps } from "./WorkGrid.types";

/**
 * WorkGrid — the "selected work" section: an optional header (eyebrow + heading
 * + mono meta) above a responsive grid of project cards. Each card stacks a
 * cover image, a (optionally linked) title, supporting copy and tech tags.
 */
export function WorkGrid({
  eyebrow,
  title,
  meta,
  projects,
  className,
  ...props
}: WorkGridProps) {
  return (
    <section className={cn(workGridClass, className)} {...props}>
      {eyebrow || title || meta ? (
        <div className={workGridHeaderClass}>
          <div>
            {eyebrow ? (
              <Eyebrow className={workGridEyebrowClass}>{eyebrow}</Eyebrow>
            ) : null}
            {title ? (
              <Text as="h2" variant="h1">
                {title}
              </Text>
            ) : null}
          </div>
          {meta ? <span className={workGridMetaClass}>{meta}</span> : null}
        </div>
      ) : null}

      <ul className={workGridListClass}>
        {projects.map((project, index) => (
          <li key={index}>
            <article className={workCardClass}>
              {project.media ? (
                <div className={workCardMediaClass}>{project.media}</div>
              ) : null}
              <div className={workCardBodyClass}>
                <Text as="h3" variant="h3" className={workCardTitleClass}>
                  {project.href ? (
                    <a
                      href={project.href}
                      {...(project.internal
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className={workCardLinkClass}
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </Text>
                {project.description ? (
                  <Text variant="body" className={workCardDescriptionClass}>
                    {project.description}
                  </Text>
                ) : null}
                {project.tags?.length || project.href ? (
                  <ul className={workCardTagsClass}>
                    {project.tags?.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                    {project.href && !project.internal ? (
                      <li aria-hidden="true" className={workCardArrowClass}>
                        <ArrowUpRightIcon className={workCardArrowIconClass} />
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
