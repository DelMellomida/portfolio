import { z } from "zod";
import type { ExperienceEntry } from "@/lib/types";

export const EXPERIENCE_PATH = "content/experience.json";

export const experienceEntrySchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(100),
  role: z.string().trim().min(1, "Role is required").max(120),
  period: z.string().trim().min(1, "Period is required").max(80),
  location: z.string().trim().min(1, "Location is required").max(100),
  highlights: z
    .array(z.string().trim().min(1, "Highlight cannot be blank").max(300))
    .min(1, "Add at least one highlight"),
  tech: z
    .array(z.string().trim().min(1, "Tech item cannot be blank").max(60))
    .min(1, "Add at least one tech item"),
  current: z.boolean().optional(),
  image: z.string().trim().max(160).optional(),
}) satisfies z.ZodType<ExperienceEntry>;

export const experienceFileSchema = z.array(experienceEntrySchema).min(1, "Add at least one role");

export function parseExperience(raw: string): ExperienceEntry[] {
  const json: unknown = JSON.parse(raw.replace(/^\uFEFF/, ""));
  return experienceFileSchema.parse(json);
}

export function serializeExperience(entries: ExperienceEntry[]): string {
  return `${JSON.stringify(entries, null, 2)}\n`;
}

export function formatExperienceIssues(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}
