#!/usr/bin/env bun
/**
 * Deterministic review-tier computation.
 *
 * Reads .github/risk-rules.yml, gets changed files from git diff,
 * and outputs the impact floor tier as structured JSON.
 *
 * Usage:
 *   bun run scripts/compute-tier.ts --base main
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

const DEFAULT_BASE_REF = "main";
const GIT_CAPTURE_STDIO: ["pipe", "pipe", "pipe"] = ["pipe", "pipe", "pipe"];

// --- Types ---

export type Tier = "T1" | "T2" | "T3";

export interface Rule {
  goal: string;
  description?: string;
  paths: string[];
  min_tier: Tier;
  review_focus?: string;
  requires_rollback_plan?: boolean;
}

export interface RiskRules {
  rules: Rule[];
  defaults?: { unmatched_tier?: Tier };
}

export interface FiredRule {
  goal: string;
  min_tier: Tier;
  matched_file: string;
}

export interface TierResult {
  floor: Tier;
  fired_rules: FiredRule[];
  changed_files: string[];
}

// --- Tier ordering ---

export const TIER_ORDER: Record<Tier, number> = { T1: 1, T2: 2, T3: 3 };

export function tierRank(tier: Tier): number {
  return TIER_ORDER[tier];
}

export const VALID_TIERS = new Set<Tier>(["T1", "T2", "T3"]);

export function isValidTier(value: string): value is Tier {
  return VALID_TIERS.has(value as Tier);
}

export function maxTier(...tiers: Tier[]): Tier {
  return tiers.reduce((max, next) =>
    tierRank(next) > tierRank(max) ? next : max
  );
}

function gitCapture(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf-8",
    stdio: GIT_CAPTURE_STDIO,
  }).trim();
}

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
  if (defaults?.unmatched_tier && !VALID_TIERS.has(defaults.unmatched_tier as Tier)) {
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
  const defaultTier: Tier = rules.defaults?.unmatched_tier ?? "T1";
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

  const floor = firedRules.reduce(
    (highest, rule) => maxTier(highest, rule.min_tier),
    defaultTier
  );

  return { floor, fired_rules: firedRules, changed_files: changedFiles };
}

// --- CLI helpers ---

export function findRepoRoot(): string {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf-8",
  }).trim();
}

function validateBaseRef(base: string): void {
  if (base.startsWith("-")) {
    throw new Error(`Invalid base ref: '${base}'`);
  }
  if (/[~^:@\\\s]/.test(base) || base.includes("..")) {
    throw new Error(
      `Invalid base ref: '${base}' contains rev-spec operators or whitespace`
    );
  }
  if (base.toUpperCase() === "HEAD") {
    throw new Error("Invalid base ref: 'HEAD' is not allowed");
  }
  if (/^[0-9a-f]{7,40}$/i.test(base)) {
    throw new Error("Invalid base ref: commit SHAs are not allowed");
  }
}

function refExists(ref: string): boolean {
  try {
    gitCapture(["rev-parse", "--verify", ref]);
    return true;
  } catch {
    return false;
  }
}

export function resolveBase(base: string): string {
  validateBaseRef(base);

  const currentBranch = gitCapture(["branch", "--show-current"]);
  const currentRemoteBranch = currentBranch ? `origin/${currentBranch}` : "";
  const rejectIfCurrentBranch = (resolvedRef: string) => {
    if (
      resolvedRef === currentBranch ||
      (currentRemoteBranch && resolvedRef === currentRemoteBranch)
    ) {
      throw new Error(
        `Invalid base ref: '${resolvedRef}' points to the current branch`
      );
    }
  };

  const candidates = [base, `origin/${base}`];
  for (const candidate of candidates) {
    if (refExists(candidate)) {
      rejectIfCurrentBranch(candidate);
      return candidate;
    }
  }

  throw new Error(
    `Cannot resolve base ref '${base}' or 'origin/${base}'. Is it fetched locally?`
  );
}

export function getChangedFilesFromResolvedBase(resolvedBase: string): string[] {
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

export function getChangedFiles(base: string): string[] {
  return getChangedFilesFromResolvedBase(resolveBase(base));
}

export function assertNonEmptyDiff(changedFiles: string[], label: string): void {
  if (changedFiles.length === 0) {
    throw new Error(
      `No changed files found between base and HEAD. Refusing to compute ${label}.`
    );
  }
}

export function loadRiskRulesFromGitRef(ref: string): RiskRules {
  const candidates = [".github/risk-rules.yml", "risk-rules.yml"];
  for (const path of candidates) {
    let content: string;
    try {
      content = gitCapture(["show", `${ref}:${path}`]);
    } catch {
      continue;
    }

    return validateRules(parseYaml(content));
  }

  throw new Error(
    `risk-rules.yml not found at ref '${ref}' in .github/ or repo root.`
  );
}

export function loadRiskRules(repoRoot: string, baseRef?: string): RiskRules {
  if (baseRef) {
    return loadRiskRulesFromGitRef(resolveBase(baseRef));
  }

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
        continue;
      }
      throw err;
    }

    return validateRules(parseYaml(content));
  }

  throw new Error(
    "risk-rules.yml not found in .github/ or repo root. Cannot compute tier."
  );
}

export function parseBaseArg(args: string[], defaultBase = DEFAULT_BASE_REF): string {
  let base = defaultBase;

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--base=")) {
      const value = args[i].slice("--base=".length);
      if (!value) {
        throw new Error("--base requires a non-empty value");
      }
      base = value;
      continue;
    }

    if (args[i] === "--base" && args[i + 1] && !args[i + 1].startsWith("--")) {
      base = args[i + 1];
      i++;
      continue;
    }

    if (args[i] === "--base") {
      throw new Error("--base requires a value");
    }
  }

  return base;
}

export function isMainEntry(expectedFileName?: string): boolean {
  const argvEntry = process.argv[1];
  if (!argvEntry) {
    return false;
  }

  const normalizePath = (value: string): string =>
    value.replace(/^file:\/\//, "").replace(/\\/g, "/");

  const argvNormalized = normalizePath(argvEntry);
  if (expectedFileName) {
    return (
      argvNormalized === expectedFileName ||
      argvNormalized.endsWith(`/${expectedFileName}`)
    );
  }

  const candidates = [
    (import.meta as { path?: string }).path,
    (import.meta as { filename?: string }).filename,
    (import.meta as { file?: string }).file,
    (import.meta as { url?: string }).url,
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map(normalizePath);

  return candidates.some((candidate) => {
    if (argvNormalized === candidate) {
      return true;
    }
    const fileName = candidate.split("/").pop();
    return Boolean(fileName) && argvNormalized.endsWith(`/${fileName}`);
  });
}

function main() {
  const base = parseBaseArg(process.argv.slice(2));
  const resolvedBase = resolveBase(base);
  const rules = loadRiskRulesFromGitRef(resolvedBase);
  const changedFiles = getChangedFilesFromResolvedBase(resolvedBase);
  assertNonEmptyDiff(changedFiles, "tier");

  const result = computeTier(rules, changedFiles);
  console.log(JSON.stringify(result, null, 2));
}

if (isMainEntry("compute-tier.ts")) {
  main();
}
