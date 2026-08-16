import { NextResponse } from "next/server";
import { z } from "zod";
import { GitHubError, getRemoteFile, writeRemoteFile } from "@/lib/github";
import {
  SKILLS_PATH,
  formatSkillIssues,
  serializeSkills,
  skillsFileSchema,
  parseSkills,
} from "@/lib/skills";

function handleError(error: unknown) {
  if (error instanceof GitHubError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Admin skills route failed:", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

/** Current skills, read from the repo so the admin reflects live state. */
export async function GET() {
  try {
    const file = await getRemoteFile(SKILLS_PATH);
    if (!file) {
      return NextResponse.json({ categories: [], sha: null });
    }

    try {
      return NextResponse.json({ categories: parseSkills(file.content), sha: file.sha });
    } catch (error) {
      // The committed file is malformed. Surface that rather than showing an
      // empty editor that would overwrite it on the next save.
      const message =
        error instanceof z.ZodError
          ? `${SKILLS_PATH} is invalid:\n${formatSkillIssues(error)}`
          : `${SKILLS_PATH} is not valid JSON.`;
      return NextResponse.json({ error: message }, { status: 422 });
    }
  } catch (error) {
    return handleError(error);
  }
}

const putSchema = z.object({
  categories: skillsFileSchema,
  /** Blob SHA the client loaded; omitted when creating the file. */
  sha: z.string().nullable().optional(),
});

export async function PUT(req: Request) {
  try {
    const parsed = putSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Check the form and try again.",
          detail: formatSkillIssues(parsed.error),
        },
        { status: 400 },
      );
    }

    const { categories, sha } = parsed.data;

    const result = await writeRemoteFile({
      path: SKILLS_PATH,
      content: serializeSkills(categories),
      message: `content: update skills (${categories.length} categories, ${categories.reduce(
        (n, c) => n + c.skills.length,
        0,
      )} skills)`,
      ...(sha ? { sha } : {}),
    });

    return NextResponse.json({ ok: true, commit: result.commit.html_url });
  } catch (error) {
    return handleError(error);
  }
}
