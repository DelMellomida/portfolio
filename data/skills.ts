import type { SkillCategory } from "@/lib/types";

/**
 * Extracted from the old inline array in src/pages/Skills.js.
 * Categories are explicit now — the old version relied on two parallel arrays
 * staying in index order, which silently broke whenever one was edited.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "ai",
    label: "AI & LLM Systems",
    description: "Agent orchestration, retrieval pipelines, and model integration.",
    skills: [
      { name: "OpenAI API", level: "experienced" },
      { name: "Anthropic API", level: "experienced" },
      { name: "Gemini API", level: "experienced" },
      { name: "Agent Orchestration", level: "experienced" },
      { name: "RAG Pipelines", level: "experienced" },
      { name: "MCP", level: "experienced", note: "Model Context Protocol servers and clients" },
      { name: "LangChain", level: "proficient" },
      { name: "LangGraph", level: "proficient" },
      { name: "Ollama", level: "proficient", note: "Local model routing" },
    ],
  },
  {
    id: "languages",
    label: "Languages & Frameworks",
    description: "What I build with day to day.",
    skills: [
      { name: "Python", level: "experienced" },
      { name: "FastAPI", level: "experienced" },
      { name: "Node.js", level: "experienced" },
      { name: "React", level: "experienced" },
      { name: "Tailwind CSS", level: "experienced" },
      { name: "TypeScript", level: "proficient" },
      { name: "Next.js", level: "proficient" },
      { name: "C# / .NET", level: "proficient" },
      { name: "PHP / Laravel", level: "proficient" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Observability",
    description: "Deploying, instrumenting, and keeping systems visible in production.",
    skills: [
      { name: "OpenTelemetry", level: "experienced" },
      { name: "Grafana Cloud", level: "experienced" },
      { name: "Docker", level: "proficient" },
      { name: "AWS", level: "proficient" },
      { name: "GCP", level: "proficient" },
      { name: "CI/CD", level: "proficient" },
      { name: "Azure", level: "familiar" },
    ],
  },
  {
    id: "data",
    label: "Databases & Storage",
    description: "Relational, document, and vector stores.",
    skills: [
      { name: "MongoDB", level: "experienced" },
      { name: "ChromaDB", level: "experienced", note: "Vector store for RAG" },
      { name: "PostgreSQL", level: "proficient" },
      { name: "MySQL", level: "proficient" },
      { name: "Supabase", level: "proficient" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering & Systems",
    description: "The practices around the code.",
    skills: [
      { name: "REST API Design", level: "experienced" },
      { name: "Git", level: "experienced" },
      { name: "System Design", level: "proficient" },
      { name: "Active Directory", level: "proficient" },
      { name: "System Administration", level: "proficient" },
    ],
  },
];

export const skillLevelLabel: Record<string, string> = {
  experienced: "Experienced",
  proficient: "Proficient",
  familiar: "Familiar",
};

/** Flat list, used by the terminal's tab-completion and the /work tag filter. */
export const allSkillNames = skillCategories.flatMap((c) => c.skills.map((s) => s.name));

export function getSkillCategory(id: string): SkillCategory | undefined {
  return skillCategories.find((c) => c.id === id);
}
