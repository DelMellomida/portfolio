/**
 * Read-only GitHub data for the public site.
 *
 * Separate from lib/github.ts, which writes content on behalf of the admin.
 * This module only ever reads, is safe to call from Server Components, and
 * degrades to null rather than throwing — a rate limit or an outage should
 * hide a widget, never break a page.
 *
 * Caching: responses are revalidated on a timer rather than fetched per
 * request. "Live" here means minutes-fresh, which is the right tradeoff
 * against GitHub's rate limits and page latency.
 */

const API = "https://api.github.com";

/** Unauthenticated is 60 req/hr per IP — shared across Vercel, so it runs out
 *  fast. GITHUB_TOKEN (already configured for the admin) raises it to 5,000. */
function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: headers(),
      next: { revalidate },
    });

    if (!res.ok) {
      if (res.status === 403) console.warn(`GitHub rate limit hit on ${path}`);
      else console.warn(`GitHub ${res.status} on ${path}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn(`GitHub request failed for ${path}:`, error);
    return null;
  }
}

/* ------------------------------------------------------------------ repos */

export interface RepoStats {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  pushedAt: string;
  url: string;
  topics: string[];
}

interface RawRepo {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  pushed_at: string;
  html_url: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
}

function toStats(repo: RawRepo): RepoStats {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    language: repo.language,
    pushedAt: repo.pushed_at,
    url: repo.html_url,
    topics: repo.topics ?? [],
  };
}

/** Stats for one repo, given a github.com URL. Used on case study pages. */
export async function getRepoStats(repoUrl: string): Promise<RepoStats | null> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;

  const [, owner, name] = match;
  const repo = await get<RawRepo>(`/repos/${owner}/${name?.replace(/\.git$/, "")}`, 1800);
  return repo ? toStats(repo) : null;
}

/* --------------------------------------------------------------- activity */

export interface RepoActivity {
  repo: string;
  repoUrl: string;
  pushedAt: string;
  language: string | null;
  commits: { message: string; sha: string; url: string; date: string }[];
}

interface RawCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null };
}

/**
 * Recent commits across the most recently pushed repos, newest first.
 *
 * Deliberately NOT built on /users/{u}/events/public. GitHub has slimmed that
 * feed down: PushEvent payloads no longer carry a `commits` array (only
 * ref/head/before), and PullRequestEvent payloads no longer carry the PR title
 * or URL — so it can tell you *that* something happened but not *what*.
 *
 * Reading the commits API per repo costs a few more requests but returns real
 * messages, which is the only version of this widget worth showing.
 *
 * Covers public repos the account owns; private work never appears.
 */
export async function getRecentActivity(
  username: string,
  repoLimit = 3,
  perRepo = 3,
): Promise<RepoActivity[]> {
  const repos = await get<RawRepo[]>(`/users/${username}/repos?per_page=100&sort=pushed`, 900);
  if (!repos) return [];

  const recent = repos.filter((r) => !r.fork && !r.archived).slice(0, repoLimit);

  const loaded = await Promise.all(
    recent.map(async (repo) => {
      const commits = await get<RawCommit[]>(
        `/repos/${repo.full_name}/commits?per_page=${perRepo}`,
        900,
      );
      if (!commits?.length) return null;

      return {
        repo: repo.full_name,
        repoUrl: repo.html_url,
        pushedAt: repo.pushed_at,
        language: repo.language,
        commits: commits.map((c) => ({
          // Summary line only — commit bodies are often many paragraphs.
          message: c.commit.message.split("\n")[0] ?? c.commit.message,
          sha: c.sha.slice(0, 7),
          url: c.html_url,
          date: c.commit.author?.date ?? repo.pushed_at,
        })),
      } satisfies RepoActivity;
    }),
  );

  return loaded.filter((r): r is RepoActivity => r !== null);
}

/* ----------------------------------------------------------------- summary */

export interface ActivitySummary {
  publicRepos: number;
  followers: number;
  topLanguages: { name: string; count: number }[];
  lastPushedRepo: { name: string; url: string; pushedAt: string } | null;
}

interface RawUser {
  public_repos: number;
  followers: number;
}

export async function getActivitySummary(username: string): Promise<ActivitySummary | null> {
  const [user, repos] = await Promise.all([
    get<RawUser>(`/users/${username}`, 3600),
    get<RawRepo[]>(`/users/${username}/repos?per_page=100&sort=pushed`, 1800),
  ]);

  if (!user || !repos) return null;

  // Forks and archived repos say nothing about what someone actually builds.
  const owned = repos.filter((r) => !r.fork && !r.archived);

  const languageCounts = new Map<string, number>();
  for (const repo of owned) {
    if (!repo.language) continue;
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }

  const topLanguages = [...languageCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const mostRecent = owned[0];

  return {
    publicRepos: user.public_repos,
    followers: user.followers,
    topLanguages,
    lastPushedRepo: mostRecent
      ? { name: mostRecent.name, url: mostRecent.html_url, pushedAt: mostRecent.pushed_at }
      : null,
  };
}

/** "3 hours ago" — relative times make staleness obvious at a glance. */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;

  return `${Math.round(months / 12)}y ago`;
}
