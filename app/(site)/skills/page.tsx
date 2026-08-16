import type { Metadata } from "next";
import { skillCategories, skillLevelLabel } from "@/data/skills";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { PageHeader, Section, Tag } from "@/components/ui/primitives";
import { Terminal } from "@/components/terminal/terminal";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Languages, frameworks, AI tooling, cloud, and databases I work with — explorable through an interactive terminal or as a plain list.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Skills",
    description: "An interactive terminal for exploring what I work with.",
    url: "/skills",
  },
};

export default function SkillsPage() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: formatDateShort(p.date),
  }));
  const projects = getAllProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    period: p.period,
    tech: p.tech,
  }));

  return (
    <>
      <PageHeader
        label="Skills"
        title="Explore the stack"
        description="A real shell — type `help` to start, or `skills ai` to jump straight in. Tab completes and the arrow keys recall history. Everything here is also listed below."
      />

      <Terminal posts={posts} projects={projects} />

      {/*
        Server-rendered inventory. The terminal is progressive enhancement:
        crawlers, screen readers, and no-JS visitors all get the full list.
        The old /skills page rendered none of this into the HTML.
      */}
      <Section id="inventory" label="Reference" title="Full skill inventory">
        <div className="space-y-10">
          {skillCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-lg">{cat.label}</h3>
                <code className="text-faint font-mono text-xs">skills {cat.id}</code>
              </div>
              <p className="text-muted mt-1 text-sm">{cat.description}</p>

              <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {cat.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="border-border flex items-baseline justify-between gap-3 border-b pb-2"
                  >
                    <span className="text-sm">
                      {skill.name}
                      {skill.note && (
                        <span className="text-faint ml-2 text-xs">— {skill.note}</span>
                      )}
                    </span>
                    <Tag size="sm" className="shrink-0">
                      {skillLevelLabel[skill.level]}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
