import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { SKILLS_PATH, formatSkillIssues, parseSkills, type SkillCategory } from "./skills";

/**
 * Server-only skills reader. Kept apart from lib/skills.ts so that importing
 * skill types or level labels from a Client Component never pulls node:fs
 * into the browser bundle.
 */

let cached: SkillCategory[] | null = null;

/**
 * Reads skills from disk at build time. Invalid data throws, which fails
 * `next build` naming the problem rather than shipping a broken page.
 */
export function getSkillCategories(): SkillCategory[] {
  if (cached) return cached;

  const file = path.join(process.cwd(), SKILLS_PATH);
  try {
    cached = parseSkills(fs.readFileSync(file, "utf8"));
    return cached;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid ${SKILLS_PATH}:\n${formatSkillIssues(error)}`);
    }
    throw error;
  }
}

export function getSkillCategory(id: string): SkillCategory | undefined {
  return getSkillCategories().find((c) => c.id === id);
}

/** Flat list, handy for tab completion and structured data. */
export function getAllSkillNames(): string[] {
  return getSkillCategories().flatMap((c) => c.skills.map((s) => s.name));
}
