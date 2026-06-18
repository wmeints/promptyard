#!/usr/bin/env bun
/**
 * Deterministic final-tier computation.
 *
 * Uses compute-tier.ts as the authoritative impact floor and requires
 * LLM escalation input that can only move tier up.
 *
 * Usage:
 *   bun run scripts/compute-final-tier.ts --base main T3
 *   bun run scripts/compute-final-tier.ts --base main NONE
 */

import {
  assertNonEmptyDiff,
  computeTier,
  getChangedFilesFromResolvedBase,
  isValidTier,
  isMainEntry,
  loadRiskRulesFromGitRef,
  maxTier,
  parseBaseArg,
  resolveBase,
  tierRank,
  type FiredRule,
  type Tier,
} from "./compute-tier";

type LlmSignal = "none" | "valid" | "invalid";

export interface FinalTierResult {
  floor: Tier;
  deterministic_base: Tier;
  llm_escalation_tier: Tier;
  final_tier: Tier;
  review_label: `review:${Tier}`;
  human_review_required: boolean;
  llm_signal: LlmSignal;
  llm_raw_input?: string;
  clamped: boolean;
  fired_rules: FiredRule[];
  changed_files: string[];
}

export interface ComputeFinalTierInput {
  floor: Tier;
  firedRules: FiredRule[];
  changedFiles: string[];
  llmEscalationTierRaw: string;
}

export function parseLlmEscalationTier(rawInput: string): {
  llmEscalationTier: Tier;
  signal: LlmSignal;
} {
  const normalized = rawInput.trim().toUpperCase();
  if (!normalized) {
    return { llmEscalationTier: "T2", signal: "invalid" };
  }

  if (normalized === "NONE" || normalized === "T1") {
    return { llmEscalationTier: "T1", signal: "none" };
  }

  if (isValidTier(normalized)) {
    return { llmEscalationTier: normalized, signal: "valid" };
  }

  // Fail-safe: unparseable / injected value means "uncertain", require human review.
  return { llmEscalationTier: "T2", signal: "invalid" };
}

export function computeFinalTier(input: ComputeFinalTierInput): FinalTierResult {
  const deterministicBase = input.floor;
  const { llmEscalationTier, signal } = parseLlmEscalationTier(input.llmEscalationTierRaw);
  const finalTier = maxTier(deterministicBase, llmEscalationTier);
  const clamped =
    signal === "invalid" ||
    (signal === "valid" && tierRank(finalTier) > tierRank(llmEscalationTier));

  return {
    floor: input.floor,
    deterministic_base: deterministicBase,
    llm_escalation_tier: llmEscalationTier,
    final_tier: finalTier,
    review_label: `review:${finalTier}`,
    human_review_required: finalTier !== "T1",
    llm_signal: signal,
    llm_raw_input: input.llmEscalationTierRaw,
    clamped,
    fired_rules: input.firedRules,
    changed_files: input.changedFiles,
  };
}

function main() {
  const args = process.argv.slice(2);
  const base = parseBaseArg(args);
  const positionalArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--base=") || args[i] === "--base") {
      if (args[i] === "--base" && args[i + 1] && !args[i + 1].startsWith("--")) {
        i++;
      }
      continue;
    }

    if (args[i].startsWith("--")) {
      throw new Error(`Unknown option: ${args[i]}`);
    }

    positionalArgs.push(args[i]);
  }

  if (positionalArgs.length !== 1) {
    throw new Error(
      "Exactly one LLM escalation value is required: NONE, T1, T2, or T3"
    );
  }
  const llmEscalationTierRaw = positionalArgs[0];

  const resolvedBase = resolveBase(base);
  const rules = loadRiskRulesFromGitRef(resolvedBase);
  const changedFiles = getChangedFilesFromResolvedBase(resolvedBase);
  assertNonEmptyDiff(changedFiles, "final tier");
  const tierResult = computeTier(rules, changedFiles);
  const finalResult = computeFinalTier({
    floor: tierResult.floor,
    firedRules: tierResult.fired_rules,
    changedFiles: tierResult.changed_files,
    llmEscalationTierRaw,
  });

  console.log(JSON.stringify(finalResult, null, 2));
}

if (isMainEntry("compute-final-tier.ts")) {
  main();
}
