import type { Metadata } from "next";
import { site, socials } from "@/lib/site";
import { PageHeader } from "@/components/ui/primitives";
import { ContactForm } from "@/components/contact/contact-form";
import { socialIcons, DownloadIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about engineering roles, AI/ML work, or freelance collaborations.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description: `Get in touch with ${site.name}.`,
    url: "/contact",
  },
};

const openTo = [
  {
    title: "Full-time roles",
    detail: "AI/ML engineering and backend-leaning full-stack positions, onsite in Metro Manila or remote.",
  },
  {
    title: "Freelance & contract",
    detail: "Agent systems, RAG pipelines, API design, and observability setup — scoped projects welcome.",
  },
  {
    title: "Collaboration",
    detail: "Open source, hackathons, or anything involving agents doing something genuinely useful.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Get in touch"
        description="The form goes straight to my inbox and I read everything. If you'd rather not use a form, my email and socials are below."
      />

      <div className="grid gap-12 pb-8 md:grid-cols-[minmax(0,1fr)_280px] md:gap-16">
        <div>
          <ContactForm />
        </div>

        <aside className="space-y-10">
          {site.availability.open && (
            <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-5">
              <p className="flex items-center gap-2 font-mono text-xs">
                <span className="bg-success size-1.5 rounded-full" aria-hidden="true" />
                {site.availability.label}
              </p>
              <p className="text-muted mt-3 text-sm leading-relaxed">{site.availability.detail}</p>
            </div>
          )}

          <div>
            <h2 className="text-faint font-mono text-xs tracking-wider uppercase">Open to</h2>
            <ul className="mt-4 space-y-4">
              {openTo.map((item) => (
                <li key={item.title}>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-muted mt-1 text-sm leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-faint font-mono text-xs tracking-wider uppercase">Elsewhere</h2>
            <ul className="mt-4 space-y-1">
              {socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target={s.key === "email" ? undefined : "_blank"}
                      rel={s.key === "email" ? undefined : "noopener noreferrer"}
                      className="text-muted hover:text-text hover:bg-surface-hover -mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
                    >
                      <Icon className="size-4 shrink-0" />
                      {s.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-text hover:bg-surface-hover -mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
                >
                  <DownloadIcon className="size-4 shrink-0" />
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>

          <p className="text-faint text-xs leading-relaxed">
            Based in {site.location}. Usually reply within a couple of days.
          </p>
        </aside>
      </div>
    </>
  );
}
