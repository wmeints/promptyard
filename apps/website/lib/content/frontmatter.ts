import { parse } from "yaml";

// A leading `---` fence, the YAML block, then a closing `---` on its own line.
// Tolerates a UTF-8 BOM and CRLF line endings.
const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;

export type Frontmatter = { name?: string; description?: string };

/**
 * Pull the `name` and `description` out of a SKILL.md YAML frontmatter block.
 * Returns an empty object when the fence is missing or the YAML is malformed;
 * the caller decides whether the absent fields are fatal.
 */
export function parseFrontmatter(markdown: string): Frontmatter {
  const match = FRONTMATTER.exec(markdown);
  if (!match) {
    return {};
  }

  let data: unknown;
  try {
    data = parse(match[1]);
  } catch {
    return {};
  }

  if (!data || typeof data !== "object") {
    return {};
  }

  const record = data as Record<string, unknown>;
  return {
    name: typeof record.name === "string" ? record.name : undefined,
    description: typeof record.description === "string" ? record.description : undefined,
  };
}
