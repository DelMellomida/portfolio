import Link from "next/link";
import { GitHubError, listRemotePostsWithContent } from "@/lib/github";
import { parsePost } from "@/lib/post-file";
import { ButtonLink, Tag } from "@/components/ui/primitives";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { formatDateShort } from "@/lib/utils";

// Always read the live repo state, never a cached render.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let posts: { slug: string; title: string; date: string; draft: boolean; tags: string[] }[] = [];
  let error: string | null = null;

  try {
    const files = await listRemotePostsWithContent();
    posts = files
      .map((file) => {
        const parsed = parsePost(file.content);
        return {
          slug: file.slug,
          title: parsed.title || file.slug,
          date: parsed.date,
          draft: parsed.draft,
          tags: parsed.tags,
        };
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  } catch (err) {
    error =
      err instanceof GitHubError
        ? err.message
        : "Couldn't reach GitHub. Check GITHUB_TOKEN and GITHUB_REPO.";
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Posts</h1>
          <p className="text-muted mt-1 text-sm">
            Saving commits MDX to the repo. The live site updates once Vercel finishes rebuilding,
            usually under a minute.
          </p>
        </div>
        <ButtonLink href="/admin/new">New post</ButtonLink>
      </div>

      {error ? (
        <div className="border-danger/40 bg-danger/5 rounded-[--radius-card] border p-6">
          <p className="text-danger text-sm font-medium">Couldn&apos;t load posts</p>
          <p className="text-muted mt-2 text-sm">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-10 text-center">
          <p className="text-muted text-sm">No posts yet.</p>
          <ButtonLink href="/admin/new" className="mt-5">
            Write the first one
          </ButtonLink>
        </div>
      ) : (
        <ul className="divide-border border-border divide-y rounded-[--radius-card] border">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="hover:bg-surface-hover flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <Link href={`/admin/edit/${post.slug}`} className="font-medium hover:underline">
                    {post.title}
                  </Link>
                  {post.draft ? (
                    <Tag size="sm" className="text-danger border-danger/40">
                      draft
                    </Tag>
                  ) : (
                    <Tag size="sm" className="text-success border-success/40">
                      published
                    </Tag>
                  )}
                </div>
                <p className="text-faint mt-1 font-mono text-xs">
                  {post.date ? formatDateShort(post.date) : "no date"} · /blog/{post.slug}
                  {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {!post.draft && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-text hover:bg-surface-hover rounded-md px-2.5 py-1.5 text-xs transition-colors"
                  >
                    View ↗
                  </a>
                )}
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="text-muted hover:text-text hover:bg-surface-hover rounded-md px-2.5 py-1.5 text-xs transition-colors"
                >
                  Edit
                </Link>
                <DeletePostButton slug={post.slug} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
