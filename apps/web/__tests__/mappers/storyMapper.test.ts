import type { Document } from "@contentful/rich-text-types";

import { mapStory } from "@/mappers/storyMapper";
import type {
  RawStoryFields,
  RawStorySection,
  RawStoryWalkthrough,
} from "@/services/contentful/contentful";

/** A minimal, valid Rich Text document — mirrors the real `brief` field's shape. */
const sampleBrief = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      data: {},
      content: [
        {
          nodeType: "text",
          value: "A purpose built experience.",
          marks: [],
          data: {},
        },
      ],
    },
  ],
} as unknown as Document;

/** A fully-populated raw "story" DTO derived from the real `ea-sports-app`
 *  entry; individual tests override single fields. */
function rawStory(overrides: Partial<RawStoryFields> = {}): RawStoryFields {
  return {
    id: "ea-sports-app",
    title: "Bringing Fans Closer to Sports",
    description:
      "The EA SPORTS App offers news, highlights, stats & scores for the world's greatest football leagues.",
    role: "Software Engineer",
    platform: "Android | Jetpack Compose",
    year: "2024 - Now",
    brief: sampleBrief,
    titlePrinciples: "Three ideas that held it together",
    principles: [
      {
        title: "Instant, even on launch",
        description: "Performance came first.",
      },
      {
        title: "One system, many surfaces",
        description: "A shared design system keeps every screen consistent.",
      },
    ],
    titleWalkthrough: "Five surfaces, one story",
    walkthroughs: [
      {
        image:
          "https://images.ctfassets.net/79cl1pmk9wt4/5dwHa2SGg9jxm5RGpfVV3J/fe7e/onboarding.webp?h=250",
        title: "Onboarding",
        subtitle: "Personalised content",
        description:
          "Client-side logic that generates personalised content before the first render.",
      },
    ],
    titleReflection: "What it taught me",
    reflections: [
      {
        title: "Perceived speed is a feature",
        description: "Optimistic updates get relevant content to users faster.",
      },
    ],
    titleRole: "What I owned across the app",
    descriptionRole:
      "As a Software Engineer on the app, I shipped the onboarding flow, design system and live scores.",
    backgroundImageUrl:
      "//images.ctfassets.net/79cl1pmk9wt4/6qcRXFyuziCOGQtvLAwg9b/c410/easa.webp",
    ...overrides,
  };
}

describe("mapStory", () => {
  it("maps a fully-populated entry into the Story entity", () => {
    const story = mapStory(rawStory());

    expect(story).toEqual({
      id: "ea-sports-app",
      title: "Bringing Fans Closer to Sports",
      description:
        "The EA SPORTS App offers news, highlights, stats & scores for the world's greatest football leagues.",
      role: "Software Engineer",
      platform: "Android | Jetpack Compose",
      year: "2024 - Now",
      brief: sampleBrief,
      titlePrinciples: "Three ideas that held it together",
      principles: [
        {
          title: "Instant, even on launch",
          description: "Performance came first.",
        },
        {
          title: "One system, many surfaces",
          description: "A shared design system keeps every screen consistent.",
        },
      ],
      titleWalkthrough: "Five surfaces, one story",
      walkthroughs: [
        {
          image:
            "https://images.ctfassets.net/79cl1pmk9wt4/5dwHa2SGg9jxm5RGpfVV3J/fe7e/onboarding.webp?w=1200&q=80&fm=webp",
          title: "Onboarding",
          subtitle: "Personalised content",
          description:
            "Client-side logic that generates personalised content before the first render.",
        },
      ],
      titleReflection: "What it taught me",
      reflections: [
        {
          title: "Perceived speed is a feature",
          description:
            "Optimistic updates get relevant content to users faster.",
        },
      ],
      titleRole: "What I owned across the app",
      descriptionRole:
        "As a Software Engineer on the app, I shipped the onboarding flow, design system and live scores.",
      backgroundImageUrl:
        "https://images.ctfassets.net/79cl1pmk9wt4/6qcRXFyuziCOGQtvLAwg9b/c410/easa.webp",
    });
  });

  describe("scalar fields", () => {
    it("passes title/description/role/platform/year through unchanged", () => {
      const story = mapStory(
        rawStory({
          title: "Custom Title",
          description: "Custom description",
          role: "Staff Engineer",
          platform: "iOS | SwiftUI",
          year: "2020 - 2022",
        }),
      );
      expect(story.title).toBe("Custom Title");
      expect(story.description).toBe("Custom description");
      expect(story.role).toBe("Staff Engineer");
      expect(story.platform).toBe("iOS | SwiftUI");
      expect(story.year).toBe("2020 - 2022");
    });

    it("passes the id and section title fields through unchanged", () => {
      const story = mapStory(
        rawStory({
          id: "custom-slug",
          titlePrinciples: "P",
          titleWalkthrough: "W",
          titleReflection: "R",
          titleRole: "Role",
          descriptionRole: "Role description",
        }),
      );
      expect(story.id).toBe("custom-slug");
      expect(story.titlePrinciples).toBe("P");
      expect(story.titleWalkthrough).toBe("W");
      expect(story.titleReflection).toBe("R");
      expect(story.titleRole).toBe("Role");
      expect(story.descriptionRole).toBe("Role description");
    });

    it("passes the brief Rich Text document through unchanged for the RichText renderer", () => {
      const story = mapStory(rawStory());
      expect(story.brief).toBe(sampleBrief);
    });
  });

  describe("backgroundImageUrl", () => {
    it("prefixes a protocol-relative URL with https:", () => {
      const story = mapStory(
        rawStory({
          backgroundImageUrl: "//images.ctfassets.net/x/easa.webp",
        }),
      );
      expect(story.backgroundImageUrl).toBe(
        "https://images.ctfassets.net/x/easa.webp",
      );
    });

    it("leaves an already-absolute https URL unchanged", () => {
      const story = mapStory(
        rawStory({
          backgroundImageUrl: "https://images.ctfassets.net/x/easa.webp",
        }),
      );
      expect(story.backgroundImageUrl).toBe(
        "https://images.ctfassets.net/x/easa.webp",
      );
    });

    it("is undefined when the entry has no background image set", () => {
      const story = mapStory(rawStory({ backgroundImageUrl: undefined }));
      expect(story.backgroundImageUrl).toBeUndefined();
    });

    it("is undefined (not thrown) when the linked asset is unresolved — the service already reports this as undefined, same as never-set", () => {
      // fetchStoryEntry collapses an unresolved { sys: Link } (unpublished
      // asset, no `fields`) to `backgroundImageUrl: undefined` before the
      // mapper ever sees it (see docs/contentful-story-shape.md's "Failure
      // mode" section) — so this is the same input/assertion as "no image set".
      const story = mapStory(rawStory({ backgroundImageUrl: undefined }));
      expect(story.backgroundImageUrl).toBeUndefined();
    });
  });

  describe("principles", () => {
    it("maps each item's title and description, in order", () => {
      const story = mapStory(
        rawStory({
          principles: [
            { title: "First", description: "First body" },
            { title: "Second", description: "Second body" },
          ],
        }),
      );
      expect(story.principles).toEqual([
        { title: "First", description: "First body" },
        { title: "Second", description: "Second body" },
      ]);
    });

    it("defaults description to '' when missing/mistyped (e.g. the descrition typo)", () => {
      const story = mapStory(
        rawStory({
          principles: [
            {
              title: "A",
              descrition: "typo'd key from an earlier CMS revision",
            } as unknown as RawStorySection,
          ],
        }),
      );
      expect(story.principles).toEqual([{ title: "A", description: "" }]);
    });

    it("skips malformed items (no title, null, or a bare string) but keeps valid ones", () => {
      const story = mapStory(
        rawStory({
          principles: [
            { title: "Keep me", description: "ok" },
            { description: "no title" } as unknown as RawStorySection,
            null as unknown as RawStorySection,
            "just a string" as unknown as RawStorySection,
            { title: "", description: "empty title" } as RawStorySection,
          ],
        }),
      );
      expect(story.principles).toEqual([
        { title: "Keep me", description: "ok" },
      ]);
    });

    it("returns an empty array when principles is not an array at all", () => {
      const story = mapStory(
        rawStory({
          principles: "not an array" as unknown as RawStorySection[],
        }),
      );
      expect(story.principles).toEqual([]);
    });

    it("returns an empty array for an empty principles list", () => {
      const story = mapStory(rawStory({ principles: [] }));
      expect(story.principles).toEqual([]);
    });

    it("returns new objects rather than reusing the raw references", () => {
      const raw = rawStory({
        principles: [{ title: "A", description: "B" }],
      });
      const story = mapStory(raw);
      expect(story.principles[0]).not.toBe(raw.principles[0]);
      expect(story.principles[0]).toEqual(raw.principles[0]);
    });
  });

  describe("reflections", () => {
    it("maps each item's title and description, in order", () => {
      const story = mapStory(
        rawStory({
          reflections: [{ title: "A", description: "B" }],
        }),
      );
      expect(story.reflections).toEqual([{ title: "A", description: "B" }]);
    });

    it("defaults description to '' when missing", () => {
      const story = mapStory(
        rawStory({
          reflections: [{ title: "A" } as unknown as RawStorySection],
        }),
      );
      expect(story.reflections).toEqual([{ title: "A", description: "" }]);
    });

    it("skips a malformed item with no usable title", () => {
      const story = mapStory(
        rawStory({
          reflections: [
            { title: "Keep me", description: "ok" },
            {} as unknown as RawStorySection,
          ],
        }),
      );
      expect(story.reflections).toEqual([
        { title: "Keep me", description: "ok" },
      ]);
    });

    it("returns an empty array for an empty reflections list", () => {
      const story = mapStory(rawStory({ reflections: [] }));
      expect(story.reflections).toEqual([]);
    });
  });

  describe("walkthroughs", () => {
    it("maps title/subtitle/description through and normalises the image URL", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: [
            {
              image: "https://images.ctfassets.net/abc/pic.webp?h=250",
              title: "Home",
              subtitle: "Discover",
              description: "Reusable widgets.",
            },
          ],
        }),
      );
      expect(story.walkthroughs).toEqual([
        {
          image:
            "https://images.ctfassets.net/abc/pic.webp?w=1200&q=80&fm=webp",
          title: "Home",
          subtitle: "Discover",
          description: "Reusable widgets.",
        },
      ]);
    });

    it("prefixes a protocol-relative walkthrough image with https: and appends the transform", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: [
            {
              image: "//images.ctfassets.net/abc/pic.webp",
              title: "Home",
              subtitle: "",
              description: "",
            },
          ],
        }),
      );
      expect(story.walkthroughs[0].image).toBe(
        "https://images.ctfassets.net/abc/pic.webp?w=1200&q=80&fm=webp",
      );
    });

    it("strips a multi-param baked-in query before appending the transform", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: [
            {
              image:
                "https://images.ctfassets.net/abc/pic.webp?h=250&w=100&fm=jpg",
              title: "Home",
              subtitle: "",
              description: "",
            },
          ],
        }),
      );
      expect(story.walkthroughs[0].image).toBe(
        "https://images.ctfassets.net/abc/pic.webp?w=1200&q=80&fm=webp",
      );
    });

    it("maps an empty-string image to undefined rather than a broken URL", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: [
            { image: "", title: "Onboarding", subtitle: "", description: "" },
          ],
        }),
      );
      expect(story.walkthroughs[0].image).toBeUndefined();
    });

    it("defaults subtitle/description to '' and image to undefined when missing", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: [{ title: "Home" } as unknown as RawStoryWalkthrough],
        }),
      );
      expect(story.walkthroughs[0]).toEqual({
        title: "Home",
        subtitle: "",
        description: "",
        image: undefined,
      });
    });

    it("skips a malformed item with no usable title but keeps valid ones", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: [
            { image: "x", title: "Keep me", subtitle: "s", description: "d" },
            { image: "x" } as unknown as RawStoryWalkthrough,
            null as unknown as RawStoryWalkthrough,
          ],
        }),
      );
      expect(story.walkthroughs).toHaveLength(1);
      expect(story.walkthroughs[0].title).toBe("Keep me");
    });

    it("returns an empty array when walkthroughs is not an array at all", () => {
      const story = mapStory(
        rawStory({
          walkthroughs: {} as unknown as RawStoryWalkthrough[],
        }),
      );
      expect(story.walkthroughs).toEqual([]);
    });

    it("returns an empty array for an empty walkthroughs list", () => {
      const story = mapStory(rawStory({ walkthroughs: [] }));
      expect(story.walkthroughs).toEqual([]);
    });
  });
});
