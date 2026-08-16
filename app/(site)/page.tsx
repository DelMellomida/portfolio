import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ActivityFeed } from "@/components/github/activity-feed";
import { site, primarySocials, siteUrl } from "@/lib/site";
import { heroRoles, shortBio } from "@/data/profile";
import { experience } from "@/data/experience";
import { getSkillCategories } from "@/lib/skills-server";
import { getFeaturedProjects, getAllPosts } from "@/lib/content";
import { TypingRoles } from "@/components/home/typing-roles";
import { ProjectCard } from "@/components/work/project-card";
import { ExperienceList } from "@/components/experience-list";
import { ArrowLink, ButtonLink, Section, Tag } from "@/components/ui/primitives";
import { socialIcons, DownloadIcon, TerminalIcon } from "@/components/ui/icons";
import { formatDateShort } from "@/lib/utils";

export default function HomePage() {
  const projects = getFeaturedProjects();
  const posts = getAllPosts().slice(0, 3);
  const skillCategories = getSkillCategories();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: siteUrl,
    jobTitle: site.role,
    email: site.email,
    description: site.description,
    address: { "@type": "PostalAddress", addressLocality: site.location },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Pamantasan ng Lungsod ng Pasig",
    },
    worksFor: [
      { "@type": "Organization", name: "Ellinov Technologies" },
      { "@type": "Organization", name: "DEVCON Philippines" },
    ],
    knowsAbout: skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
    sameAs: primarySocials.filter((s) => s.key !== "email").map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Hero */}
      <section className="flex flex-col-reverse items-center gap-10 pt-12 pb-8 sm:pt-20 md:flex-row md:justify-between md:gap-16 md:pt-24">
        <div className="max-w-xl">
          {site.availability.open && (
            <p className="text-muted mb-5 flex items-center gap-2 font-mono text-xs">
              <span className="bg-success size-1.5 animate-pulse rounded-full" aria-hidden="true" />
              {site.availability.label}
            </p>
          )}

          <h1 className="text-4xl leading-[1.05] sm:text-5xl md:text-6xl">{site.name}</h1>

          <TypingRoles roles={heroRoles} className="mt-3 text-lg sm:text-xl" />

          <p className="text-muted mt-6 text-base leading-relaxed">{shortBio}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/work">View work</ButtonLink>
            <ButtonLink href="/skills" variant="secondary">
              <TerminalIcon className="size-4" />
              Try the terminal
            </ButtonLink>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-text hover:bg-surface-hover inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors"
            >
              <DownloadIcon className="size-4" />
              Résumé
            </a>
          </div>

          <ul className="mt-8 flex gap-1">
            {primarySocials.map((s) => {
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
                    <Icon className="size-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="shrink-0">
          <Image
            src="/images/me.jpg"
            alt={`Portrait of ${site.name}`}
            width={280}
            height={280}
            priority
            sizes="(max-width: 768px) 200px, 280px"
            className="border-border w-[200px] rounded-full border-2 object-cover md:w-[280px]"
          />
        </div>
      </section>

      {/* Featured work */}
      <Section
        label="Selected work"
        title="Things I've built"
        action={<ArrowLink href="/work">All work</ArrowLink>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section
        label="Experience"
        title="Where I've worked"
        action={<ArrowLink href="/about">Full background</ArrowLink>}
      >
        <ExperienceList entries={experience} />
      </Section>

      {/* Skills */}
      <Section
        label="Toolkit"
        title="What I work with"
        action={<ArrowLink href="/skills">Explore in terminal</ArrowLink>}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {skillCategories.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-mono text-sm font-medium">{cat.label}</h3>
              <p className="text-faint mt-1 text-xs">{cat.description}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {cat.skills.map((s) => (
                  <li key={s.name}>
                    <Tag size="sm">{s.name}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Writing */}
      {posts.length > 0 && (
        <Section
          label="Writing"
          title="Recent posts"
          action={<ArrowLink href="/blog">All posts</ArrowLink>}
        >
          <ul className="divide-border border-border divide-y border-y">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:bg-surface-hover -mx-3 flex flex-col gap-1 rounded-md px-3 py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-medium">{post.title}</span>
                  <span className="text-faint shrink-0 font-mono text-xs">
                    {formatDateShort(post.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/*
        Live GitHub activity. Suspended so a slow or rate-limited GitHub
        response streams in late instead of holding up the whole page.
      */}
      <Suspense fallback={null}>
        <ActivityFeed />
      </Suspense>

      {/* CTA */}
      <Section>
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-8 text-center sm:p-12">
          <h2 className="text-2xl sm:text-3xl">Let&apos;s build something</h2>
          <p className="text-muted mx-auto mt-3 max-w-md text-sm leading-relaxed">
            {site.availability.detail}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            <ButtonLink href="/about" variant="secondary">
              More about me
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
