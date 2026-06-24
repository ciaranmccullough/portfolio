/** Root ESLint config — applies the shared preset across the workspace libraries. */
module.exports = {
  root: true,
  extends: [require.resolve("@portfolio/config/eslint-preset")],
};
