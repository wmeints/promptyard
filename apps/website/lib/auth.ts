import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";

// Read at module scope but never throw here: this module is imported during
// `next build`, which has no access to runtime secrets. The values are only
// exercised when a request reaches the auth handler, where the environment is
// populated. Missing values surface as a Keycloak/auth error at request time.
const keycloakIssuer = process.env.KEYCLOAK_ISSUER ?? "";
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID ?? "";
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
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
