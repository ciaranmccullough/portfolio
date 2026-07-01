/**
 * @jest-environment node
 *
 * The proxy uses `next/server` (NextRequest/NextResponse), which needs the Node
 * runtime's web globals — not jsdom.
 */
import { NextRequest } from "next/server";

import { proxy } from "@/proxy";

// `@formatjs/intl-localematcher` ships ESM, and next/jest deliberately skips
// transforming node_modules — so stub its `match` with an equivalent picker:
// the first requested locale whose base language is supported, else the default.
jest.mock("@formatjs/intl-localematcher", () => ({
  match: (requested: string[], locales: string[], defaultLocale: string) =>
    requested.find((l) => locales.includes(l.split("-")[0])) ?? defaultLocale,
}));

const ORIGIN = "https://ciaranmccullough.co.uk";

function request(path: string, acceptLanguage = "en"): NextRequest {
  return new NextRequest(`${ORIGIN}${path}`, {
    headers: { "accept-language": acceptLanguage },
  });
}

describe("proxy — default-locale prefix is stripped to the canonical URL", () => {
  it("redirects /en to / with a permanent 308", () => {
    const res = proxy(request("/en"));
    expect(res.status).toBe(308);
    const location = res.headers.get("location");
    expect(location).not.toBeNull();
    expect(new URL(location as string).pathname).toBe("/");
  });

  it("redirects /en/<path> to /<path> (308)", () => {
    const res = proxy(request("/en/about"));
    expect(res.status).toBe(308);
    expect(new URL(res.headers.get("location") as string).pathname).toBe(
      "/about",
    );
  });
});

describe("proxy — unprefixed paths render the default locale in place", () => {
  it("rewrites / to /en without changing the visible URL", () => {
    const res = proxy(request("/"));
    // A rewrite is a 200 that carries the internal target header.
    const rewrite = res.headers.get("x-middleware-rewrite");
    expect(rewrite).not.toBeNull();
    expect(new URL(rewrite as string).pathname).toBe("/en");
  });

  it("rewrites /about to /en/about", () => {
    const res = proxy(request("/about"));
    const rewrite = res.headers.get("x-middleware-rewrite");
    expect(new URL(rewrite as string).pathname).toBe("/en/about");
  });

  it("routes an unknown Accept-Language to the default locale (en)", () => {
    const res = proxy(request("/", "fr-FR,fr;q=0.9"));
    const rewrite = res.headers.get("x-middleware-rewrite");
    expect(new URL(rewrite as string).pathname).toBe("/en");
  });
});
