import { mapOpenSource } from "@/mappers/openSourceMapper";
import type { RawRepo } from "@/services/contentful/contentful";
import type { Repo } from "@/types/openSource";

describe("mapOpenSource", () => {
  it("maps a fully-populated raw repo, keeping a valid tone", () => {
    const raw: RawRepo[] = [
      {
        name: "ciaran/isotope-ui",
        href: "https://github.com/ciaranmccullough/isotope-ui",
        description: "A tiny, tree-shakeable UI kit",
        lang: "TypeScript",
        stars: "1.2k",
        tone: "violet",
      },
    ];

    expect(mapOpenSource(raw)).toEqual<Repo[]>([
      {
        name: "ciaran/isotope-ui",
        href: "https://github.com/ciaranmccullough/isotope-ui",
        description: "A tiny, tree-shakeable UI kit",
        lang: "TypeScript",
        stars: "1.2k",
        tone: "violet",
      },
    ]);
  });

  it("keeps a minimal { name, href } repo, dropping the optional fields", () => {
    const [repo] = mapOpenSource([
      {
        name: "isotope-ui",
        href: "https://github.com/ciaranmccullough/isotope-ui",
      },
    ]);

    expect(repo).toEqual<Repo>({
      name: "isotope-ui",
      href: "https://github.com/ciaranmccullough/isotope-ui",
      description: undefined,
      lang: undefined,
      stars: undefined,
      tone: undefined,
    });
  });

  it("maps each element of a multi-item array in order", () => {
    const repos = mapOpenSource([
      { name: "one", href: "https://one.dev" },
      { name: "two", href: "https://two.dev" },
    ]);

    expect(repos).toHaveLength(2);
    expect(repos[0].name).toBe("one");
    expect(repos[1].name).toBe("two");
  });

  it("returns an empty array for an empty input", () => {
    expect(mapOpenSource([])).toEqual([]);
  });

  describe("tone validation", () => {
    it.each(["violet", "orange", "green", "amber"] as const)(
      "keeps the valid tone %s",
      (tone) => {
        const [repo] = mapOpenSource([
          { name: "r", href: "https://x.dev", tone },
        ]);
        expect(repo.tone).toBe(tone);
      },
    );

    it("drops an unrecognised tone", () => {
      const [repo] = mapOpenSource([
        { name: "r", href: "https://x.dev", tone: "fuchsia" },
      ]);
      expect(repo.tone).toBeUndefined();
    });
  });

  describe("stars coercion", () => {
    it("stringifies a numeric star count", () => {
      const [repo] = mapOpenSource([
        { name: "r", href: "https://x.dev", stars: 1200 },
      ]);
      expect(repo.stars).toBe("1200");
    });

    it("keeps the numeric zero (renders '0', not dropped)", () => {
      const [repo] = mapOpenSource([
        { name: "r", href: "https://x.dev", stars: 0 },
      ]);
      expect(repo.stars).toBe("0");
    });

    it("treats an empty-string star label as absent", () => {
      const [repo] = mapOpenSource([
        { name: "r", href: "https://x.dev", stars: "" },
      ]);
      expect(repo.stars).toBeUndefined();
    });
  });

  it("treats empty description/lang strings as absent", () => {
    const [repo] = mapOpenSource([
      { name: "r", href: "https://x.dev", description: "", lang: "" },
    ]);
    expect(repo.description).toBeUndefined();
    expect(repo.lang).toBeUndefined();
  });
});
