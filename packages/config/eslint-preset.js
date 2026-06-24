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
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "storybook-static/",
  ],
};
