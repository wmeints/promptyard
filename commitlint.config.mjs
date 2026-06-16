export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // See docs/engineering/commit-guidelines.md
    "type-enum": [2, "always", ["feat", "fix", "docs", "chore"]],
    "scope-enum": [2, "always", ["authn", "authz", "content", "search"]],
  },
};
