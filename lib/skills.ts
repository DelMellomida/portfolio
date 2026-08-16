import { z } from "zod";

/**
 * Skill types, validation, and serialization.
 *
 * Deliberately free of `node:fs` so this module is safe to import from Client
 * Components (the terminal needs the level labels and types). Filesystem
 * reading lives in lib/skills-server.ts.
 *
 * Skills live in content/skills.json rather than a TypeScript module so the
 * admin can edit them and commit the result through the GitHub API, the same
 * way blog posts work. A .ts file could not be written safely from a route
 * handler and would need a code change to update.
 */
export const SKILLS_PATH = "content/skills.json";

export const skillLevels = ["experienced", "proficient", "familiar"] as const;
export type SkillLevel = (typeof skillLevels)[number];

export const skillLevelLabel: Record<SkillLevel, string> = {
  experienced: "Experienced",
  proficient: "Proficient",
  familiar: "Familiar",
};

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required").max(60),
  level: z.enum(skillLevels),
  note: z.string().trim().max(120).optional(),
});

export const skillCategorySchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Category id is required")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  label: z.string().trim().min(1, "Label is required").max(60),
  description: z.string().trim().min(1, "Description is required").max(160),
  skills: z.array(skillSchema).min(1, "A category needs at least one skill"),
});

export const skillsFileSchema = z
  .array(skillCategorySchema)
  .min(1, "At least one category is required")
  .superRefine((categories, ctx) => {
    // Category ids drive the terminal's `skills <id>` command and the anchors
    // on /skills, so a duplicate would make one of them unreachable.
    const seen = new Set<string>();
    categories.forEach((category, index) => {
      if (seen.has(category.id)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `Duplicate category id "${category.id}"`,
        });
      }
      seen.add(category.id);
    });
  });

export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;

/**
 * Parse and validate raw JSON text. Shared by the build and the admin API.
 *
 * Strips a leading BOM first: several Windows editors (and PowerShell's
 * `Set-Content -Encoding utf8`) prepend one, and JSON.parse rejects it with a
 * confusing "Unexpected token" that points at character zero.
 */
export function parseSkills(raw: string): SkillCategory[] {
  const json: unknown = JSON.parse(raw.replace(/^﻿/, ""));
  return skillsFileSchema.parse(json);
}

export function serializeSkills(categories: SkillCategory[]): string {
  return `${JSON.stringify(categories, null, 2)}\n`;
}

/** Turns a ZodError into a readable, multi-line message. */
export function formatSkillIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}
