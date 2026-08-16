import Link from "next/link";
import { navItems, site, socials } from "@/lib/site";
import { socialIcons } from "@/components/ui/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-mono text-sm font-medium">
              <span className="text-accent">~/</span>
              {site.shortName.toLowerCase()}
            </p>
            <p className="text-muted mt-3 text-sm leading-relaxed">{site.tagline}</p>
            {site.availability.open && (
              <p className="text-muted mt-4 flex items-center gap-2 font-mono text-xs">
                <span className="bg-success size-1.5 rounded-full" aria-hidden="true" />
                {site.availability.label}
              </p>
            )}
          </div>

          <nav aria-label="Footer" className="flex gap-12">
            <div>
              <h2 className="text-faint font-mono text-xs tracking-wider uppercase">Pages</h2>
              <ul className="mt-4 space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted hover:text-text text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-faint font-mono text-xs tracking-wider uppercase">Elsewhere</h2>
              <ul className="mt-4 space-y-2.5">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target={s.key === "email" ? undefined : "_blank"}
                      rel={s.key === "email" ? undefined : "noopener noreferrer"}
                      className="text-muted hover:text-text text-sm transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="border-border mt-12 flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-faint font-mono text-xs">
            © {year} {site.name}
          </p>
          <ul className="flex gap-1">
            {socials
              .filter((s) => s.primary)
              .map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target={s.key === "email" ? undefined : "_blank"}
                      rel={s.key === "email" ? undefined : "noopener noreferrer"}
                      aria-label={s.label}
                      className="text-muted hover:text-text hover:bg-surface-hover inline-flex size-9 items-center justify-center rounded-md transition-colors"
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
