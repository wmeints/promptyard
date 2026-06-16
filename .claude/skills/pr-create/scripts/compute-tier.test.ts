import { describe, expect, test } from "bun:test";
import { computeTier } from "./compute-tier";

import type { RiskRules } from "./compute-tier";

const RULES: RiskRules = {
  rules: [
    {
      goal: "authorization",
      paths: ["**/authz/**"],
      min_tier: "T2",
    },
    {
      goal: "authentication",
      paths: ["**/auth/**", "**/middleware/auth*", "**/*session*", "**/*token*"],
      min_tier: "T2",
    },
    {
      goal: "performance",
      paths: ["**/repositories/**", "**/queries/**", "**/cache/**"],
      min_tier: "T2",
    },
    {
      goal: "data_integrity",
      paths: ["**/migrations/**", "**/*.sql", "**/schema/**"],
      min_tier: "T3",
    },
  ],
  defaults: { unmatched_tier: "T1" },
};

describe("computeTier", () => {
  test("no matching files returns T1 (default)", () => {
    const result = computeTier(RULES, ["src/utils/format.ts", "README.md"]);
    expect(result.floor).toBe("T1");
    expect(result.fired_rules).toHaveLength(0);
  });

  test("auth file triggers T2", () => {
    const result = computeTier(RULES, [
      "src/auth/login.ts",
      "src/utils/format.ts",
    ]);
    expect(result.floor).toBe("T2");
    expect(result.fired_rules).toHaveLength(1);
    expect(result.fired_rules[0].goal).toBe("authentication");
    expect(result.fired_rules[0].matched_file).toBe("src/auth/login.ts");
  });

  test("migration file triggers T3", () => {
    const result = computeTier(RULES, [
      "db/migrations/001_add_users.sql",
      "src/index.ts",
    ]);
    expect(result.floor).toBe("T3");
    expect(result.fired_rules.length).toBeGreaterThanOrEqual(1);
    expect(result.fired_rules.some((r) => r.goal === "data_integrity")).toBe(
      true
    );
  });

  test("multiple rules fire, highest tier wins", () => {
    const result = computeTier(RULES, [
      "src/auth/middleware.ts",
      "db/migrations/002_add_posts.sql",
    ]);
    expect(result.floor).toBe("T3");
    expect(result.fired_rules.length).toBeGreaterThanOrEqual(2);
  });

  test("authz path triggers authorization rule", () => {
    const result = computeTier(RULES, ["packages/api/src/authz/policies.ts"]);
    expect(result.floor).toBe("T2");
    expect(result.fired_rules[0].goal).toBe("authorization");
  });

  test("session file triggers authentication rule", () => {
    const result = computeTier(RULES, ["src/lib/session-store.ts"]);
    expect(result.floor).toBe("T2");
    expect(result.fired_rules[0].goal).toBe("authentication");
  });

  test("cache file triggers performance rule", () => {
    const result = computeTier(RULES, ["packages/api/src/cache/redis.ts"]);
    expect(result.floor).toBe("T2");
    expect(result.fired_rules[0].goal).toBe("performance");
  });

  test(".sql file triggers data_integrity even outside migrations", () => {
    const result = computeTier(RULES, ["scripts/seed.sql"]);
    expect(result.floor).toBe("T3");
    expect(result.fired_rules[0].goal).toBe("data_integrity");
  });

  test("changed_files are passed through in output", () => {
    const files = ["a.ts", "b.ts"];
    const result = computeTier(RULES, files);
    expect(result.changed_files).toEqual(files);
  });

  test("respects custom defaults.unmatched_tier", () => {
    const rulesWithT2Default: RiskRules = {
      rules: [],
      defaults: { unmatched_tier: "T2" },
    };
    const result = computeTier(rulesWithT2Default, ["src/index.ts"]);
    expect(result.floor).toBe("T2");
    expect(result.fired_rules).toHaveLength(0);
  });

  test("empty changed files returns default tier", () => {
    const result = computeTier(RULES, []);
    expect(result.floor).toBe("T1");
    expect(result.fired_rules).toHaveLength(0);
    expect(result.changed_files).toEqual([]);
  });
});
