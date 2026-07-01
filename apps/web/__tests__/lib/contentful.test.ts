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
import { getAbout, getContact, getHero, getProjects } from "@/lib/contentful";
import type {
  RawAboutFields,
  RawContactFields,
  RawHeroFields,
  RawProject,
} from "@/services/contentful/contentful";
import {
  fetchAboutEntry,
  fetchContactEntry,
  fetchHeroEntry,
  fetchProjects,
} from "@/services/contentful/contentful";

jest.mock("@/services/contentful/contentful", () => ({
  fetchHeroEntry: jest.fn(),
  fetchAboutEntry: jest.fn(),
  fetchContactEntry: jest.fn(),
  fetchProjects: jest.fn(),
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
