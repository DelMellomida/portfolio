import { getRepoStats, relativeTime } from "@/lib/github-public";
import { StarIcon, ForkIcon, DotIcon } from "@/components/ui/icons";

/**
 * Live repo stats for a case study. Renders nothing if the repo is
 * unreachable, so a rate limit degrades the page rather than breaking it.
 */
export async function RepoStats({ repoUrl }: { repoUrl: string }) {
  const stats = await getRepoStats(repoUrl);
  if (!stats) return null;

  return (
    <div className="border-border bg-bg-subtle mt-8 rounded-[--radius-card] border p-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
        <a
          href={stats.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text font-medium hover:underline"
        >
          {stats.fullName}
        </a>

        {stats.language && (
          <span className="text-muted flex items-center gap-1.5">
            <DotIcon className="text-accent size-2.5" />
            {stats.language}
          </span>
        )}

        <span className="text-muted flex items-center gap-1.5">
          <StarIcon className="size-3.5" />
          {stats.stars}
        </span>

        <span className="text-muted flex items-center gap-1.5">
          <ForkIcon className="size-3.5" />
          {stats.forks}
        </span>

        <span
          className="text-faint ml-auto"
          title={new Date(stats.pushedAt).toLocaleString()}
        >
          last push {relativeTime(stats.pushedAt)}
        </span>
      </div>

      {stats.description && (
        <p className="text-muted mt-3 text-sm leading-relaxed">{stats.description}</p>
      )}
    </div>
  );
}
