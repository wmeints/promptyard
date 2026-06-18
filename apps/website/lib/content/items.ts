import type { UploadResult } from "@/db/schema";

import { agentLabel, findAgentFiles, parseAgent, type ParsedAgent } from "./agents";
import { failureMessage } from "./errors";
import { isJunk } from "./junk";
import { findSkillFolders, parseSkill, type ParsedSkill } from "./skills";

/** A skill or agent that parsed cleanly and is ready to import. */
export type ParsedItem = ParsedSkill | ParsedAgent;

export type Discovery = {
  /** Items that parsed successfully, skills before agents, each sorted. */
  items: ParsedItem[];
  /** Per-item parse failures (missing field, bad name), ready to report. */
  failures: UploadResult[];
  /** Paths dropped as junk or as content outside skills/ and agents/, sorted. */
  ignored: string[];
};

// The folder a path belongs to, when it sits under `skills/<folder>/`.
const SKILL_PREFIX = /^skills\/([^/]+)\//;

/**
 * Walk an unzipped archive once and bucket every entry: parse each skill folder
 * and agent file, collecting failures per item, and count everything else —
 * OS/VCS junk and anything outside a recognised skill or agent — as ignored.
 */
export function discoverItems(files: Map<string, Uint8Array>): Discovery {
  const skillFolders = findSkillFolders(files);
  const agentPaths = findAgentFiles(files);
  const folderSet = new Set(skillFolders);
  const agentSet = new Set(agentPaths);

  const ignored: string[] = [];
  for (const path of files.keys()) {
    if (isJunk(path)) {
      ignored.push(path);
      continue;
    }
    const skillFolder = SKILL_PREFIX.exec(path)?.[1];
    const claimed = (skillFolder !== undefined && folderSet.has(skillFolder)) || agentSet.has(path);
    if (!claimed) {
      ignored.push(path);
    }
  }
  ignored.sort();

  const items: ParsedItem[] = [];
  const failures: UploadResult[] = [];

  for (const folder of skillFolders) {
    try {
      items.push(parseSkill(folder, files));
    } catch (error) {
      failures.push({
        type: "skill",
        name: folder,
        status: "failed",
        message: failureMessage(error),
      });
    }
  }
  for (const path of agentPaths) {
    try {
      items.push(parseAgent(path, files));
    } catch (error) {
      failures.push({
        type: "agent",
        name: agentLabel(path),
        status: "failed",
        message: failureMessage(error),
      });
    }
  }

  return { items, failures, ignored };
}

/**
 * Split parsed items into those safe to import and the in-zip duplicates: two or
 * more items that resolve (post-slugify) to the same `(type, slug)` are rejected
 * as a group, since the slug is the identity. Other items are unaffected.
 */
export function dedupeItems(items: ParsedItem[]): {
  unique: ParsedItem[];
  duplicates: UploadResult[];
} {
  const groups = new Map<string, ParsedItem[]>();
  for (const item of items) {
    const key = `${item.type}:${item.slug}`;
    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  const unique: ParsedItem[] = [];
  const duplicates: UploadResult[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      unique.push(group[0]);
      continue;
    }
    for (const item of group) {
      duplicates.push({
        type: item.type,
        name: item.slug,
        status: "failed",
        message: `Another ${item.type} in this upload also resolves to "${item.slug}".`,
      });
    }
  }

  return { unique, duplicates };
}
