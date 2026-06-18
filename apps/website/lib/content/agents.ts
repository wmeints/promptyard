import { slugify } from "@/lib/slug";

import { UploadRejectedError } from "./errors";
import { nonEmpty, parseFrontmatter } from "./frontmatter";

// An agent is a single markdown file at `agents/<name>.md`; there are no
// sub-files, so anything nested deeper is not an agent.
const AGENT_FILE = /^agents\/([^/]+)\.md$/;

export type ParsedAgent = {
  type: "agent";
  /** Slugified frontmatter name — the agent's identity, slug, and canonical name. */
  slug: string;
  description: string;
  /** The full markdown file, stored inline on the version (no blobs for agents). */
  body: string;
};

/**
 * List the agent files in an unzipped archive — every `agents/<name>.md`, sorted
 * for deterministic processing. Returns an empty list when there are none.
 */
export function findAgentFiles(files: Map<string, Uint8Array>): string[] {
  const paths: string[] = [];
  for (const path of files.keys()) {
    if (AGENT_FILE.test(path)) {
      paths.push(path);
    }
  }

  paths.sort();
  return paths;
}

/** The filename stem, used to name an agent that fails before it gets a slug. */
export function agentLabel(path: string): string {
  return AGENT_FILE.exec(path)?.[1] ?? path;
}

/**
 * Parse and validate a single agent markdown file into a {@link ParsedAgent}.
 * Throws {@link UploadRejectedError} when its frontmatter is missing the required
 * non-empty fields so the caller can record it as a failed item.
 */
export function parseAgent(path: string, files: Map<string, Uint8Array>): ParsedAgent {
  const file = files.get(path);
  // Guarded by the caller, which only invokes us for discovered agent files.
  const body = new TextDecoder().decode(file);
  const { name, description } = parseFrontmatter(body);

  const cleanName = nonEmpty(name);
  const cleanDescription = nonEmpty(description);
  if (!cleanName || !cleanDescription) {
    throw new UploadRejectedError(
      "invalid-frontmatter",
      `${path} must define a non-empty name and description.`,
    );
  }

  // The slug is the stable identity; the raw frontmatter name is discarded.
  const slug = slugify(cleanName);
  if (!slug) {
    throw new UploadRejectedError(
      "invalid-frontmatter",
      `The name in ${path} does not produce a valid slug.`,
    );
  }

  return { type: "agent", slug, description: cleanDescription, body };
}
