import { slugify } from "./slug";

// Number of hex characters in the random fallback handle. Used only when neither
// the email local-part nor the name yields any slug characters, so it is rare;
// the DB unique constraint is the backstop for the unlikely collision.
const RANDOM_HANDLE_LENGTH = 12;

/** Identity fields a handle can be derived from, in order of preference. */
export type HandleSource = {
  email?: string | null;
  name?: string | null;
};

/**
 * Derive the un-suffixed handle candidate from a user's identity, preferring the
 * email local-part, then the display name, then a short random token. Always
 * returns a non-empty value so the `/<handle>/...` URLs stay valid; collisions
 * are resolved by {@link generateUniqueHandle}.
 */
export function deriveBaseHandle({ email, name }: HandleSource): string {
  const fromEmail = email ? slugify(email.split("@")[0] ?? "") : "";
  if (fromEmail) return fromEmail;

  const fromName = name ? slugify(name) : "";
  if (fromName) return fromName;

  return crypto.randomUUID().replace(/-/g, "").slice(0, RANDOM_HANDLE_LENGTH);
}

/**
 * Produce a unique handle for a user, appending an incrementing numeric suffix
 * on collision (`willem-meints`, `willem-meints-2`, ...). `isTaken` reports
 * whether a candidate already exists, keeping this function free of any database
 * dependency so it stays unit-testable.
 */
export async function generateUniqueHandle(
  source: HandleSource,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = deriveBaseHandle(source);

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
