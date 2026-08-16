import { getActivitySummary, getRecentActivity, relativeTime } from "@/lib/github-public";
import { site } from "@/lib/site";
import { Section, Tag, ArrowLink } from "@/components/ui/primitives";
import { GitHubIcon } from "@/components/ui/icons";

/**
 * Live push activity from GitHub.
 *
 * Server Component with timed revalidation — no client-side fetching, so it
 * costs nothing in JS and the content is in the initial HTML. Renders nothing
 * at all if GitHub is unreachable or the account has no recent public pushes,
 * rather than showing an empty shell.
 */
export async function ActivityFeed() {
  const [activity, summary] = await Promise.all([
    getRecentActivity(site.githubUsername, 4),
    getActivitySummary(site.githubUsername),
  ]);

  if (activity.length === 0) return null;

  return (
    <Section
      label="Live"
      title="Recently shipped"
      action={
        <ArrowLink href={`https://github.com/${site.githubUsername}`}>All activity</ArrowLink>
      }
    >
      {summary && (
        <div className="text-muted mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
          <span className="flex items-center gap-1.5">
            <GitHubIcon className="size-3.5" />
            {summary.publicRepos} public repos
          </span>
          {summary.topLanguages.length > 0 && (
            <span className="flex flex-wrap items-center gap-1.5">
              most used:
              {summary.topLanguages.slice(0, 3).map((l) => (
                <Tag key={l.name} size="sm">
                  {l.name}
                </Tag>
              ))}
            </span>
          )}
        </div>
      )}

      <ul className="divide-border border-border divide-y border-y">
        {activity.map((repo) => (
          <li key={repo.repo} className="py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <a
                href={repo.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm hover:underline"
              >
                {repo.repo}
              </a>
              <time
                dateTime={repo.pushedAt}
                className="text-faint shrink-0 font-mono text-xs"
                // The rendered text is only as fresh as the last revalidation;
                // the exact timestamp is always available on hover.
                title={new Date(repo.pushedAt).toLocaleString()}
              >
                {relativeTime(repo.pushedAt)}
              </time>
            </div>

            <ul className="mt-2 space-y-1">
              {repo.commits.map((commit) => (
                <li key={commit.sha}>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-text group flex gap-2.5 text-sm transition-colors"
                  >
                    <code className="text-faint group-hover:text-accent shrink-0 font-mono text-xs leading-relaxed">
                      {commit.sha}
                    </code>
                    <span className="min-w-0 break-words">{commit.message}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="text-faint mt-4 font-mono text-xs">
        Public commits only, refreshed every 15 minutes.
      </p>
    </Section>
  );
}
