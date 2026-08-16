import type { Certification, EducationEntry } from "@/lib/types";

/** Rotated by the hero typing effect. Keep these short — they render on one line. */
export const heroRoles = [
  "Software Engineer",
  "AI Systems Builder",
  "Backend & Observability",
  "Full-Stack Developer",
];

/**
 * Bio, in paragraphs. Extracted from the old hardcoded JSX in src/pages/About.js
 * so it can be reused by /about, the terminal's `whoami`, and JSON-LD.
 */
export const bio = [
  "I'm a software engineer working across the full development lifecycle — backend systems, API design, cloud infrastructure, and observability. I've shipped production systems in Python, FastAPI, Node.js, C#/.NET, and React, including an agent framework that became my company's internal standard and a language-agnostic observability platform built on OpenTelemetry and Grafana Cloud.",
  "Most of my recent work sits at the intersection of AI and infrastructure: retrieval pipelines, agent orchestration, and the unglamorous plumbing that makes LLM systems reliable enough to put in front of real users.",
  "I'm currently a part-time Software Engineer at Ellinov Technologies while finishing my BS in Computer Science at Pamantasan ng Lungsod ng Pasig, graduating June 2026.",
];

/** Short version — used in the hero, meta descriptions, and the terminal. */
export const shortBio =
  "Software engineer building AI agent systems, backend services, and observability tooling. Currently at Ellinov Technologies.";

export const education: EducationEntry[] = [
  {
    institution: "Pamantasan ng Lungsod ng Pasig",
    credential: "BS Computer Science, Cum Laude",
    period: "Graduating June 2026",
    detail: "President's Lister and Dean's Lister across all recognized semesters.",
  },
  {
    institution: "Devcon Philippines",
    credential: "AI Engineering Track",
    period: "May 2026 – Present",
  },
];

export const certifications: Certification[] = [
  {
    issuer: "Anthropic",
    items: ["Model Context Protocol (MCP)", "Agent Skills", "AI Fluency: Framework & Foundations"],
  },
  {
    issuer: "Trainocate",
    items: ["GCP Infrastructure Fundamentals", "Introduction to AWS"],
  },
  {
    issuer: "Other",
    items: ["JavaScript Certification", "HTML Certification", "AWS Developer Learning Plan (in progress)"],
  },
];

/** Personal notes — kept for the `cat` terminal command and the About page. */
export const interests = ["singing", "cycling", "astronomy", "physics"];
