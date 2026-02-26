import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    console.log("[Middleware] Processing:", pathname)

    // 1. Generate Nonce for Content Security Policy
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

    // 2. CSP Directives
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()

    // 3. Set Request Headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    requestHeaders.set('Content-Security-Policy', cspHeader)

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

    // 5. Finalize Response and apply CSP
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    response.headers.set('Content-Security-Policy', cspHeader)
    response.headers.set('X-Nonce', nonce)

    return response
}

export const config = {
    matcher: [
        // Match all routes for CSP, except Next.js internals
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ]
}
