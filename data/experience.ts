import type { ExperienceEntry } from "@/lib/types";

/** Ported from the old src/data/experience.js, now typed and ordered newest-first. */
export const experience: ExperienceEntry[] = [
  {
    company: "Ellinov Technologies",
    role: "Software Engineer (Part-Time / Contractor)",
    period: "November 2025 – Present",
    location: "Taguig City",
    current: true,
    highlights: [
      "Engineered a production-grade Solution Architect Agent in pure Python (OpenAI SDK, ChromaDB RAG, MCP server) that automated feature request → architecture design; adopted as the company's internal agent framework standard.",
      "Designed a language-agnostic observability system with OpenTelemetry, the OTel Collector, and Grafana Cloud spanning Python, .NET, and React services.",
      "Authored backend and observability standards adopted as the engineering baseline across all active company projects.",
    ],
    tech: [
      "Python",
      "OpenAI SDK",
      "ChromaDB",
      "MCP",
      "OpenTelemetry",
      "Grafana Cloud",
      ".NET",
      "React",
    ],
  },
  {
    company: "Ellinov Technologies",
    role: "Software Engineer Intern",
    period: "July – November 2025",
    location: "Taguig City",
    highlights: [
      "Built AI-powered automation tools — a resume screening system and a purchase order extractor — using FastAPI and the Gemini API, deployed for internal and client use.",
      "Collaborated to standardize partner portal architecture across multiple client integrations.",
    ],
    tech: ["FastAPI", "Gemini API", "Python"],
  },
  {
    company: "Radius",
    role: "IT End User Support Intern",
    period: "November 2024 – July 2025",
    location: "RBC Ortigas, Pasig City",
    highlights: [
      "Resolved enterprise device and account issues via ServiceNow.",
      "Managed system administration and Active Directory workflows.",
    ],
    tech: ["ServiceNow", "Active Directory", "System Administration"],
    image: "/images/radius-office.jpg",
  },
];

export const currentRole = experience.find((e) => e.current);
