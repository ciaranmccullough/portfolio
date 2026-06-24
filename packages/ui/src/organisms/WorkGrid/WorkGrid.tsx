import { Tag, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  workCardClass,
  workCardMediaClass,
  workCardTagsClass,
  workGridClass,
  workGridListClass,
} from "./WorkGrid.styles";
import type { WorkGridProps } from "./WorkGrid.types";

/**
 * WorkGrid — a responsive grid of project cards (media + title + tags).
 */
export function WorkGrid({ projects, className, ...props }: WorkGridProps) {
  return (
    <section className={cn(workGridClass, className)} {...props}>
      <ul className={workGridListClass}>
        {projects.map((project, index) => (
          <li key={index}>
            <article className={workCardClass}>
              <div className={workCardMediaClass}>{project.media}</div>
              <Text variant="h3">{project.title}</Text>
              {project.tags?.length ? (
                <ul className={workCardTagsClass}>
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </ul>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
