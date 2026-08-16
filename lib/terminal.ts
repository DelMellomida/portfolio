import { navItems, site, socials } from "./site";
import { shortBio, education, certifications } from "@/data/profile";
import { experience } from "@/data/experience";
// Type-only: lib/skills.ts reads the filesystem, so importing its runtime here
// would pull node:fs into the client bundle. Categories arrive via context.
import { skillLevelLabel, type SkillCategory } from "./skills";

export type TerminalLine =
  | { type: "input"; value: string }
  | { type: "text"; value: string }
  | { type: "muted"; value: string }
  | { type: "error"; value: string }
  | { type: "heading"; value: string }
  | { type: "kv"; key: string; value: string }
  | { type: "link"; label: string; href: string; external?: boolean }
  | { type: "widget"; id: "sudoku" };

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
}

export interface ProjectSummary {
  slug: string;
  title: string;
  period: string;
  tech: string[];
}

export interface CommandContext {
  navigate: (href: string) => void;
  setTheme: (theme: string) => void;
  clear: () => void;
  posts: PostSummary[];
  projects: ProjectSummary[];
  /** Passed in from the server so this module stays filesystem-free. */
  skills: SkillCategory[];
}

export interface Command {
  name: string;
  summary: string;
  usage?: string;
  hidden?: boolean;
  /** Values offered by Tab completion for the first argument. */
  completions?: (ctx: CommandContext) => string[];
  run: (args: string[], ctx: CommandContext) => TerminalLine[] | void;
}

const ROUTES = ["/", ...navItems.map((n) => n.href)];

function skillLines(all: SkillCategory[], categoryId?: string): TerminalLine[] {
  const categories = categoryId ? all.filter((c) => c.id === categoryId) : all;

  if (categories.length === 0) {
    return [
      { type: "error", value: `no such category: ${categoryId}` },
      {
        type: "muted",
        value: `available: ${all.map((c) => c.id).join(", ")}`,
      },
    ];
  }

  const lines: TerminalLine[] = [];
  for (const cat of categories) {
    lines.push({ type: "heading", value: cat.label });
    for (const skill of cat.skills) {
      lines.push({
        type: "kv",
        key: skill.name,
        value: skillLevelLabel[skill.level] ?? skill.level,
      });
    }
    lines.push({ type: "text", value: "" });
  }
  return lines;
}

export const commands: Command[] = [
  {
    name: "help",
    summary: "List available commands",
    run: () => {
      const lines: TerminalLine[] = [
        { type: "muted", value: "Available commands — Tab completes, ↑/↓ recalls history." },
        { type: "text", value: "" },
      ];
      for (const cmd of commands.filter((c) => !c.hidden)) {
        lines.push({ type: "kv", key: cmd.usage ?? cmd.name, value: cmd.summary });
      }
      return lines;
    },
  },
  {
    name: "whoami",
    summary: "Who I am, briefly",
    run: () => [
      { type: "heading", value: site.name },
      { type: "kv", key: "role", value: site.role },
      { type: "kv", key: "location", value: site.location },
      { type: "kv", key: "status", value: site.availability.label },
      { type: "text", value: "" },
      { type: "text", value: shortBio },
    ],
  },
  {
    name: "skills",
    summary: "List skills, optionally by category",
    usage: "skills [category]",
    completions: (ctx) => ctx.skills.map((c) => c.id),
    run: (args, ctx) => skillLines(ctx.skills, args[0]),
  },
  {
    name: "experience",
    summary: "Work history",
    run: () => {
      const lines: TerminalLine[] = [];
      for (const e of experience) {
        lines.push({ type: "heading", value: `${e.role} — ${e.company}` });
        lines.push({ type: "muted", value: `${e.period} · ${e.location}` });
        for (const h of e.highlights) lines.push({ type: "text", value: `  — ${h}` });
        lines.push({ type: "text", value: "" });
      }
      return lines;
    },
  },
  {
    name: "projects",
    summary: "List case studies",
    completions: (ctx) => ctx.projects.map((p) => p.slug),
    run: (args, ctx) => {
      if (args[0]) {
        const match = ctx.projects.find((p) => p.slug === args[0]);
        if (!match) return [{ type: "error", value: `no such project: ${args[0]}` }];
        ctx.navigate(`/work/${match.slug}`);
        return [{ type: "muted", value: `opening ${match.title}…` }];
      }
      const lines: TerminalLine[] = [];
      for (const p of ctx.projects) {
        lines.push({ type: "link", label: `${p.title}  (${p.period})`, href: `/work/${p.slug}` });
        lines.push({ type: "muted", value: `  ${p.tech.join(", ")}` });
      }
      lines.push({ type: "text", value: "" });
      lines.push({ type: "muted", value: "tip: `projects <slug>` opens one directly" });
      return lines;
    },
  },
  {
    name: "blog",
    summary: "List recent writing",
    completions: (ctx) => ctx.posts.map((p) => p.slug),
    run: (args, ctx) => {
      if (ctx.posts.length === 0) {
        return [{ type: "muted", value: "no posts published yet — check back soon" }];
      }
      if (args[0]) {
        const match = ctx.posts.find((p) => p.slug === args[0]);
        if (!match) return [{ type: "error", value: `no such post: ${args[0]}` }];
        ctx.navigate(`/blog/${match.slug}`);
        return [{ type: "muted", value: `opening ${match.title}…` }];
      }
      return ctx.posts.map((p) => ({
        type: "link" as const,
        label: `${p.date}  ${p.title}`,
        href: `/blog/${p.slug}`,
      }));
    },
  },
  {
    name: "education",
    summary: "Degrees and certifications",
    run: () => {
      const lines: TerminalLine[] = [{ type: "heading", value: "Education" }];
      for (const e of education) {
        lines.push({ type: "kv", key: e.credential, value: e.period });
        lines.push({ type: "muted", value: `  ${e.institution}` });
      }
      lines.push({ type: "text", value: "" });
      lines.push({ type: "heading", value: "Certifications" });
      for (const c of certifications) {
        for (const item of c.items) {
          lines.push({ type: "kv", key: item, value: c.issuer });
        }
      }
      return lines;
    },
  },
  {
    name: "contact",
    summary: "How to reach me",
    run: () => [
      { type: "heading", value: "Get in touch" },
      ...socials.map((s) => ({
        type: "link" as const,
        label: `${s.label.padEnd(10)} ${s.href.replace(/^mailto:/, "")}`,
        href: s.href,
        external: true,
      })),
      { type: "text", value: "" },
      { type: "link", label: "→ open the contact form", href: "/contact" },
    ],
  },
  {
    name: "resume",
    summary: "Open my résumé (PDF)",
    run: () => [
      { type: "muted", value: "opening resume.pdf…" },
      { type: "link", label: "/resume.pdf", href: "/resume.pdf", external: true },
    ],
  },
  {
    name: "open",
    summary: "Navigate to a page",
    usage: "open <route>",
    completions: () => ROUTES,
    run: (args, ctx) => {
      const target = args[0];
      if (!target) {
        return [{ type: "muted", value: `routes: ${ROUTES.join(" ")}` }];
      }
      const href = target.startsWith("/") ? target : `/${target}`;
      if (!ROUTES.includes(href)) {
        return [{ type: "error", value: `no such route: ${href}` }];
      }
      ctx.navigate(href);
      return [{ type: "muted", value: `navigating to ${href}…` }];
    },
  },
  {
    name: "theme",
    summary: "Switch theme",
    usage: "theme <dark|light|system>",
    completions: () => ["dark", "light", "system"],
    run: (args, ctx) => {
      const next = args[0];
      if (!next || !["dark", "light", "system"].includes(next)) {
        return [{ type: "error", value: "usage: theme <dark|light|system>" }];
      }
      ctx.setTheme(next);
      return [{ type: "muted", value: `theme set to ${next}` }];
    },
  },
  {
    name: "sudoku",
    summary: "Play a round of 4×4 sudoku",
    run: () => [
      { type: "muted", value: "loading sudoku…" },
      { type: "widget", id: "sudoku" },
    ],
  },
  {
    name: "clear",
    summary: "Clear the screen",
    run: (_args, ctx) => {
      ctx.clear();
    },
  },
  // --- easter eggs ---
  {
    name: "cat",
    summary: "cat",
    hidden: true,
    run: (args) => {
      if (args[0] && args[0] !== "cat") {
        return [{ type: "error", value: `cat: ${args[0]}: No such file or directory` }];
      }
      return [
        { type: "text", value: "  /\\_/\\  " },
        { type: "text", value: " ( o.o ) " },
        { type: "text", value: "  > ^ <  " },
        { type: "muted", value: "meow. (yes, I'm a cat person)" },
      ];
    },
  },
  {
    name: "sudo",
    summary: "sudo",
    hidden: true,
    run: () => [
      { type: "error", value: "Nice try." },
      { type: "muted", value: "jhondel is not in the sudoers file. This incident will be reported." },
    ],
  },
  {
    name: "echo",
    summary: "echo",
    hidden: true,
    run: (args) => [{ type: "text", value: args.join(" ") }],
  },
  {
    name: "ls",
    summary: "List pages",
    run: () =>
      ROUTES.map((href) => ({
        type: "link" as const,
        label: href === "/" ? "/ (home)" : href,
        href,
      })),
  },
];

export const commandNames = commands.map((c) => c.name);
export const visibleCommandNames = commands.filter((c) => !c.hidden).map((c) => c.name);

export function findCommand(name: string): Command | undefined {
  return commands.find((c) => c.name === name);
}

/** Longest common prefix of the candidates — standard shell Tab behaviour. */
export function commonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0]!;
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

export function complete(input: string, ctx: CommandContext): { value: string; options: string[] } {
  const parts = input.split(/\s+/);
  const isFirstWord = parts.length === 1;

  if (isFirstWord) {
    const matches = commandNames.filter((n) => n.startsWith(parts[0] ?? ""));
    if (matches.length === 0) return { value: input, options: [] };
    if (matches.length === 1) return { value: `${matches[0]} `, options: [] };
    return { value: commonPrefix(matches), options: matches };
  }

  const cmd = findCommand(parts[0] ?? "");
  if (!cmd?.completions) return { value: input, options: [] };

  const partial = parts[parts.length - 1] ?? "";
  const candidates = cmd.completions(ctx).filter((c) => c.startsWith(partial));
  if (candidates.length === 0) return { value: input, options: [] };

  const head = parts.slice(0, -1).join(" ");
  if (candidates.length === 1) return { value: `${head} ${candidates[0]}`, options: [] };
  return { value: `${head} ${commonPrefix(candidates)}`, options: candidates };
}
