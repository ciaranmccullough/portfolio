// Extends Jest's `expect` with the DOM matchers (`toBeInTheDocument`, …) for the
// jsdom-based component suites. Included by the app tsconfig so `tsc` sees the
// matcher types too.
import "@testing-library/jest-dom";
