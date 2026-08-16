import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Admin",
  // Belt and braces alongside the middleware guard — this area should never
  // appear in search results even if a URL leaks.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-bg/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-baseline gap-3">
            <Link href="/admin" className="font-mono text-sm font-medium">
              <span className="text-accent">~/</span>admin
            </Link>
            <Link href="/" className="text-faint hover:text-muted text-xs transition-colors">
              view site ↗
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-6">{children}</main>
    </div>
  );
}
