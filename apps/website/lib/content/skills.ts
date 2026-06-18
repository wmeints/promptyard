import { parseRequiredFrontmatter } from "./frontmatter";
import { isJunk } from "./junk";

// A skill is a `skills/<folder>/` directory whose root holds a SKILL.md.
const SKILL_MANIFEST = /^skills\/([^/]+)\/SKILL\.md$/;

export type SkillFile = { relpath: string; data: Uint8Array };

export type ParsedSkill = {
  type: "skill";
  /** Slugified frontmatter name — the skill's identity, slug, and canonical name. */
  slug: string;
  description: string;
  /** Every non-junk file under the skill folder, path relative to that folder. */
  files: SkillFile[];
};

/**
 * List the skill folders in an unzipped archive — every `skills/<folder>/`
 * holding a SKILL.md, sorted for deterministic processing. Returns an empty list
 * when the archive has no skills; the caller decides whether that (combined with
 * any agents) is fatal.
 */
export function findSkillFolders(files: Map<string, Uint8Array>): string[] {
  const folders: string[] = [];
  for (const path of files.keys()) {
    const match = SKILL_MANIFEST.exec(path);
    if (match) {
      folders.push(match[1]);
    }
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
  const { slug, description } = parseRequiredFrontmatter(
    new TextDecoder().decode(manifest),
    `${prefix}SKILL.md`,
  );

  const skillFiles: SkillFile[] = [];
  for (const [path, data] of files) {
    // Junk that rode along inside the folder is dropped here and counted as
    // ignored by the discovery pass, never stored as a blob.
    if (path.startsWith(prefix) && path.length > prefix.length && !isJunk(path)) {
      skillFiles.push({ relpath: path.slice(prefix.length), data });
    }
  }
  skillFiles.sort((a, b) => (a.relpath < b.relpath ? -1 : a.relpath > b.relpath ? 1 : 0));

  return { type: "skill", slug, description, files: skillFiles };
}
