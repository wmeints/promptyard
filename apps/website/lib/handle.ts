import { slugify } from "./slug";

// Fallback when an email local-part slugifies to nothing (e.g. all-symbol
// addresses). Keeps handles non-empty so the `/<handle>/...` URLs stay valid.
const FALLBACK_HANDLE = "user";

/**
 * Derive the base handle from an email address by slugifying its local-part.
 * This is the un-suffixed candidate; collisions are resolved by
 * {@link generateUniqueHandle}.
 */
export function handleFromEmail(email: string): string {
  const [localPart] = email.split("@");
  return slugify(localPart ?? "") || FALLBACK_HANDLE;
}

/**
 * Produce a unique handle for an email, appending an incrementing numeric
 * suffix on collision (`willem-meints`, `willem-meints-2`, ...). `isTaken`
 * reports whether a candidate already exists, keeping this function free of any
 * database dependency so it stays unit-testable.
 */
export async function generateUniqueHandle(
  email: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = handleFromEmail(email);

  if (!(await isTaken(base))) {
    return base;
  }

  for (let suffix = 2; ; suffix++) {
    const candidate = `${base}-${suffix}`;
    if (!(await isTaken(candidate))) {
      return candidate;
    }
  }
}
