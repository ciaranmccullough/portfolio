import { screenFromPathname } from "@/lib/analytics/screen";

describe("screenFromPathname", () => {
  it.each([
    ["/", "home"],
    ["/en", "home"],
    ["/en/", "home"],
    ["/en/privacy", "privacy"],
    ["/en/terms", "terms"],
    // Locale-less paths (e.g. before the proxy redirect) still map correctly.
    ["/privacy", "privacy"],
    ["/terms", "terms"],
  ])("maps %s to the %s screen", (pathname, expected) => {
    expect(screenFromPathname(pathname)).toBe(expected);
  });
});
