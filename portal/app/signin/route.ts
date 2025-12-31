import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const result = await auth.api.signInWithOAuth2({
        body: {
            providerId: "keycloak",
            callbackURL: `/signin/complete?path=${encodeURIComponent(
                request.url
            )}`,
            errorCallbackURL: "/signin/failed",
        },
    });

    if (result.redirect) {
        return Response.redirect(result.url, 302);
    }

    return new Response();
}
