"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";

export function ProjectFilter({ projects, tags }: { projects: Project[]; tags: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? projects.filter((p) => p.tech.includes(active)) : projects),
    [projects, active],
  );

  return (
    <>
      <div className="mb-8">
        <h2 className="sr-only">Filter projects by technology</h2>
        <ul className="flex flex-wrap gap-1.5">
          <li>
            <FilterButton active={active === null} onClick={() => setActive(null)}>
              All
            </FilterButton>
          </li>
          {tags.map((tag) => (
            <li key={tag}>
              <FilterButton active={active === tag} onClick={() => setActive(tag)}>
                {tag}
              </FilterButton>
            </li>
          ))}
        </ul>
      </div>

      {/* Announce result count so filtering is perceivable without sight. */}
      <p aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {active ? ` matching ${active}` : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-bg-subtle text-muted hover:text-text hover:border-border-strong",
      )}
    >
      {children}
    </button>
  );
}
