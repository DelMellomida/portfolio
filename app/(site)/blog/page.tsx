import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { PageHeader, Tag } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on AI agent systems, retrieval pipelines, observability, and the engineering around them.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Writing",
    description: "Notes on AI agent systems, observability, and backend engineering.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        label="Writing"
        title="Notes"
        description="Mostly about building AI systems that have to survive contact with production — agents, retrieval, and the observability that tells you when they break."
      />

      {posts.length === 0 ? (
        <p className="text-muted py-12 text-sm">No posts published yet.</p>
      ) : (
        <ul className="divide-border border-border divide-y border-t pb-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="group relative py-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-lg font-medium">
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                      {post.title}
                    </Link>
                  </h2>
                  {post.draft && (
                    <Tag size="sm" className="text-danger border-danger/40">
                      draft
                    </Tag>
                  )}
                </div>

                <p className="text-faint mt-1 font-mono text-xs">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true"> · </span>
                  {post.readingTime}
                </p>

                <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Tag size="sm">{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
