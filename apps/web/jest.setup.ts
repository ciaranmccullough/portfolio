// Extends Jest's `expect` with the DOM matchers (`toBeInTheDocument`, …) for the
// jsdom-based component suites. Included by the app tsconfig so `tsc` sees the
// matcher types too.
import "@testing-library/jest-dom";

// jsdom doesn't implement `window.matchMedia` at all. Without it,
// `motion/react`'s `useReducedMotion()` still works (motion-dom falls back to
// `false` when `matchMedia` is missing — see `initPrefersReducedMotion`), but
// there'd be no way for an individual test to simulate
// `prefers-reduced-motion: reduce`. Guarded on `typeof window` since suites
// that opt into `@jest-environment node` (e.g. pure `lib/` tests) have no
// `window` at all. Defaults to "no match"; override per-test by reassigning
// `window.matchMedia` before rendering.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(() => false),
    }) as MediaQueryList;
}
