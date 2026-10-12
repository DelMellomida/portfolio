import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site, siteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${site.name} - ${site.role}`,
    description: site.description,
    path: "/",
  }),
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} - ${site.role}`,
    template: `%s - ${site.name}`,
  },
  keywords: [
    "Jhondel Mellomida",
    "Jhondel Mellomida portfolio",
    "Jhondel Mellomida software engineer",
    "software engineer",
    "AI engineer",
    "AI systems engineer",
    "LLM",
    "agent systems",
    "RAG",
    "observability",
    "OpenTelemetry",
    "Python",
    "TypeScript",
    "Next.js",
    site.name,
  ],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${site.name} - Writing` }],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f14" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased`}>
        {/*
          Chrome and the theme provider live in the (site) and admin layouts,
          not here. The admin needs its own header, and its ThemeProvider needs
          a CSP nonce read from request headers - doing that here would make
          the root layout dynamic and drag every static page down with it.
        */}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
