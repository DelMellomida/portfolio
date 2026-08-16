import type { Metadata } from "next";
import { getAllProjects, getProjectTags } from "@/lib/content";
import { PageHeader } from "@/components/ui/primitives";
import { ProjectFilter } from "@/components/work/project-filter";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies on AI agent systems, contract analysis pipelines, and real-time applications — the problem, the architecture, and what I'd do differently.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work",
    description: "Case studies on AI agent systems, backend architecture, and applied ML.",
    url: "/work",
  },
};

export default function WorkPage() {
  const projects = getAllProjects();
  const tags = getProjectTags();

  return (
    <>
      <PageHeader
        label="Work"
        title="Selected projects"
        description="Each of these is a case study rather than a screenshot — what the problem actually was, the architecture I chose, and the parts I'd build differently now."
      />
      <ProjectFilter projects={projects} tags={tags} />
      <div className="pb-8" />
    </>
  );
}
