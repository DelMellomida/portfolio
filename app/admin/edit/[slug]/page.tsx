import { notFound } from "next/navigation";
import { getRemotePost } from "@/lib/github";
import { parsePost } from "@/lib/post-file";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const file = await getRemotePost(slug);
  if (!file) notFound();

  const parsed = parsePost(file.content);

  return <PostEditor mode="edit" initial={{ slug, ...parsed }} />;
}
