import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProject } from "@/lib/content";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
import { Suspense } from "react";
import { ArrowLink, Tag } from "@/components/ui/primitives";
import { ExternalLinkIcon, GitHubIcon } from "@/components/ui/icons";
import { RepoStats } from "@/components/github/repo-stats";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/work/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="pt-12 pb-8 sm:pt-16">
      <ArrowLink href="/work" className="mb-8 inline-flex">
        <span className="rotate-180">→</span> Back to work
      </ArrowLink>

      <header>
        <p className="text-faint font-mono text-xs tracking-wider uppercase">
          {project.role} · {project.period}
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl">{project.title}</h1>
        <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed">{project.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t}>
              <Tag size="sm">{t}</Tag>
            </li>
          ))}
        </ul>

        {(project.links?.repo || project.links?.demo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-surface hover:bg-surface-hover inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
              >
                <GitHubIcon className="size-4" />
                Repository
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-surface hover:bg-surface-hover inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
              >
                <ExternalLinkIcon className="size-4" />
                Live demo
              </a>
            )}
          </div>
        )}
        {/* Live stars, forks, language, and last-push time. */}
        {project.links?.repo && (
          <Suspense fallback={null}>
            <RepoStats repoUrl={project.links.repo} />
          </Suspense>
        )}
      </header>

      {project.image && (
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 768px"
          className="border-border mt-10 w-full rounded-lg border object-cover"
        />
      )}

      <div className="prose mt-12 max-w-2xl">
        <MDXRemote source={project.content} options={mdxOptions} components={mdxComponents} />
      </div>
    </article>
  );
}
