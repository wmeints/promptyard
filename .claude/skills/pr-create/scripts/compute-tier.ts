#!/usr/bin/env bun
/**
 * Deterministic review-tier computation.
 *
 * Reads .github/risk-rules.yml, gets changed files from git diff,
 * and outputs the impact floor tier as structured JSON.
 *
 * Usage:
 *   bun run .claude/skills/pr-create/scripts/compute-tier.ts --base main
 *
 * Output (JSON):
 *   {
 *     "floor": "T2",
 *     "fired_rules": [{ "goal": "auth", "min_tier": "T2", "matched_file": "src/auth/login.ts" }],
 *     "changed_files": ["src/auth/login.ts", "README.md"]
 *   }
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { minimatch } from "minimatch";

// --- Types ---

export interface Rule {
  goal: string;
  description?: string;
  paths: string[];
  min_tier: string;
  review_focus?: string;
  requires_rollback_plan?: boolean;
}

export interface RiskRules {
  rules: Rule[];
  defaults?: { unmatched_tier?: string };
}

export interface FiredRule {
  goal: string;
  min_tier: string;
  matched_file: string;
}

export interface TierResult {
  floor: string;
  fired_rules: FiredRule[];
  changed_files: string[];
}

// --- Tier ordering ---

const TIER_ORDER: Record<string, number> = { T1: 1, T2: 2, T3: 3 };

function tierRank(tier: string): number {
  return TIER_ORDER[tier] ?? 0;
}

const VALID_TIERS = new Set(["T1", "T2", "T3"]);

function validateRules(data: unknown): RiskRules {
  if (!data || typeof data !== "object") {
    throw new Error("risk-rules.yml is empty or not an object");
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.rules)) {
    throw new Error("risk-rules.yml must have a 'rules' array");
  }

  for (const rule of obj.rules) {
    if (!rule.goal || typeof rule.goal !== "string") {
      throw new Error(`Rule missing 'goal': ${JSON.stringify(rule)}`);
    }
    if (!Array.isArray(rule.paths) || rule.paths.length === 0) {
      throw new Error(`Rule '${rule.goal}' must have a non-empty 'paths' array`);
    }
    if (!VALID_TIERS.has(rule.min_tier)) {
      throw new Error(
        `Rule '${rule.goal}' has invalid min_tier '${rule.min_tier}'. Must be T1, T2, or T3.`
      );
    }
  }

  const defaults = obj.defaults as { unmatched_tier?: string } | undefined;
  if (defaults?.unmatched_tier && !VALID_TIERS.has(defaults.unmatched_tier)) {
    throw new Error(
      `defaults.unmatched_tier '${defaults.unmatched_tier}' is invalid. Must be T1, T2, or T3.`
    );
  }

  return data as RiskRules;
}

// --- Core logic (exported for testing) ---

export function computeTier(
  rules: RiskRules,
  changedFiles: string[]
): TierResult {
  const defaultTier = rules.defaults?.unmatched_tier ?? "T1";
  const firedRules: FiredRule[] = [];

  for (const rule of rules.rules) {
    for (const file of changedFiles) {
      const matched = rule.paths.some((pattern) =>
        minimatch(file, pattern, { dot: true })
      );
      if (matched) {
        firedRules.push({
          goal: rule.goal,
          min_tier: rule.min_tier,
          matched_file: file,
        });
        break; // one match per rule is enough to fire it
      }
    }
  }

  const floor =
    firedRules.length > 0
      ? firedRules.reduce((max, r) =>
          tierRank(r.min_tier) > tierRank(max.min_tier) ? r : max
        ).min_tier
      : defaultTier;

  return { floor, fired_rules: firedRules, changed_files: changedFiles };
}

// --- CLI entry point ---

function findRepoRoot(): string {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf-8",
  }).trim();
}

function resolveBase(base: string): string {
  // Reject refs starting with '-' to prevent argument injection
  if (base.startsWith("-")) {
    throw new Error(`Invalid base ref: '${base}'`);
  }

  // Try the ref directly first, then origin/<ref>
  try {
    execFileSync("git", ["rev-parse", "--verify", base], {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return base;
  } catch {
    // Try origin/<base>
    const originRef = `origin/${base}`;
    try {
      execFileSync("git", ["rev-parse", "--verify", originRef], {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return originRef;
    } catch {
      throw new Error(
        `Cannot resolve base ref '${base}' or '${originRef}'. Is it fetched locally?`
      );
    }
  }
}

function getChangedFiles(base: string): string[] {
  const resolvedBase = resolveBase(base);
  const output = execFileSync(
    "git",
    ["diff", "--name-only", `${resolvedBase}...HEAD`],
    { encoding: "utf-8" }
  );
  return output
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
}

function loadRiskRules(repoRoot: string): RiskRules {
  const candidates = [
    resolve(repoRoot, ".github", "risk-rules.yml"),
    resolve(repoRoot, "risk-rules.yml"),
  ];

  for (const candidatePath of candidates) {
    let content: string;
    try {
      content = readFileSync(candidatePath, "utf-8");
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        continue; // file doesn't exist, try next
      }
      throw err; // permission error or similar — surface it
    }

    // Parse errors should always surface, not silently fall through
    const parsed = parseYaml(content);
    return validateRules(parsed);
  }

  throw new Error(
    "risk-rules.yml not found in .github/ or repo root. Cannot compute tier."
  );
}

function main() {
  const args = process.argv.slice(2);
  let base = "main";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base" && args[i + 1]) {
      base = args[i + 1];
      i++;
    }
  }

  const repoRoot = findRepoRoot();
  const rules = loadRiskRules(repoRoot);
  const changedFiles = getChangedFiles(base);
  const result = computeTier(rules, changedFiles);

  console.log(JSON.stringify(result, null, 2));
}

// Only run main when executed directly (not imported for testing)
const isMainModule =
  typeof Bun !== "undefined"
    ? Bun.main === import.meta.path
    : process.argv[1] === import.meta.filename;

if (isMainModule) {
  main();
}
