import { slugify } from "@/lib/slug";

import { UploadRejectedError } from "./errors";
import { parseFrontmatter } from "./frontmatter";

// A skill is a `skills/<folder>/` directory whose root holds a SKILL.md.
const SKILL_MANIFEST = /^skills\/([^/]+)\/SKILL\.md$/;

export type SkillFile = { relpath: string; data: Uint8Array };

export type ParsedSkill = {
  /** Slugified frontmatter name — the skill's identity, slug, and canonical name. */
  slug: string;
  description: string;
  /** Every file under the skill folder, path relative to that folder. */
  files: SkillFile[];
};

function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * List the skill folders in an unzipped archive — every `skills/<folder>/`
 * holding a SKILL.md, sorted for deterministic processing. Throws
 * {@link UploadRejectedError} only when the archive has no skill at all; a single
 * malformed skill is left for {@link parseSkill} to reject per-item.
 */
export function findSkillFolders(files: Map<string, Uint8Array>): string[] {
  const folders: string[] = [];
  for (const path of files.keys()) {
    const match = SKILL_MANIFEST.exec(path);
    if (match) {
      folders.push(match[1]);
    }
  }

  if (folders.length === 0) {
    throw new UploadRejectedError(
      "no-skill",
      "The archive does not contain a skills/<name>/SKILL.md file.",
    );
  }

  folders.sort();
  return folders;
}

/**
 * Parse and validate a single skill folder into a {@link ParsedSkill}. Throws
 * {@link UploadRejectedError} when its SKILL.md is missing the required
 * non-empty frontmatter so the caller can record it as a failed item.
 */
export function parseSkill(folder: string, files: Map<string, Uint8Array>): ParsedSkill {
  const prefix = `skills/${folder}/`;
  const manifest = files.get(`${prefix}SKILL.md`);
  // Guarded by the caller, which only invokes us for folders with a SKILL.md.
  const { name, description } = parseFrontmatter(new TextDecoder().decode(manifest));

  const cleanName = nonEmpty(name);
  const cleanDescription = nonEmpty(description);
  if (!cleanName || !cleanDescription) {
    throw new UploadRejectedError(
      "invalid-frontmatter",
      `skills/${folder}/SKILL.md must define a non-empty name and description.`,
    );
  }

  // The slug is the stable identity; the raw frontmatter name is discarded.
  const slug = slugify(cleanName);
  if (!slug) {
    throw new UploadRejectedError(
      "invalid-frontmatter",
      `The name in skills/${folder}/SKILL.md does not produce a valid slug.`,
    );
  }

  const skillFiles: SkillFile[] = [];
  for (const [path, data] of files) {
    if (path.startsWith(prefix) && path.length > prefix.length) {
      skillFiles.push({ relpath: path.slice(prefix.length), data });
    }
  }
  skillFiles.sort((a, b) => (a.relpath < b.relpath ? -1 : a.relpath > b.relpath ? 1 : 0));

  return { slug, description: cleanDescription, files: skillFiles };
}
