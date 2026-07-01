/**
 * Jest config for the Next.js web app.
 *
 * `next/jest` wires up the Next SWC transform (TS/JSX), CSS/asset mocks, and
 * `.env` loading so tests run the same way the app compiles. Tests live under
 * `__tests__/` (kept out of `app/` so Next never mistakes one for a route).
 *
 * Most suites run in jsdom; pure Node suites (e.g. the proxy, which uses
 * `next/server`) opt in per-file with `@jest-environment node`.
 */
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/__tests__/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  clearMocks: true,
};

module.exports = createJestConfig(config);
