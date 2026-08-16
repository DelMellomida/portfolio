import matter from "gray-matter";
import { z } from "zod";

/** What the admin editor submits. Mirrors the blog frontmatter schema. */
export const postDraftSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1, "Title is required").max(140),
  description: z.string().trim().min(1, "Description is required").max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  tags: z.array(z.string().trim().min(1)).max(8).default([]),
  draft: z.boolean().default(true),
  body: z.string().min(1, "Body cannot be empty"),
});

export type PostDraft = z.infer<typeof postDraftSchema>;

/** Quote a scalar for YAML, escaping anything that would break the document. */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Builds the .mdx file body. Every scalar is quoted — an unquoted `2026` would
 * be parsed by YAML as a number and fail the build-time frontmatter check.
 */
export function serializePost(draft: PostDraft): string {
  const tags =
    draft.tags.length === 0 ? "[]" : `[${draft.tags.map((t) => yamlString(t)).join(", ")}]`;

  return [
    "---",
    `title: ${yamlString(draft.title)}`,
    `description: ${yamlString(draft.description)}`,
    `date: ${yamlString(draft.date)}`,
    `tags: ${tags}`,
    `draft: ${draft.draft}`,
    "---",
    "",
    draft.body.trim(),
    "",
  ].join("\n");
}

export interface ParsedPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  body: string;
}

/** Reads an existing .mdx file back into editor fields. */
export function parsePost(raw: string): ParsedPost {
  const { data, content } = matter(raw);

  return {
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    body: content.trim(),
  };
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
