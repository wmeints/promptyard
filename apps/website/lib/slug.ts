const DIACRITICS = /[̀-ͯ]/g;
const NON_SLUG_CHARS = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

/**
 * Turn an arbitrary string (a frontmatter name or an email local-part) into a
 * URL-safe slug: lowercase ASCII alphanumerics separated by single hyphens.
 * Shared by handle derivation and content identity so both slug identically.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(NON_SLUG_CHARS, "-")
    .replace(EDGE_HYPHENS, "");
}
