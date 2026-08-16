import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/content";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
import { ArrowLink, Tag } from "@/components/ui/primitives";
import { site, siteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: site.name, url: siteUrl },
    publisher: { "@type": "Person", name: site.name, url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
  };

  return (
    <article className="pt-12 pb-8 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArrowLink href="/blog" className="mb-8 inline-flex">
        <span className="rotate-180">→</span> Back to writing
      </ArrowLink>

      <header className="max-w-2xl">
        {post.draft && (
          <Tag size="sm" className="text-danger border-danger/40 mb-4">
            draft — not listed publicly
          </Tag>
        )}
        <h1 className="text-3xl sm:text-4xl">{post.title}</h1>
        <p className="text-faint mt-4 font-mono text-xs">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingTime}
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
      </header>

      <div className="prose mt-12 max-w-2xl">
        <MDXRemote source={post.content} options={mdxOptions} components={mdxComponents} />
      </div>
    </article>
  );
}
