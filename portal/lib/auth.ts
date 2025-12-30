import { betterAuth } from "better-auth";
import {
    genericOAuth,
    auth0,
    hubspot,
    keycloak,
    line,
    microsoftEntraId,
    okta,
    slack,
    patreon,
} from "better-auth/plugins";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: false,
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
