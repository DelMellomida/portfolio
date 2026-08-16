import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Guards everything under /admin and /api/admin, and applies a strict
 * nonce-based CSP to admin pages.
 *
 * The login page and login endpoint are excluded from the auth check,
 * otherwise there would be no way in — but they still get the strict CSP,
 * since the login form is exactly where an injected script would be most
 * valuable to an attacker.
 *
 * Runs on the Edge runtime, which is why lib/auth.ts uses Web Crypto only.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (!isLoginPage && !isLoginApi) {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      console.error("AUTH_SECRET is not set — refusing all admin access.");
      return respondUnauthorized(request, pathname);
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token, secret))) {
      return respondUnauthorized(request, pathname);
    }
  }

  // API routes return JSON, so a document CSP would be pointless there.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  return withStrictCsp(request);
}

/**
 * Admin pages are already dynamically rendered, so a per-response nonce costs
 * nothing here — unlike the public site, where it would force every static
 * page to become dynamic.
 *
 * Next.js reads the CSP from the *request* header and stamps the nonce onto
 * the script tags it emits; `strict-dynamic` then covers the chunks those
 * scripts load, so no bundle path needs listing.
 */
function withStrictCsp(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const csp = [
    "default-src 'self'",
    // 'unsafe-inline' is ignored by browsers that honour the nonce; it is left
    // in only as a fallback for older ones. 'unsafe-eval' is dev-only (React Refresh).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'${
      process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
    }`,
    // Styles stay inline-allowed: Next injects critical CSS without a nonce,
    // and injected CSS is a far smaller risk than injected script.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  // Overrides the looser site-wide policy set in next.config.ts.
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

function respondUnauthorized(request: NextRequest, pathname: string) {
  // APIs get a status code; pages get sent to the login screen.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
