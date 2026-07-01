/**
 * Shared ESLint preset for the monorepo (ESLint 8 / legacy "eslintrc" format).
 *
 * Consume from a package's .eslintrc.js:
 *   module.exports = {
 *     root: true,
 *     extends: ["@portfolio/config/eslint-preset"],
 *   };
 */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  plugins: ["@typescript-eslint", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
  overrides: [
    {
      // Jest test files: declare the test-runner globals (so `no-undef` is happy
      // without eslint-plugin-jest) and relax the a11y rules that bare test
      // markup / lightweight mock stubs can trip.
      files: ["**/*.test.ts", "**/*.test.tsx", "**/jest.setup.ts"],
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
      rules: {
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/no-autofocus": "off",
        // require() is idiomatic inside jest.mock factories (which are hoisted
        // above imports and cannot reference module-scope import bindings).
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "storybook-static/",
    "next-env.d.ts",
  ],
};
