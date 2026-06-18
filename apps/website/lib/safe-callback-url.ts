// Browsers drop these characters from a URL before resolving it, so a value
// like "/\t/evil.example" becomes "//evil.example" — a foreign origin.
const URL_SMUGGLING_CHARS = /[\t\n\r]/g;

/**
 * Clamp a post-sign-in redirect target to a same-site relative path, returning
 * the home page for anything else. Absolute ("https://…"), protocol-relative
 * ("//host") and backslash ("/\host") forms all resolve to another origin and
 * would otherwise be an open redirect, so they are rejected at the boundary.
 */
export function toSafeCallbackURL(callbackURL: string | undefined): string {
  if (!callbackURL) return "/";
  const candidate = callbackURL.replace(URL_SMUGGLING_CHARS, "");

  if (
    candidate.startsWith("/") &&
    !candidate.startsWith("//") &&
    !candidate.startsWith("/\\")
  ) {
    return candidate;
  }

  return "/";
}
