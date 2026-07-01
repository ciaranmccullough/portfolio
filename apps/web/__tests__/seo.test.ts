/**
 * SEO route handlers: robots.txt and sitemap.xml.
 *
 * Both are plain default-exported functions that build Next's metadata
 * descriptors from the canonical SITE_URL, so no environment override or
 * module mocking is required.
 */
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/site-config";

describe("robots() — /robots.txt descriptor", () => {
  it("allows the whole site for every crawler", () => {
    const { rules } = robots();
    // Single rule object (not an array) for this simple site.
    expect(Array.isArray(rules)).toBe(false);
    const rule = rules as { userAgent?: string; allow?: string };
    expect(rule.userAgent).toBe("*");
    expect(rule.allow).toBe("/");
  });

  it("points crawlers at the sitemap on the canonical origin", () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("declares the canonical host", () => {
    expect(robots().host).toBe(SITE_URL);
  });

  it("does not disallow anything", () => {
    const rule = robots().rules as { disallow?: string | string[] };
    expect(rule.disallow).toBeUndefined();
  });
});

describe("sitemap() — /sitemap.xml descriptor", () => {
  it("returns exactly one entry for the single-page site", () => {
    expect(sitemap()).toHaveLength(1);
  });

  it("uses the canonical SITE_URL as the entry url", () => {
    expect(sitemap()[0].url).toBe(SITE_URL);
  });

  it("marks the entry as top priority (1)", () => {
    expect(sitemap()[0].priority).toBe(1);
  });

  it("sets a monthly change frequency", () => {
    expect(sitemap()[0].changeFrequency).toBe("monthly");
  });

  it("stamps lastModified as a Date instance", () => {
    const { lastModified } = sitemap()[0];
    expect(lastModified).toBeInstanceOf(Date);
    // A real timestamp, not an Invalid Date.
    expect(Number.isNaN((lastModified as Date).getTime())).toBe(false);
  });
});
