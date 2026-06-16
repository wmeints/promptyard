import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { cache } from "react";

// Only avatar URLs served by our own Keycloak instance are trusted. The `image`
// claim is attacker-influenced (a compromised or malicious token could point it
// at an arbitrary origin), and Radix's AvatarImage renders a plain <img> that
// bypasses Next.js' image domain restrictions — so validate the origin here,
// before the URL ever reaches the browser.
const trustedImageOrigin = originOf(process.env.KEYCLOAK_ISSUER);

function originOf(url: string | undefined | null): string | null {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function trustedImage(image: string | null | undefined): string | null {
  if (!image || !trustedImageOrigin) {
    return null;
  }

  return originOf(image) === trustedImageOrigin ? image : null;
}

/**
 * Resolve the current BetterAuth session on the server. Returns `null` when no
 * user is signed in. Shared by the root layout and the homepage so auth state
 * is read consistently and the UI never flashes the wrong content.
 */
export const getCurrentSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }

  return {
    ...session,
    user: { ...session.user, image: trustedImage(session.user.image) },
  };
});
