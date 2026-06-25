import type {
  RawHeroFields,
  RichTextDocument,
  RichTextNode,
} from "@/services/contentful/contentful";
import type { Hero, TitleSegment } from "@/types/hero";

/** Map the raw Contentful "project" fields (DTO) to the {@link Hero} entity. */
export function mapHero(raw: RawHeroFields): Hero {
  return {
    title: mapTitleSegments(raw.titleRichText),
    description: raw.description,
    resumeUrl: raw.resume,
  };
}

/**
 * Flatten the Rich Text hero title into display segments: one run per text node,
 * with **bold** marks flagged as highlights (rendered in the brand accent). An
 * empty / missing document yields a single empty run rather than throwing.
 */
function mapTitleSegments(title: RichTextDocument | undefined): TitleSegment[] {
  if (!title) return [{ text: "", highlight: false }];

  const segments: TitleSegment[] = [];
  const collect = (nodes: RichTextNode[] = []) => {
    for (const node of nodes) {
      if (node.nodeType === "text") {
        if (node.value) {
          const highlight = (node.marks ?? []).some((m) => m.type === "bold");
          segments.push({ text: node.value, highlight });
        }
      } else {
        collect(node.content);
      }
    }
  };
  collect(title.content);

  return segments.length ? segments : [{ text: "", highlight: false }];
}
