import rawExperience from "@/content/experience.json";
import { experienceFileSchema } from "@/lib/experience";

/** Ordered newest-first and edited from /admin/experience. */
export const experience = experienceFileSchema.parse(rawExperience);
