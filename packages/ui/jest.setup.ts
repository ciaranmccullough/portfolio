// Extends Jest's `expect` with the DOM matchers (`toBeInTheDocument`,
// `toHaveAttribute`, `toBeDisabled`, …). Imported here for the test runtime and
// included in tsconfig.json so the matcher types are visible to `tsc`.
import "@testing-library/jest-dom";
