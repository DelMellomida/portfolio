import Link from "next/link";
import { ButtonLink } from "@/components/ui/primitives";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { site } from "@/lib/site";

/**
 * Global 404. Renders under the root layout, which has no site chrome, so it
 * carries its own minimal header.
 */
export default function NotFound() {
  return (
    // Its own provider: the root layout no longer has one, and an unmatched
    // URL renders here rather than inside the (site) layout.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 sm:px-6">
        <header className="flex h-16 items-center">
          <Link
            href="/"
            className="font-mono text-sm font-medium tracking-tight transition-opacity hover:opacity-70"
          >
            <span className="text-accent">~/</span>
            {site.shortName.toLowerCase()}
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <p className="text-accent font-mono text-sm">404</p>
          <h1 className="mt-4 text-3xl sm:text-4xl">Page not found</h1>
          <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
            That route doesn&apos;t exist. It may have moved, or the link may be out of date.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Back home</ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              See my work
            </ButtonLink>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
