import Link from "next/link";
import type { Project } from "@/lib/types";
import { TagList } from "@/components/ui/primitives";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Replaces the old click-to-open modal. A card links to a real page, so the
 * content is crawlable, linkable, and reachable by keyboard for free —
 * the old version was a clickable <div> with no role or tab stop.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-border bg-surface hover:border-border-strong relative rounded-[--radius-card] border p-5 transition-colors sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-medium">
          <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <span className="text-faint shrink-0 font-mono text-xs">{project.period}</span>
      </div>

      <p className="text-faint mt-1 font-mono text-xs">{project.role}</p>

      <p className="text-muted mt-3 text-sm leading-relaxed">{project.summary}</p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <TagList items={project.tech} limit={5} />
        <ArrowRightIcon className="text-faint group-hover:text-accent size-4 shrink-0 transition-all group-hover:translate-x-0.5" />
      </div>
    </article>
  );
}
