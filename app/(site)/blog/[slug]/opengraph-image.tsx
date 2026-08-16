import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/content";
import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { formatDateShort } from "@/lib/utils";

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return ogImage({
    eyebrow: "Writing",
    title: post.title,
    footer: formatDateShort(post.date),
  });
}
