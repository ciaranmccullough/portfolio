/**
 * Jest config for the @portfolio/ui design system.
 *
 * jsdom environment + @swc/jest for fast TS/JSX/ESM transforms, and React
 * Testing Library for component assertions. Tests are co-located next to each
 * component as `<Component>.test.tsx` (plus `cn.test.ts` for the class helper).
 *
 * CJS config (`.cjs`) because this package is `"type": "module"`; the config
 * loader would otherwise treat a bare `.js` file as ESM.
 */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
        },
      },
    ],
  },
  // The design system uses Tailwind utility classes, never CSS-module imports —
  // but stub any `*.css` import defensively so a stray one can't break a test.
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "<rootDir>/test/styleMock.cjs",
  },
  clearMocks: true,
};
