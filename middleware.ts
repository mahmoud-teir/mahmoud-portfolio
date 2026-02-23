import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    console.log("[Middleware] Processing:", pathname)

    // Only protect /admin routes (except /admin/login, /admin/recovery, and /admin/reset-password)
    const isPublicAdminRoute = pathname.startsWith("/admin/login") ||
        pathname.startsWith("/admin/recovery") ||
        pathname.startsWith("/admin/reset-password")

    if (pathname.startsWith("/admin") && !isPublicAdminRoute) {
        // Check for Better Auth session cookie
        const sessionCookie =
            request.cookies.get("better-auth.session_token") ||
            request.cookies.get("__Secure-better-auth.session_token")

        if (!sessionCookie?.value) {
            const loginUrl = new URL("/admin/login", request.url)
            loginUrl.searchParams.set("callbackUrl", pathname)
            return NextResponse.redirect(loginUrl)
        }
    }


    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
