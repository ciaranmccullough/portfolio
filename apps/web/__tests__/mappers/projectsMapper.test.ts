import { mapProjects } from "@/mappers/projectsMapper";
import type { RawProject } from "@/services/contentful/contentful";
import type { Project } from "@/types/project";

describe("mapProjects", () => {
  it("maps a fully-populated raw project, renaming link->href and tabs->tags", () => {
    const raw: RawProject[] = [
      {
        id: "ea-sports-app",
        title: "Design System",
        description: "A component library",
        imageUrl: "https://images.ctfassets.net/abc/logo.png",
        link: "https://example.com/design-system",
        tabs: ["React", "TypeScript", "Storybook"],
        isStoryProject: true,
      },
    ];

    const [project] = mapProjects(raw);

    expect(project).toEqual<Project>({
      id: "ea-sports-app",
      title: "Design System",
      description: "A component library",
      href: "https://example.com/design-system",
      tags: ["React", "TypeScript", "Storybook"],
      imageUrl: "https://images.ctfassets.net/abc/logo.png?w=1200&q=80&fm=webp",
      isStoryProject: true,
    });
  });

  it("maps each element of a multi-item array in order", () => {
    const raw: RawProject[] = [
      { title: "One", link: "https://one.dev", tabs: ["a"] },
      { title: "Two", link: "https://two.dev", tabs: ["b"] },
    ];

    const projects = mapProjects(raw);

    expect(projects).toHaveLength(2);
    expect(projects[0].title).toBe("One");
    expect(projects[0].href).toBe("https://one.dev");
    expect(projects[0].tags).toEqual(["a"]);
    expect(projects[1].title).toBe("Two");
    expect(projects[1].href).toBe("https://two.dev");
    expect(projects[1].tags).toEqual(["b"]);
  });

  it("returns an empty array for an empty input", () => {
    expect(mapProjects([])).toEqual([]);
  });

  it("passes the title through unchanged", () => {
    const [project] = mapProjects([{ title: "Untouched Title" }]);
    expect(project.title).toBe("Untouched Title");
  });

  describe("description defaulting", () => {
    it("defaults description to '' when undefined", () => {
      const [project] = mapProjects([{ title: "No description" }]);
      expect(project.description).toBe("");
    });

    it("preserves an explicitly empty description", () => {
      const [project] = mapProjects([
        { title: "Empty description", description: "" },
      ]);
      expect(project.description).toBe("");
    });

    it("keeps a provided description", () => {
      const [project] = mapProjects([
        { title: "Has description", description: "hello" },
      ]);
      expect(project.description).toBe("hello");
    });
  });

  describe("href (link) defaulting", () => {
    it("defaults href to '' when link is undefined", () => {
      const [project] = mapProjects([{ title: "No link" }]);
      expect(project.href).toBe("");
    });

    it("preserves an explicitly empty link", () => {
      const [project] = mapProjects([{ title: "Empty link", link: "" }]);
      expect(project.href).toBe("");
    });
  });

  describe("tags (tabs) defaulting", () => {
    it("defaults tags to [] when tabs is undefined", () => {
      const [project] = mapProjects([{ title: "No tabs" }]);
      expect(project.tags).toEqual([]);
    });

    it("preserves an explicitly empty tabs array", () => {
      const [project] = mapProjects([{ title: "Empty tabs", tabs: [] }]);
      expect(project.tags).toEqual([]);
    });
  });

  describe("toProjectImageUrl (via imageUrl)", () => {
    it("returns '' when imageUrl is undefined", () => {
      const [project] = mapProjects([{ title: "No image" }]);
      expect(project.imageUrl).toBe("");
    });

    it("adds an https scheme to a protocol-relative URL and appends the transform", () => {
      const [project] = mapProjects([
        {
          title: "Protocol-relative",
          imageUrl: "//images.ctfassets.net/abc/pic.png",
        },
      ]);
      expect(project.imageUrl).toBe(
        "https://images.ctfassets.net/abc/pic.png?w=1200&q=80&fm=webp",
      );
    });

    it("leaves an absolute https URL scheme intact and appends the transform", () => {
      const [project] = mapProjects([
        {
          title: "Absolute",
          imageUrl: "https://images.ctfassets.net/abc/pic.png",
        },
      ]);
      expect(project.imageUrl).toBe(
        "https://images.ctfassets.net/abc/pic.png?w=1200&q=80&fm=webp",
      );
    });

    it("strips a baked-in query (e.g. ?h=250) before appending the transform", () => {
      const [project] = mapProjects([
        {
          title: "Baked-in query",
          imageUrl: "//images.ctfassets.net/abc/pic.png?h=250",
        },
      ]);
      expect(project.imageUrl).toBe(
        "https://images.ctfassets.net/abc/pic.png?w=1200&q=80&fm=webp",
      );
    });

    it("strips a multi-param baked-in query before appending the transform", () => {
      const [project] = mapProjects([
        {
          title: "Multi-param query",
          imageUrl:
            "https://images.ctfassets.net/abc/pic.png?h=250&w=100&fm=jpg",
        },
      ]);
      expect(project.imageUrl).toBe(
        "https://images.ctfassets.net/abc/pic.png?w=1200&q=80&fm=webp",
      );
    });
  });

  it("applies all defaults at once for a raw project with only a title", () => {
    const [project] = mapProjects([{ title: "Minimal" }]);
    expect(project).toEqual<Project>({
      id: undefined,
      title: "Minimal",
      description: "",
      href: "",
      tags: [],
      imageUrl: "",
      isStoryProject: false,
    });
  });

  describe("id passthrough", () => {
    it("passes the id through when present", () => {
      const [project] = mapProjects([
        { id: "ea-sports-app", title: "EA Sports App" },
      ]);
      expect(project.id).toBe("ea-sports-app");
    });

    it("leaves id undefined when absent (CMS items that predate the field)", () => {
      const [project] = mapProjects([{ title: "No id" }]);
      expect(project.id).toBeUndefined();
    });

    it("maps each item's id independently in a multi-item array", () => {
      const projects = mapProjects([
        { id: "one", title: "One" },
        { title: "Two" },
        { id: "three", title: "Three" },
      ]);
      expect(projects.map((p) => p.id)).toEqual(["one", undefined, "three"]);
    });
  });

  describe("isStoryProject defaulting", () => {
    it("defaults to false when absent (CMS items that predate the field)", () => {
      const [project] = mapProjects([{ title: "No isStoryProject" }]);
      expect(project.isStoryProject).toBe(false);
    });

    it("defaults to false when explicitly null", () => {
      const [project] = mapProjects([
        {
          title: "Null isStoryProject",
          isStoryProject: null as unknown as boolean | undefined,
        },
      ]);
      expect(project.isStoryProject).toBe(false);
    });

    it("preserves an explicit true", () => {
      const [project] = mapProjects([
        { title: "Story project", isStoryProject: true },
      ]);
      expect(project.isStoryProject).toBe(true);
    });

    it("preserves an explicit false", () => {
      const [project] = mapProjects([
        { title: "Not a story project", isStoryProject: false },
      ]);
      expect(project.isStoryProject).toBe(false);
    });

    it("maps each item's isStoryProject independently in a multi-item array", () => {
      const projects = mapProjects([
        { title: "One", isStoryProject: true },
        { title: "Two" },
        { title: "Three", isStoryProject: false },
      ]);
      expect(projects.map((p) => p.isStoryProject)).toEqual([
        true,
        false,
        false,
      ]);
    });
  });
});
