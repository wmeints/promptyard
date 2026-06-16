import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * Resolve the current BetterAuth session on the server. Returns `null` when no
 * user is signed in. Shared by the root layout and the homepage so auth state
 * is read consistently and the UI never flashes the wrong content.
 */
export const getCurrentSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
  return auth.api.getSession({ headers: await headers() });
}
