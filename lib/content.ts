import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import type { Post, Project, WithContent } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const projectSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1).max(300),
  tech: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  image: z.string().optional(),
  links: z
    .object({
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
    })
    .optional(),
});

const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

function readDir(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith(".mdx"));
}

function readFile(dir: string, file: string) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, dir, file), "utf8");
  return matter(raw);
}

/**
 * Frontmatter is validated here rather than at render time, so a typo fails
 * `next build` with the offending file named instead of shipping a broken page.
 */
function fail(file: string, error: z.ZodError): never {
  const details = error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid frontmatter in content/${file}:\n${details}`);
}

export function getAllProjects(): WithContent<Project>[] {
  return readDir("work")
    .map((file) => {
      const { data, content } = readFile("work", file);
      const parsed = projectSchema.safeParse(data);
      if (!parsed.success) fail(`work/${file}`, parsed.error);
      return {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ""),
        content,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): WithContent<Project> | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): WithContent<Project>[] {
  return getAllProjects().filter((p) => p.featured);
}

/** All unique tech tags across projects, for the /work filter. */
export function getProjectTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllProjects()) p.tech.forEach((t) => tags.add(t));
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getAllPosts({ includeDrafts = false } = {}): WithContent<Post>[] {
  return readDir("blog")
    .map((file) => {
      const { data, content } = readFile("blog", file);
      const parsed = postSchema.safeParse(data);
      if (!parsed.success) fail(`blog/${file}`, parsed.error);
      return {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ""),
        readingTime: readingTime(content).text,
        content,
      };
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string): WithContent<Post> | undefined {
  // Drafts are readable by direct URL in dev so you can preview before publishing.
  return getAllPosts({ includeDrafts: process.env.NODE_ENV === "development" }).find(
    (p) => p.slug === slug,
  );
}

export function getPostTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllPosts()) p.tags.forEach((t) => tags.add(t));
  return [...tags].sort((a, b) => a.localeCompare(b));
}
