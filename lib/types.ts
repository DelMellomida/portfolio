export type SkillLevel = "experienced" | "proficient" | "familiar";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** Optional one-line note surfaced in the terminal's `skills` output. */
  note?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  skills: Skill[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  tech: string[];
  current?: boolean;
  image?: string;
}

export interface EducationEntry {
  institution: string;
  credential: string;
  period: string;
  detail?: string;
}

export interface Certification {
  issuer: string;
  items: string[];
}

/** Frontmatter for content/work/*.mdx — validated at build time in lib/content.ts. */
export interface Project {
  slug: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  tech: string[];
  featured: boolean;
  order: number;
  image?: string;
  links?: {
    repo?: string;
    demo?: string;
  };
}

/** Frontmatter for content/blog/*.mdx. */
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingTime: string;
}

export type WithContent<T> = T & { content: string };
