import { GitHubError, getRemoteFile } from "@/lib/github";
import { SKILLS_PATH, formatSkillIssues, parseSkills, type SkillCategory } from "@/lib/skills";
import { SkillsEditor } from "@/components/admin/skills-editor";
import { z } from "zod";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  let categories: SkillCategory[] = [];
  let sha: string | null = null;
  let error: string | null = null;

  try {
    const file = await getRemoteFile(SKILLS_PATH);
    if (file) {
      sha = file.sha;
      try {
        categories = parseSkills(file.content);
      } catch (parseError) {
        error =
          parseError instanceof z.ZodError
            ? `${SKILLS_PATH} is invalid:\n${formatSkillIssues(parseError)}`
            : `${SKILLS_PATH} is not valid JSON.`;
      }
    }
  } catch (err) {
    error =
      err instanceof GitHubError
        ? err.message
        : "Couldn't reach GitHub. Check GITHUB_TOKEN and GITHUB_REPO.";
  }

  if (error) {
    return (
      <div className="border-danger/40 bg-danger/5 rounded-[--radius-card] border p-6">
        <p className="text-danger text-sm font-medium">Couldn&apos;t load skills</p>
        <pre className="text-muted mt-2 font-mono text-xs whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return <SkillsEditor initialCategories={categories} initialSha={sha} />;
}
