import { betterAuth } from "better-auth";
import {
    genericOAuth,
    keycloak,
    createAuthMiddleware,
} from "better-auth/plugins";

import { userRepositoryExists, createUserRepository } from "./api";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: false,
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            // After the user is logged in, we need to verify they have a user repository.
            // If not, we should call the user repository creation endpoint.
            if (ctx.path === "/oauth2/callback/:providerId") {
                const exists = await userRepositoryExists();

                if (!exists) {
                    await createUserRepository();
                }
            }
        }),
    },
    plugins: [
        genericOAuth({
            config: [
                keycloak({
                    clientId: process.env.KEYCLOAK_CLIENT_ID!,
                    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
                    issuer: `${process.env.KEYCLOAK_HTTP!}/realms/${process.env
                        .KEYCLOAK_REALM!}`,
                }),
            ],
        }),
    ],
});
