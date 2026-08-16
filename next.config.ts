import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy for the public site.
 *
 * script-src carries 'unsafe-inline', and that is a deliberate, documented
 * trade rather than an oversight. Removing it requires a per-response nonce,
 * and a nonce cannot be embedded in a statically prerendered page — every
 * route would have to become dynamic, losing the static generation that makes
 * this site fast. The public pages render no third-party or visitor-supplied
 * content, so the XSS surface they expose is very small.
 *
 * The admin area is different: it holds a session cookie and is already
 * dynamically rendered, so middleware.ts overrides this with a strict
 * nonce-based policy there, where the cost is zero and the value is real.
 *
 * The other directives still do meaningful work even with inline scripts
 * allowed: object-src 'none' and base-uri 'self' block two well-known XSS
 * escalation paths, and form-action 'self' stops an injected form posting
 * credentials off-site.
 */
const publicCsp = [
  "default-src 'self'",
  // 'unsafe-eval' is required by React Refresh in development only.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Next injects critical CSS inline; there is no nonce path for it here.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Speed Insights posts web vitals; everything else is same-origin.
  "connect-src 'self' https://vitals.vercel-insights.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Deny every powerful feature this site never uses. An empty allowlist `()`
 * means "no origin, including this one".
 */
const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "usb=()",
  "xr-spatial-tracking=()",
  "browsing-topics=()",
].join(", ");

const securityHeaders = [
  {
    // Two years, covering subdomains. Vercel sets a baseline already; this
    // pins the value rather than relying on the platform default.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Superseded by frame-ancestors in modern browsers, kept for older ones.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Stops the browser guessing a content type and, for example, executing an
    // uploaded file as script.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Send the full URL to our own origin, only the origin cross-site, and
    // nothing at all when downgrading to HTTP.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  { key: "Permissions-Policy", value: permissionsPolicy },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: publicCsp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework and version to scanners.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Belt and braces with the noindex metadata and the robots.txt rule.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    // Preserve inbound links to the old CRA routes.
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/experience", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
