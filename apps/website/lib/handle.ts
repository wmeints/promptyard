import { slugify } from "./slug";

// Number of hex characters in the random fallback handle. Used only when neither
// the email local-part nor the name yields any slug characters, so it is rare;
// the DB unique constraint is the backstop for the unlikely collision.
const RANDOM_HANDLE_LENGTH = 12;

// Upper bound on collision-suffix attempts. A free slot effectively always
// exists, so hitting this means something is wrong (e.g. a misbehaving
// `isTaken`); failing loudly beats an unbounded hang on the request path.
const MAX_HANDLE_SUFFIX = 100;

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

  for (let suffix = 2; suffix <= MAX_HANDLE_SUFFIX; suffix++) {
    const candidate = `${base}-${suffix}`;
    if (!(await isTaken(candidate))) {
      return candidate;
    }
  }

  throw new Error(
    `Could not find a unique handle for "${base}" after ${MAX_HANDLE_SUFFIX} attempts`,
  );
}
