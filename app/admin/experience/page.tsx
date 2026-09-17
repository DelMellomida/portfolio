import { z } from "zod";
import { GitHubError, getRemoteFile } from "@/lib/github";
import { EXPERIENCE_PATH, formatExperienceIssues, parseExperience } from "@/lib/experience";
import { ExperienceEditor } from "@/components/admin/experience-editor";
import type { ExperienceEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  let entries: ExperienceEntry[] = [];
  let sha: string | null = null;
  let error: string | null = null;

  try {
    const file = await getRemoteFile(EXPERIENCE_PATH);
    if (file) {
      sha = file.sha;
      try {
        entries = parseExperience(file.content);
      } catch (parseError) {
        error =
          parseError instanceof z.ZodError
            ? `${EXPERIENCE_PATH} is invalid:\n${formatExperienceIssues(parseError)}`
            : `${EXPERIENCE_PATH} is not valid JSON.`;
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
        <p className="text-danger text-sm font-medium">Couldn&apos;t load experience</p>
        <pre className="text-muted mt-2 font-mono text-xs whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return <ExperienceEditor initialEntries={entries} initialSha={sha} />;
}
