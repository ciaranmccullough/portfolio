/**
 * @jest-environment node
 *
 * `dictionaries` is a pure data module: `getDictionary` dynamically imports the
 * locale JSON and `getTranslations` resolves it straight from a route segment's
 * `params`. No DOM, no ESM-only deps — the Node runtime is enough.
 */
import { getDictionary, getTranslations } from "@/app/[lang]/dictionaries";

// Import the raw JSON so assertions are pinned to the real content, not a
// hand-copied duplicate that could drift out of sync.
import en from "@/app/[lang]/dictionaries/en.json";

describe("getDictionary", () => {
  it("resolves the en dictionary to a plain object", async () => {
    const dict = await getDictionary("en");

    expect(dict).toBeDefined();
    expect(typeof dict).toBe("object");
    expect(dict).not.toBeNull();
  });

  it("exposes every expected top-level key", async () => {
    const dict = await getDictionary("en");

    expect(Object.keys(dict).sort()).toEqual(
      [
        "metadata",
        "error",
        "nav",
        "hero",
        "work",
        "toolbox",
        "about",
        "contact",
        "footer",
      ].sort(),
    );
  });

  it("carries the specific metadata and contact values from en.json", async () => {
    const dict = await getDictionary("en");

    expect(dict.metadata.title).toBe("Ciaran McCullough - Portfolio");
    expect(dict.metadata.description).toBe(
      "Ciaran McCullough — software engineer building frontend web, hybrid mobile, Android and full-stack products. Selected work, my stack, and how to get in touch.",
    );
    expect(dict.contact.submitLabel).toBe("Send enquiry");
    expect(dict.hero.resumeLabel).toBe("Résumé");
  });

  it("returns structured collections (nav links, toolbox categories) intact", async () => {
    const dict = await getDictionary("en");

    expect(Array.isArray(dict.nav.links)).toBe(true);
    expect(dict.nav.links).toHaveLength(3);
    expect(dict.nav.links[0]).toEqual({ label: "Work", href: "#work" });
    expect(dict.nav.cta).toEqual({ label: "Let's talk", href: "#contact" });

    expect(Array.isArray(dict.toolbox.categories)).toBe(true);
    expect(dict.toolbox.categories.map((c) => c.title)).toEqual([
      "Languages",
      "Frameworks",
      "Craft",
      "Tooling",
    ]);
  });

  it("deep-equals the source en.json", async () => {
    const dict = await getDictionary("en");

    expect(dict).toEqual(en);
  });

  it("resolves to the same underlying content on repeated calls", async () => {
    const [first, second] = await Promise.all([
      getDictionary("en"),
      getDictionary("en"),
    ]);

    expect(first).toEqual(second);
  });
});

describe("getTranslations", () => {
  it("resolves the dictionary from a params promise", async () => {
    const dict = await getTranslations(Promise.resolve({ lang: "en" }));

    expect(dict.metadata.title).toBe("Ciaran McCullough - Portfolio");
    expect(dict.contact.submitLabel).toBe("Send enquiry");
  });

  it("returns the same dictionary as getDictionary('en')", async () => {
    const [viaParams, viaDirect] = await Promise.all([
      getTranslations(Promise.resolve({ lang: "en" })),
      getDictionary("en"),
    ]);

    expect(viaParams).toEqual(viaDirect);
  });

  it("awaits the params promise before resolving the lang", async () => {
    // A deferred params promise proves getTranslations does not read `lang`
    // synchronously — it must await the argument first.
    let release: (value: { lang: string }) => void = () => {};
    const params = new Promise<{ lang: string }>((resolve) => {
      release = resolve;
    });

    const pending = getTranslations(params);
    release({ lang: "en" });

    await expect(pending).resolves.toEqual(en);
  });
});
