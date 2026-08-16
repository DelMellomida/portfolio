import type { Metadata } from "next";
import Image from "next/image";
import { bio, certifications, education, interests } from "@/data/profile";
import { experience } from "@/data/experience";
import { site } from "@/lib/site";
import { ExperienceList } from "@/components/experience-list";
import { ButtonLink, PageHeader, Section } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — software engineer working on AI agent systems, backend architecture, and observability. Background, experience, and education.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description: `Background and experience of ${site.name}, software engineer.`,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader label="About" title="Background" />

      <div className="flex flex-col-reverse gap-10 md:flex-row md:gap-12">
        <div className="max-w-2xl space-y-5">
          {bio.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
          <p className="text-muted leading-relaxed">
            Away from the screen I sing, cycle, and read more astronomy and physics than is strictly
            useful for my job.
          </p>
          <span className="sr-only">Interests: {interests.join(", ")}.</span>
        </div>

        <div className="shrink-0">
          <Image
            src="/images/cat.png"
            alt=""
            width={240}
            height={240}
            sizes="(max-width: 768px) 180px, 240px"
            className="border-border w-[180px] rounded-lg border object-cover md:w-[240px]"
          />
        </div>
      </div>

      <Section id="experience" label="Experience" title="Where I've worked">
        <ExperienceList entries={experience} detailed />
      </Section>

      <Section id="education" label="Education" title="Studies & certifications">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-sm font-medium">Education</h3>
            <ul className="mt-4 space-y-5">
              {education.map((e) => (
                <li key={e.credential}>
                  <p className="text-sm font-medium">{e.credential}</p>
                  <p className="text-muted mt-0.5 text-sm">{e.institution}</p>
                  <p className="text-faint mt-0.5 font-mono text-xs">{e.period}</p>
                  {e.detail && <p className="text-muted mt-2 text-sm leading-relaxed">{e.detail}</p>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-sm font-medium">Certifications</h3>
            <ul className="mt-4 space-y-5">
              {certifications.map((c) => (
                <li key={c.issuer}>
                  <p className="text-sm font-medium">{c.issuer}</p>
                  <ul className="text-muted mt-1.5 space-y-1 text-sm">
                    {c.items.map((item) => (
                      <li key={item} className="before:text-faint before:mr-2 before:content-['—']">
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-8 sm:p-10">
          <h2 className="text-xl">Want the short version?</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            The résumé covers the same ground in one page.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-fg hover:bg-accent-hover inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors"
            >
              Download résumé
            </a>
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
