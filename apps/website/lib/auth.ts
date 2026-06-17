import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { generateUniqueHandle } from "@/lib/handle";

// Read at module scope but never throw here: this module is imported during
// `next build`, which has no access to runtime secrets. The values are only
// exercised when a request reaches the auth handler, where the environment is
// populated. Missing values surface as a Keycloak/auth error at request time.
const keycloakIssuer = process.env.KEYCLOAK_ISSUER ?? "";
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID ?? "";
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

async function handleExists(candidate: string): Promise<boolean> {
  const rows = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.handle, candidate))
    .limit(1);

  return rows.length > 0;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  user: {
    // `handle` is assigned server-side on first login and never accepted from
    // the client, so it is not part of the user-editable input surface.
    additionalFields: {
      handle: { type: "string", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Assign the immutable handle exactly once, when the user row is first
        // created. The unique constraint is the final guard against the small
        // race between the existence check and the insert.
        before: async (newUser) => ({
          data: { ...newUser, handle: await generateUniqueHandle(newUser, handleExists) },
        }),
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: keycloakClientId,
          clientSecret: keycloakClientSecret,
          discoveryUrl: `${keycloakIssuer}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email"],
        },
      ],
    }),
  ],
});
