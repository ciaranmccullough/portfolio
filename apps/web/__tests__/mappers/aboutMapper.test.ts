import { mapAbout } from "@/mappers/aboutMapper";
import type { RawAboutFields } from "@/services/contentful/contentful";

/** A fully-populated raw "about" DTO; individual tests override single fields. */
function rawAbout(overrides: Partial<RawAboutFields> = {}): RawAboutFields {
  return {
    title: "About me",
    description: "A short bio",
    imageUrl: "//images.ctfassets.net/portrait.jpg",
    tabs: [{ title: "Craft", description: "I care about details" }],
    ...overrides,
  };
}

describe("mapAbout", () => {
  it("passes the title through unchanged", () => {
    const about = mapAbout(rawAbout({ title: "Ciaran McCullough" }));
    expect(about.title).toBe("Ciaran McCullough");
  });

  describe("description", () => {
    it("passes a provided description through unchanged", () => {
      const about = mapAbout(rawAbout({ description: "Building things" }));
      expect(about.description).toBe("Building things");
    });

    it("defaults to an empty string when description is undefined", () => {
      const about = mapAbout(rawAbout({ description: undefined }));
      expect(about.description).toBe("");
    });

    it("keeps an explicit empty-string description", () => {
      const about = mapAbout(rawAbout({ description: "" }));
      expect(about.description).toBe("");
    });
  });

  describe("imageUrl (toHttpsUrl)", () => {
    it("prefixes a protocol-relative URL with https:", () => {
      const about = mapAbout(
        rawAbout({ imageUrl: "//images.ctfassets.net/x" }),
      );
      expect(about.imageUrl).toBe("https://images.ctfassets.net/x");
    });

    it("leaves an already-absolute https URL unchanged", () => {
      const about = mapAbout(
        rawAbout({ imageUrl: "https://images.ctfassets.net/x" }),
      );
      expect(about.imageUrl).toBe("https://images.ctfassets.net/x");
    });

    it("leaves an already-absolute http URL unchanged", () => {
      const about = mapAbout(
        rawAbout({ imageUrl: "http://images.ctfassets.net/x" }),
      );
      expect(about.imageUrl).toBe("http://images.ctfassets.net/x");
    });

    it("defaults to an empty string when imageUrl is undefined", () => {
      const about = mapAbout(rawAbout({ imageUrl: undefined }));
      expect(about.imageUrl).toBe("");
    });

    it("defaults to an empty string when imageUrl is an empty string", () => {
      const about = mapAbout(rawAbout({ imageUrl: "" }));
      expect(about.imageUrl).toBe("");
    });
  });

  describe("tabs", () => {
    it("maps each tab to its title and description", () => {
      const about = mapAbout(
        rawAbout({
          tabs: [
            { title: "Craft", description: "Details matter" },
            { title: "Team", description: "Ship together" },
          ],
        }),
      );
      expect(about.tabs).toEqual([
        { title: "Craft", description: "Details matter" },
        { title: "Team", description: "Ship together" },
      ]);
    });

    it("defaults to an empty array when tabs is undefined", () => {
      // `tabs` is required by the DTO type, but the mapper defensively coalesces
      // a missing value; force the undefined case a real payload could hit.
      const about = mapAbout(
        rawAbout({ tabs: undefined as unknown as RawAboutFields["tabs"] }),
      );
      expect(about.tabs).toEqual([]);
    });

    it("returns an empty array for an empty tabs list", () => {
      const about = mapAbout(rawAbout({ tabs: [] }));
      expect(about.tabs).toEqual([]);
    });

    it("returns a new tab object rather than reusing the raw reference", () => {
      const raw = rawAbout({
        tabs: [{ title: "Craft", description: "Details matter" }],
      });
      const about = mapAbout(raw);
      expect(about.tabs[0]).not.toBe(raw.tabs[0]);
      expect(about.tabs[0]).toEqual(raw.tabs[0]);
    });
  });

  it("maps a fully-populated entry into the About entity", () => {
    const about = mapAbout({
      title: "About me",
      description: "A short bio",
      imageUrl: "//images.ctfassets.net/portrait.jpg",
      tabs: [{ title: "Craft", description: "I care about details" }],
    });
    expect(about).toEqual({
      title: "About me",
      description: "A short bio",
      imageUrl: "https://images.ctfassets.net/portrait.jpg",
      tabs: [{ title: "Craft", description: "I care about details" }],
    });
  });
});
