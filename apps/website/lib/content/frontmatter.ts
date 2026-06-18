import { slugify } from "@/lib/slug";
import { parse } from "yaml";

import { UploadRejectedError } from "./errors";

// A leading `---` fence, the YAML block, then a closing `---` on its own line.
// Tolerates a UTF-8 BOM and CRLF line endings.
const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;

export type Frontmatter = { name?: string; description?: string };

// Trim a frontmatter value, collapsing blank or absent ones to `undefined`.
function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

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

/** A skill or agent's identity, distilled from its frontmatter. */
export type RequiredFrontmatter = { slug: string; description: string };

/**
 * Validate the shared frontmatter contract for a skill or agent: a non-empty
 * `name` (slugified into the stable identity) and `description`. Throws
 * {@link UploadRejectedError} naming `label` (the markdown file's path) when
 * either field is missing or the name does not produce a slug.
 */
export function parseRequiredFrontmatter(markdown: string, label: string): RequiredFrontmatter {
  const { name, description } = parseFrontmatter(markdown);

  const cleanName = nonEmpty(name);
  const cleanDescription = nonEmpty(description);
  if (!cleanName || !cleanDescription) {
    throw new UploadRejectedError(
      "invalid-frontmatter",
      `${label} must define a non-empty name and description.`,
    );
  }

  // The slug is the stable identity; the raw frontmatter name is discarded.
  const slug = slugify(cleanName);
  if (!slug) {
    throw new UploadRejectedError(
      "invalid-frontmatter",
      `The name in ${label} does not produce a valid slug.`,
    );
  }

  return { slug, description: cleanDescription };
}
