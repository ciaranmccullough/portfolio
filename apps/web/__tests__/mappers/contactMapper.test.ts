import { mapContact } from "@/mappers/contactMapper";
import type { RawContactFields } from "@/services/contentful/contentful";

/** Map a single raw `links` entry and return the resulting social link (or undefined). */
function socialFrom(link: string) {
  return mapContact({ title: "Contact", links: [link] }).socials[0];
}

describe("mapContact", () => {
  describe("scalar fields", () => {
    it("passes the title through unchanged", () => {
      const contact = mapContact({ title: "Get in touch" });
      expect(contact.title).toBe("Get in touch");
    });

    it("defaults intro to an empty string when description is undefined", () => {
      const contact = mapContact({ title: "Contact" });
      expect(contact.intro).toBe("");
    });

    it("passes description through as intro when present", () => {
      const contact = mapContact({
        title: "Contact",
        description: "Say hello",
      });
      expect(contact.intro).toBe("Say hello");
    });

    it("returns an empty socials array when links is undefined", () => {
      const contact = mapContact({ title: "Contact" });
      expect(contact.socials).toEqual([]);
    });

    it("returns an empty socials array when links is an empty array", () => {
      const contact = mapContact({ title: "Contact", links: [] });
      expect(contact.socials).toEqual([]);
    });
  });

  describe("parseLink — explicit Label | URL pairs", () => {
    it("parses the pipe form into { label, href }", () => {
      expect(socialFrom("Label | https://x.com/a")).toEqual({
        label: "Label",
        href: "https://x.com/a",
      });
    });

    it("parses the comma form into { label, href }", () => {
      expect(socialFrom("Label , https://x.com/a")).toEqual({
        label: "Label",
        href: "https://x.com/a",
      });
    });

    it("trims whitespace around the label and href", () => {
      expect(socialFrom("  My Site  |  https://example.com/p  ")).toEqual({
        label: "My Site",
        href: "https://example.com/p",
      });
    });

    it("keeps a multi-word label intact (non-greedy left side, host on the right)", () => {
      expect(socialFrom("Read my blog | https://example.com/blog")).toEqual({
        label: "Read my blog",
        href: "https://example.com/blog",
      });
    });
  });

  describe("parseLink — bare URLs with derived host labels", () => {
    it("labels a bare github.com URL as 'GitHub ↗'", () => {
      expect(socialFrom("https://github.com/u")).toEqual({
        label: "GitHub ↗",
        href: "https://github.com/u",
      });
    });

    it("strips a leading www. before deriving the linkedin label", () => {
      expect(socialFrom("https://www.linkedin.com/in/u")).toEqual({
        label: "LinkedIn ↗",
        href: "https://www.linkedin.com/in/u",
      });
    });

    it("labels a bare twitter.com URL as 'X ↗'", () => {
      expect(socialFrom("https://twitter.com/u")).toEqual({
        label: "X ↗",
        href: "https://twitter.com/u",
      });
    });

    it("labels a bare x.com URL as 'X ↗'", () => {
      expect(socialFrom("https://x.com/u")).toEqual({
        label: "X ↗",
        href: "https://x.com/u",
      });
    });

    it("falls back to the bare host for an unknown domain", () => {
      expect(socialFrom("https://example.com/p")).toEqual({
        label: "example.com ↗",
        href: "https://example.com/p",
      });
    });

    it("lowercases the host when deriving the fallback label", () => {
      expect(socialFrom("https://EXAMPLE.com/p")).toEqual({
        label: "example.com ↗",
        href: "https://EXAMPLE.com/p",
      });
    });

    it("accepts http as well as https for a bare URL", () => {
      expect(socialFrom("http://github.com/u")).toEqual({
        label: "GitHub ↗",
        href: "http://github.com/u",
      });
    });
  });

  describe("parseLink — dropped (unrecognizable) entries", () => {
    it("drops plain junk text that is neither a pair nor a URL", () => {
      const contact = mapContact({ title: "Contact", links: ["hello world"] });
      expect(contact.socials).toEqual([]);
    });

    it("drops an empty string", () => {
      const contact = mapContact({ title: "Contact", links: [""] });
      expect(contact.socials).toEqual([]);
    });

    it("drops a whitespace-only string", () => {
      const contact = mapContact({ title: "Contact", links: ["   "] });
      expect(contact.socials).toEqual([]);
    });
  });

  describe("mapping multiple links", () => {
    it("maps recognizable links in order and filters out junk", () => {
      const raw: RawContactFields = {
        title: "Contact",
        description: "Links below",
        links: [
          "https://github.com/u",
          "not a link",
          "Email | https://example.com/mail",
          "",
        ],
      };
      const contact = mapContact(raw);
      expect(contact.socials).toEqual([
        { label: "GitHub ↗", href: "https://github.com/u" },
        { label: "Email", href: "https://example.com/mail" },
      ]);
    });
  });
});
