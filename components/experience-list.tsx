import type { ExperienceEntry } from "@/lib/types";
import { TagList } from "@/components/ui/primitives";

/**
 * Replaces the old alternating center-spine timeline. That layout put half the
 * content on the right of the spine, which reversed reading order on desktop
 * and collapsed to a plain stack on mobile anyway. A single left-aligned rail
 * reads the same at every width.
 */
export function ExperienceList({
  entries,
  detailed = false,
}: {
  entries: ExperienceEntry[];
  detailed?: boolean;
}) {
  return (
    <ol className="border-border relative space-y-10 border-l pl-6 sm:pl-8">
      {entries.map((entry) => (
        <li key={`${entry.company}-${entry.period}`} className="relative">
          <span
            className={
              entry.current
                ? "bg-accent ring-bg absolute -left-[calc(1.5rem+4.5px)] top-2 size-2.5 rounded-full ring-4 sm:-left-[calc(2rem+4.5px)]"
                : "bg-border-strong ring-bg absolute -left-[calc(1.5rem+4.5px)] top-2 size-2.5 rounded-full ring-4 sm:-left-[calc(2rem+4.5px)]"
            }
            aria-hidden="true"
          />

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-base font-medium">{entry.role}</h3>
            {entry.current && (
              <span className="text-success bg-success/10 rounded px-1.5 py-0.5 font-mono text-[11px]">
                Current
              </span>
            )}
          </div>

          <p className="text-muted mt-1 text-sm">
            {entry.company} · <span className="text-faint">{entry.location}</span>
          </p>
          <p className="text-faint mt-0.5 font-mono text-xs">{entry.period}</p>

          {detailed && (
            <ul className="text-muted mt-4 space-y-2 text-sm leading-relaxed">
              {entry.highlights.map((h) => (
                <li key={h} className="before:text-faint before:mr-2 before:content-['—']">
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            <TagList items={entry.tech} limit={detailed ? undefined : 4} />
          </div>
        </li>
      ))}
    </ol>
  );
}
