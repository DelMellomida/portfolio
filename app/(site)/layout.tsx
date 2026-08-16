import { ThemeProvider } from "@/components/layout/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

/**
 * Chrome for the public site. The admin area deliberately doesn't use this.
 *
 * The ThemeProvider sits here rather than in the root layout so the admin can
 * mount its own with a CSP nonce, without making these pages dynamic.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <a
        href="#main"
        className="focus:bg-surface focus:text-text focus:border-border sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:border focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-5 sm:px-6">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
