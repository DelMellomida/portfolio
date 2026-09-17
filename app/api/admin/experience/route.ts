import { NextResponse } from "next/server";
import { z } from "zod";
import { GitHubError, getRemoteFile, writeRemoteFile } from "@/lib/github";
import {
  EXPERIENCE_PATH,
  experienceFileSchema,
  formatExperienceIssues,
  parseExperience,
  serializeExperience,
} from "@/lib/experience";

function handleError(error: unknown) {
  if (error instanceof GitHubError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Admin experience route failed:", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export async function GET() {
  try {
    const file = await getRemoteFile(EXPERIENCE_PATH);
    if (!file) {
      return NextResponse.json({ entries: [], sha: null });
    }

    try {
      return NextResponse.json({ entries: parseExperience(file.content), sha: file.sha });
    } catch (error) {
      const message =
        error instanceof z.ZodError
          ? `${EXPERIENCE_PATH} is invalid:\n${formatExperienceIssues(error)}`
          : `${EXPERIENCE_PATH} is not valid JSON.`;
      return NextResponse.json({ error: message }, { status: 422 });
    }
  } catch (error) {
    return handleError(error);
  }
}

const putSchema = z.object({
  entries: experienceFileSchema,
  sha: z.string().nullable().optional(),
});

export async function PUT(req: Request) {
  try {
    const parsed = putSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Check the form and try again.",
          detail: formatExperienceIssues(parsed.error),
        },
        { status: 400 },
      );
    }

    const { entries, sha } = parsed.data;
    const result = await writeRemoteFile({
      path: EXPERIENCE_PATH,
      content: serializeExperience(entries),
      message: `content: update experience (${entries.length} roles)`,
      ...(sha ? { sha } : {}),
    });

    return NextResponse.json({ ok: true, commit: result.commit.html_url });
  } catch (error) {
    return handleError(error);
  }
}
