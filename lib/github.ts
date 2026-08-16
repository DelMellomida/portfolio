/**
 * Thin wrapper over the GitHub Contents API.
 *
 * The admin writes MDX straight into the repo, so posts keep their git history
 * and every publish is a real commit. A push triggers Vercel's rebuild, which
 * is why saving takes ~30s to appear on the live site.
 *
 * Node runtime only (uses Buffer) — these are called from route handlers.
 */

const API = "https://api.github.com";
const BLOG_DIR = "content/blog";

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export function getRepoConfig(): RepoConfig {
  const token = process.env.GITHUB_TOKEN;
  const slug = process.env.GITHUB_REPO;

  if (!token) throw new GitHubError("GITHUB_TOKEN is not set", 503);
  if (!slug) throw new GitHubError("GITHUB_REPO is not set (expected owner/repo)", 503);

  const [owner, repo] = slug.split("/");
  if (!owner || !repo) {
    throw new GitHubError(`GITHUB_REPO must look like owner/repo, got "${slug}"`, 503);
  }

  return { owner, repo, branch: process.env.GITHUB_BRANCH ?? "main", token };
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = getRepoConfig();

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new GitHubError(body.message ?? `GitHub request failed (${res.status})`, res.status);
  }

  return res.json() as Promise<T>;
}

function contentsPath(file?: string): string {
  const { owner, repo } = getRepoConfig();
  const suffix = file ? `/${file}` : "";
  return `/repos/${owner}/${repo}/contents/${BLOG_DIR}${suffix}`;
}

export interface RemoteFile {
  name: string;
  slug: string;
  path: string;
  sha: string;
}

interface ContentsEntry {
  name: string;
  path: string;
  sha: string;
  type: string;
}

/** Lists the MDX files currently in content/blog on the target branch. */
export async function listRemotePosts(): Promise<RemoteFile[]> {
  const { branch } = getRepoConfig();

  let entries: ContentsEntry[];
  try {
    entries = await gh<ContentsEntry[]>(`${contentsPath()}?ref=${branch}`);
  } catch (error) {
    // An empty or missing directory is a valid state, not a failure.
    if (error instanceof GitHubError && error.status === 404) return [];
    throw error;
  }

  return entries
    .filter((e) => e.type === "file" && e.name.endsWith(".mdx"))
    .map((e) => ({
      name: e.name,
      slug: e.name.replace(/\.mdx$/, ""),
      path: e.path,
      sha: e.sha,
    }));
}

export interface RemoteFileContent extends RemoteFile {
  content: string;
}

export async function getRemotePost(slug: string): Promise<RemoteFileContent | null> {
  const { branch } = getRepoConfig();

  try {
    const file = await gh<ContentsEntry & { content: string; encoding: string }>(
      `${contentsPath(`${slug}.mdx`)}?ref=${branch}`,
    );
    return {
      name: file.name,
      slug,
      path: file.path,
      sha: file.sha,
      content: Buffer.from(file.content, "base64").toString("utf8"),
    };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return null;
    throw error;
  }
}

interface CommitResult {
  commit: { sha: string; html_url: string };
  content: { sha: string } | null;
}

/**
 * Creates or updates a post. Passing `sha` updates that exact blob — GitHub
 * rejects the write if the file moved on in the meantime, which is what stops
 * two editors silently overwriting each other.
 */
export async function writeRemotePost(options: {
  slug: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<CommitResult> {
  const { branch } = getRepoConfig();

  return gh<CommitResult>(contentsPath(`${options.slug}.mdx`), {
    method: "PUT",
    body: JSON.stringify({
      message: options.message,
      content: Buffer.from(options.content, "utf8").toString("base64"),
      branch,
      ...(options.sha ? { sha: options.sha } : {}),
    }),
  });
}

/**
 * Lists posts with their frontmatter, by fetching each file's contents.
 *
 * That's one request per post, which is fine at this scale and keeps the admin
 * showing the true repo state rather than whatever was bundled at last deploy.
 * If the post count ever gets large, switch to the Git Trees API plus a single
 * blob fetch per changed file.
 */
export async function listRemotePostsWithContent(): Promise<RemoteFileContent[]> {
  const files = await listRemotePosts();
  const loaded = await Promise.all(files.map((f) => getRemotePost(f.slug)));
  return loaded.filter((f): f is RemoteFileContent => f !== null);
}

export async function deleteRemotePost(options: {
  slug: string;
  sha: string;
  message: string;
}): Promise<CommitResult> {
  const { branch } = getRepoConfig();

  return gh<CommitResult>(contentsPath(`${options.slug}.mdx`), {
    method: "DELETE",
    body: JSON.stringify({
      message: options.message,
      sha: options.sha,
      branch,
    }),
  });
}
