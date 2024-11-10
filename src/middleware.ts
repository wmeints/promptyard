import { NextResponse } from "next/server";

export function middleware(request: Request) {
    // Inject the X-Pathname header into the request so we can determine the current location
    // inside server components without falling back to client-side rendering.
    const headers = new Headers(request.headers);
    headers.append("X-Pathname", new URL(request.url).pathname);

    const response = NextResponse.next({
        request: new Request(request, { headers }),
    })

    return response;
}