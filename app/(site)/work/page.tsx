import type { Metadata } from "next";
import { getAllProjects, getProjectTags } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/primitives";
import { ProjectFilter } from "@/components/work/project-filter";

export const metadata: Metadata = pageMetadata({
  title: "Software Engineering Work",
  description:
    "Case studies by Jhondel Mellomida on AI agent systems, contract analysis pipelines, real-time apps, backend architecture, and applied ML.",
  path: "/work",
});

export default function WorkPage() {
  const projects = getAllProjects();
  const tags = getProjectTags();

  return (
    <>
      <PageHeader
        label="Work"
        title="Selected projects"
        description="Each of these is a case study rather than a screenshot: what the problem actually was, the architecture I chose, and the parts I'd build differently now."
      />
      <ProjectFilter projects={projects} tags={tags} />
      <div className="pb-8" />
    </>
  );
}
