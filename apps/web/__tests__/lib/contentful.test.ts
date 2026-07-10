/**
 * @jest-environment node
 *
 * Server-side data-access layer (`lib/contentful.ts`).
 *
 * These functions compose the Contentful service (fetch) with the pure mappers
 * (map) and add an ISR cache plus a null-on-error fallback. We mock the service
 * so no real network happens, and unwrap `unstable_cache` to a passthrough so
 * the wrapped fetch+map runs directly (the module only caches in production
 * anyway, but the mock keeps the test independent of `NODE_ENV`).
 *
 * The mappers are pure and left un-mocked: for each entity we build a raw DTO
 * exactly as the service would return it, then assert the fully-mapped entity.
 */
import type { Document } from "@contentful/rich-text-types";

import {
  STORY_FETCH_ERROR,
  getAbout,
  getContact,
  getHero,
  getPrivacyPolicy,
  getProjects,
  getStory,
  getTermsAndConditions,
} from "@/lib/contentful";
import type {
  RawAboutFields,
  RawContactFields,
  RawHeroFields,
  RawProject,
  RawStoryFields,
} from "@/services/contentful/contentful";
import {
  fetchAboutEntry,
  fetchContactEntry,
  fetchHeroEntry,
  fetchLegalDocument,
  fetchProjects,
  fetchStoryEntry,
} from "@/services/contentful/contentful";

jest.mock("@/services/contentful/contentful", () => ({
  fetchHeroEntry: jest.fn(),
  fetchAboutEntry: jest.fn(),
  fetchContactEntry: jest.fn(),
  fetchProjects: jest.fn(),
  fetchStoryEntry: jest.fn(),
  fetchLegalDocument: jest.fn(),
  PRIVACY_CONTENT_TYPES: ["privacyPolicy"],
  TERMS_CONTENT_TYPES: ["termsAndConditions", "terms"],
}));

// unstable_cache wraps a fn and returns a cached variant; unwrap to passthrough
// so the composed fetch+map runs directly and deterministically in tests.
jest.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

const mockFetchHeroEntry = jest.mocked(fetchHeroEntry);
const mockFetchAboutEntry = jest.mocked(fetchAboutEntry);
const mockFetchContactEntry = jest.mocked(fetchContactEntry);
const mockFetchProjects = jest.mocked(fetchProjects);
const mockFetchStoryEntry = jest.mocked(fetchStoryEntry);
const mockFetchLegalDocument = jest.mocked(fetchLegalDocument);

/** A minimal, valid Rich Text document (one paragraph). */
const sampleDocument = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: "Hello.", marks: [], data: {} }],
    },
  ],
} as unknown as Document;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getHero()", () => {
  it("maps a resolved raw entry into the Hero entity", async () => {
    const raw: RawHeroFields = {
      titleRichText: {
        nodeType: "document",
        content: [
          {
            nodeType: "paragraph",
            content: [
              { nodeType: "text", value: "Hi, I'm " },
              {
                nodeType: "text",
                value: "Ciaran",
                marks: [{ type: "bold" }],
              },
            ],
          },
        ],
      },
      description: "A frontend engineer.",
      resume: "https://example.com/cv.pdf",
    };
    mockFetchHeroEntry.mockResolvedValue(raw);

    const result = await getHero();

    // mapHero flattens the rich text: each text run becomes a segment, bold
    // marks flag `highlight`; description passes through; resume -> resumeUrl.
    expect(result).toEqual({
      title: [
        { text: "Hi, I'm ", highlight: false },
        { text: "Ciaran", highlight: true },
      ],
      description: "A frontend engineer.",
      resumeUrl: "https://example.com/cv.pdf",
    });
    expect(mockFetchHeroEntry).toHaveBeenCalledTimes(1);
  });

  it("returns null when the entry is missing (fetch resolves null)", async () => {
    mockFetchHeroEntry.mockResolvedValue(null);

    await expect(getHero()).resolves.toBeNull();
  });

  it("returns null (never throws) when the fetch rejects", async () => {
    mockFetchHeroEntry.mockRejectedValue(new Error("network down"));

    await expect(getHero()).resolves.toBeNull();
  });
});

describe("getAbout()", () => {
  it("maps a resolved raw entry into the About entity", async () => {
    const raw: RawAboutFields = {
      title: "About me",
      description: "Ten years shipping UI.",
      // protocol-relative URL — mapper prefixes https:
      imageUrl: "//images.ctfassets.net/portrait.jpg",
      tabs: [
        { title: "Craft", description: "Detail obsessed." },
        { title: "Team", description: "Ships together." },
      ],
    };
    mockFetchAboutEntry.mockResolvedValue(raw);

    const result = await getAbout();

    expect(result).toEqual({
      title: "About me",
      description: "Ten years shipping UI.",
      imageUrl: "https://images.ctfassets.net/portrait.jpg",
      tabs: [
        { title: "Craft", description: "Detail obsessed." },
        { title: "Team", description: "Ships together." },
      ],
    });
    expect(mockFetchAboutEntry).toHaveBeenCalledTimes(1);
  });

  it("returns null when the entry is missing (fetch resolves null)", async () => {
    mockFetchAboutEntry.mockResolvedValue(null);

    await expect(getAbout()).resolves.toBeNull();
  });

  it("returns null (never throws) when the fetch rejects", async () => {
    mockFetchAboutEntry.mockRejectedValue(new Error("boom"));

    await expect(getAbout()).resolves.toBeNull();
  });
});

describe("getContact()", () => {
  it("maps a resolved raw entry into the Contact entity", async () => {
    const raw: RawContactFields = {
      title: "Get in touch",
      description: "Say hi.",
      links: [
        "https://github.com/example",
        "Email | https://mail.example.com",
        "not a url", // unrecognisable -> dropped by the mapper
      ],
    };
    mockFetchContactEntry.mockResolvedValue(raw);

    const result = await getContact();

    // mapContact: description -> intro; each link parsed, nulls filtered out.
    // Bare GitHub URL -> friendly host label with the ↗ affordance; the
    // `Label | URL` pair keeps its explicit label; the bare string is dropped.
    expect(result).toEqual({
      title: "Get in touch",
      intro: "Say hi.",
      socials: [
        { label: "GitHub ↗", href: "https://github.com/example" },
        { label: "Email", href: "https://mail.example.com" },
      ],
    });
    expect(mockFetchContactEntry).toHaveBeenCalledTimes(1);
  });

  it("returns null when the entry is missing (fetch resolves null)", async () => {
    mockFetchContactEntry.mockResolvedValue(null);

    await expect(getContact()).resolves.toBeNull();
  });

  it("returns null (never throws) when the fetch rejects", async () => {
    mockFetchContactEntry.mockRejectedValue(new Error("boom"));

    await expect(getContact()).resolves.toBeNull();
  });
});

describe("getProjects()", () => {
  it("maps a resolved raw list into Project entities", async () => {
    const raw: RawProject[] = [
      {
        title: "Portfolio",
        description: "This very site.",
        // protocol-relative + baked-in transform; mapper rewrites the query.
        imageUrl: "//images.ctfassets.net/portfolio.png?h=250",
        link: "https://example.com/portfolio",
        tabs: ["Next.js", "TypeScript"],
      },
    ];
    mockFetchProjects.mockResolvedValue(raw);

    const result = await getProjects();

    // mapProjects: link -> href, tabs -> tags; image normalised to a crisp WebP
    // (scheme added, old ?h=250 dropped, ?w=1200&q=80&fm=webp appended).
    expect(result).toEqual([
      {
        title: "Portfolio",
        description: "This very site.",
        href: "https://example.com/portfolio",
        tags: ["Next.js", "TypeScript"],
        imageUrl:
          "https://images.ctfassets.net/portfolio.png?w=1200&q=80&fm=webp",
      },
    ]);
    expect(mockFetchProjects).toHaveBeenCalledTimes(1);
  });

  it("maps an empty raw list to an empty array (not null)", async () => {
    mockFetchProjects.mockResolvedValue([]);

    await expect(getProjects()).resolves.toEqual([]);
  });

  it("returns null when the entry is missing (fetch resolves null)", async () => {
    mockFetchProjects.mockResolvedValue(null);

    await expect(getProjects()).resolves.toBeNull();
  });

  it("returns null (never throws) when the fetch rejects", async () => {
    mockFetchProjects.mockRejectedValue(new Error("boom"));

    await expect(getProjects()).resolves.toBeNull();
  });
});

describe("getStory()", () => {
  const raw: RawStoryFields = {
    id: "ea-sports-app",
    title: "Bringing Fans Closer to Sports",
    description: "The EA SPORTS App offers news, highlights, stats & scores.",
    role: "Software Engineer",
    platform: "Android | Jetpack Compose",
    year: "2024 - Now",
    brief: sampleDocument,
    titlePrinciples: "Three ideas that held it together",
    principles: [
      {
        title: "Instant, even on launch",
        description: "Performance came first.",
      },
    ],
    titleWalkthrough: "Five surfaces, one story",
    walkthroughs: [
      {
        image: "https://images.ctfassets.net/abc/onboarding.webp?h=250",
        title: "Onboarding",
        subtitle: "Personalised content",
        description: "Client-side logic that generates personalised content.",
      },
    ],
    titleReflection: "What it taught me",
    reflections: [
      {
        title: "Perceived speed is a feature",
        description: "Optimistic updates help.",
      },
    ],
    titleRole: "What I owned across the app",
    descriptionRole:
      "As a Software Engineer on the app, I shipped the onboarding flow.",
    // protocol-relative — mapper prefixes https:, no resize transform appended.
    backgroundImageUrl: "//images.ctfassets.net/abc/easa.webp",
  };

  it("maps a resolved raw entry into the Story entity and passes the id through to fetchStoryEntry", async () => {
    mockFetchStoryEntry.mockResolvedValue(raw);

    const result = await getStory("ea-sports-app");

    // mapStory: walkthrough image loses its ?h=250 and gains the crisp-render
    // transform; backgroundImageUrl only gains the https: scheme.
    expect(result).toEqual({
      id: "ea-sports-app",
      title: "Bringing Fans Closer to Sports",
      description: "The EA SPORTS App offers news, highlights, stats & scores.",
      role: "Software Engineer",
      platform: "Android | Jetpack Compose",
      year: "2024 - Now",
      brief: sampleDocument,
      titlePrinciples: "Three ideas that held it together",
      principles: [
        {
          title: "Instant, even on launch",
          description: "Performance came first.",
        },
      ],
      titleWalkthrough: "Five surfaces, one story",
      walkthroughs: [
        {
          image:
            "https://images.ctfassets.net/abc/onboarding.webp?w=1200&q=80&fm=webp",
          title: "Onboarding",
          subtitle: "Personalised content",
          description: "Client-side logic that generates personalised content.",
        },
      ],
      titleReflection: "What it taught me",
      reflections: [
        {
          title: "Perceived speed is a feature",
          description: "Optimistic updates help.",
        },
      ],
      titleRole: "What I owned across the app",
      descriptionRole:
        "As a Software Engineer on the app, I shipped the onboarding flow.",
      backgroundImageUrl: "https://images.ctfassets.net/abc/easa.webp",
    });
    expect(mockFetchStoryEntry).toHaveBeenCalledWith("ea-sports-app");
    expect(mockFetchStoryEntry).toHaveBeenCalledTimes(1);
  });

  it("returns null (not STORY_FETCH_ERROR) when no entry matches the id", async () => {
    mockFetchStoryEntry.mockResolvedValue(null);

    await expect(getStory("no-such-story")).resolves.toBeNull();
  });

  it("returns STORY_FETCH_ERROR (never null, never throws) when the fetch rejects", async () => {
    mockFetchStoryEntry.mockRejectedValue(new Error("network down"));

    await expect(getStory("ea-sports-app")).resolves.toBe(STORY_FETCH_ERROR);
  });

  it("keeps null and STORY_FETCH_ERROR distinguishable from each other", () => {
    expect(STORY_FETCH_ERROR).not.toBeNull();
    expect(typeof STORY_FETCH_ERROR).toBe("string");
  });
});

describe("getPrivacyPolicy()", () => {
  it("returns the Rich Text document from the service", async () => {
    mockFetchLegalDocument.mockResolvedValue(sampleDocument);

    await expect(getPrivacyPolicy()).resolves.toEqual(sampleDocument);
    expect(mockFetchLegalDocument).toHaveBeenCalledWith(["privacyPolicy"]);
  });

  it("returns null when nothing is published (fetch resolves null)", async () => {
    mockFetchLegalDocument.mockResolvedValue(null);

    await expect(getPrivacyPolicy()).resolves.toBeNull();
  });

  it("returns null (never throws) when the fetch rejects", async () => {
    mockFetchLegalDocument.mockRejectedValue(new Error("boom"));

    await expect(getPrivacyPolicy()).resolves.toBeNull();
  });
});

describe("getTermsAndConditions()", () => {
  it("returns the Rich Text document from the service", async () => {
    mockFetchLegalDocument.mockResolvedValue(sampleDocument);

    await expect(getTermsAndConditions()).resolves.toEqual(sampleDocument);
    expect(mockFetchLegalDocument).toHaveBeenCalledWith([
      "termsAndConditions",
      "terms",
    ]);
  });

  it("returns null when nothing is published (fetch resolves null)", async () => {
    mockFetchLegalDocument.mockResolvedValue(null);

    await expect(getTermsAndConditions()).resolves.toBeNull();
  });

  it("returns null (never throws) when the fetch rejects", async () => {
    mockFetchLegalDocument.mockRejectedValue(new Error("boom"));

    await expect(getTermsAndConditions()).resolves.toBeNull();
  });
});
