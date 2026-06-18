// OS- and VCS-generated cruft that routinely rides along inside an upload zip.
// Such paths are dropped (and counted as ignored) wherever they appear, even
// inside an otherwise valid skill folder.
const JUNK_SEGMENTS = new Set([".git", "__MACOSX"]);

/**
 * True when a zip entry is OS/VCS junk: a macOS `.DS_Store`, anything under a
 * `__MACOSX/` resource fork, or anything inside a `.git/` directory.
 */
export function isJunk(path: string): boolean {
  const segments = path.split("/");
  if (segments[segments.length - 1] === ".DS_Store") {
    return true;
  }
  return segments.some((segment) => JUNK_SEGMENTS.has(segment));
}
