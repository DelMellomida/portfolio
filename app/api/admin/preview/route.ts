import { NextResponse } from "next/server";
import { z } from "zod";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const schema = z.object({ body: z.string().max(200_000) });

/**
 * Renders the editor body with the same remark/rehype plugins the published
 * post uses, so the preview matches what actually ships — including Shiki
 * highlighting in both themes.
 *
 * This is a markdown pipeline, not a full MDX one: custom JSX components in a
 * post won't render here. Standard markdown, GFM tables, and code fences do.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-dimmed" },
    keepBackground: false,
    defaultLang: "plaintext",
  })
  .use(rehypeStringify);

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preview request." }, { status: 400 });
  }

  try {
    const file = await processor.process(parsed.data.body);
    return NextResponse.json({ html: String(file) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not render preview.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
