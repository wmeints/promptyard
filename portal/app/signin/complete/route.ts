import { isUserOnboarded } from "@/lib/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const onboarded = await isUserOnboarded();

    if (!onboarded) {
        return Response.redirect("/welcome", 302);
    }

    const path = request.nextUrl.searchParams.get("path");
    const redirectPath = path && path.startsWith("/") ? path : "/";

    return Response.redirect(redirectPath, 302);
}
