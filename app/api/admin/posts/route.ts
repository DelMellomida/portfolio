import { NextResponse } from "next/server";
import { GitHubError, getRemotePost, listRemotePosts, writeRemotePost } from "@/lib/github";
import { postDraftSchema, serializePost } from "@/lib/post-file";

function handleError(error: unknown) {
  if (error instanceof GitHubError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Admin posts route failed:", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

/** List every post file currently in the repo. */
export async function GET() {
  try {
    return NextResponse.json({ posts: await listRemotePosts() });
  } catch (error) {
    return handleError(error);
  }
}

/** Create a new post. Refuses if the slug is already taken. */
export async function POST(req: Request) {
  try {
    const parsed = postDraftSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Check the form and try again.", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const draft = parsed.data;

    const existing = await getRemotePost(draft.slug);
    if (existing) {
      return NextResponse.json(
        { error: `A post with the slug "${draft.slug}" already exists.` },
        { status: 409 },
      );
    }

    const result = await writeRemotePost({
      slug: draft.slug,
      content: serializePost(draft),
      message: `content: add post "${draft.title}"`,
    });

    return NextResponse.json({ ok: true, slug: draft.slug, commit: result.commit.html_url });
  } catch (error) {
    return handleError(error);
  }
}
