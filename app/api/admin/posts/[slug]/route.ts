import { NextResponse } from "next/server";
import { GitHubError, deleteRemotePost, getRemotePost, writeRemotePost } from "@/lib/github";
import { parsePost, postDraftSchema, serializePost } from "@/lib/post-file";

type Params = Promise<{ slug: string }>;

function handleError(error: unknown) {
  if (error instanceof GitHubError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Admin post route failed:", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const file = await getRemotePost(slug);
    if (!file) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    return NextResponse.json({ slug, sha: file.sha, ...parsePost(file.content) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;

    const parsed = postDraftSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Check the form and try again.", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const draft = parsed.data;

    const current = await getRemotePost(slug);
    if (!current) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    // Renaming means writing the new file and removing the old one, since the
    // Contents API has no move operation.
    if (draft.slug !== slug) {
      const clash = await getRemotePost(draft.slug);
      if (clash) {
        return NextResponse.json(
          { error: `A post with the slug "${draft.slug}" already exists.` },
          { status: 409 },
        );
      }

      await writeRemotePost({
        slug: draft.slug,
        content: serializePost(draft),
        message: `content: rename post "${slug}" to "${draft.slug}"`,
      });
      await deleteRemotePost({
        slug,
        sha: current.sha,
        message: `content: remove old file after renaming to "${draft.slug}"`,
      });

      return NextResponse.json({ ok: true, slug: draft.slug, renamedFrom: slug });
    }

    const result = await writeRemotePost({
      slug,
      content: serializePost(draft),
      // The sha pins the update to the version we loaded — GitHub rejects the
      // write if the file changed underneath us.
      sha: current.sha,
      message: `content: update post "${draft.title}"`,
    });

    return NextResponse.json({ ok: true, slug, commit: result.commit.html_url });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;

    const current = await getRemotePost(slug);
    if (!current) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    await deleteRemotePost({
      slug,
      sha: current.sha,
      message: `content: delete post "${slug}"`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
