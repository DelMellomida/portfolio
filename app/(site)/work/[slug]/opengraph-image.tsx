import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/content";
import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return ogImage({
    eyebrow: "Case study",
    title: project.title,
    footer: project.tech.slice(0, 3).join(" · "),
  });
}
