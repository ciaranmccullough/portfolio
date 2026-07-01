/**
 * @jest-environment node
 */
import { localePath } from "@/lib/localePath";

describe("localePath", () => {
  it("serves the default locale without a prefix", () => {
    expect(localePath("en", "/privacy")).toBe("/privacy");
    expect(localePath("en", "/terms")).toBe("/terms");
    expect(localePath("en", "/")).toBe("/");
  });

  it("prefixes a non-default locale", () => {
    expect(localePath("de", "/privacy")).toBe("/de/privacy");
    expect(localePath("de", "/")).toBe("/de");
  });
});
