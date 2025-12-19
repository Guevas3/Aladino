import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get("auth_session");
    const { pathname } = request.nextUrl;

    // Login page: If authenticated, redirect to dashboard
    if (pathname === "/login") {
        if (authCookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Protected routes: If not authenticated, redirect to login
    if (!authCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/bookings/:path*", "/finance/:path*", "/login"],
};
