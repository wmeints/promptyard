import { betterAuth } from "better-auth";
import {
    createAuthMiddleware,
    genericOAuth,
    keycloak,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: false,
    },
    plugins: [
        nextCookies(),
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
