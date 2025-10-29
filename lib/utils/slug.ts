/**
 * Slug generation utilities
 * Provides functions for creating URL-friendly slugs from titles
 */

/**
 * Generates a URL-friendly slug from a title
 * Converts to lowercase, replaces spaces with dashes, removes special characters
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  // First, normalize the string
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters (keep word chars, spaces, and dashes)
    .replace(/\s+/g, '-'); // Replace spaces with dashes
  
  // Remove consecutive dashes without regex to avoid ReDoS
  while (slug.includes('--')) {
    slug = slug.replace('--', '-');
  }
  
  // Remove leading/trailing dashes
  return slug.replace(/^-+/, '').replace(/-+$/, '');
}

/**
 * Generates a unique slug by appending a number if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}
