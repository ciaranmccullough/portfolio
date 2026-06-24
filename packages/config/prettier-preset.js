/**
 * Shared Prettier configuration for the monorepo.
 *
 * Consume from a package's prettier.config.js:
 *   module.exports = require("@portfolio/config/prettier-preset");
 */
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
};
