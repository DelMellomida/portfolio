/**
 * Single source of truth for site-wide identity and URLs.
 * Set NEXT_PUBLIC_SITE_URL in Vercel to the production domain — it drives
 * canonical URLs, OG image resolution, the sitemap, and the RSS feed.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://delmellomida.vercel.app"
).replace(/\/$/, "");

export const site = {
  name: "Jhondel Mellomida",
  shortName: "Jhondel",
  role: "Software Engineer",
  tagline: "Software engineer building AI systems that ship.",
  description:
    "Software engineer specializing in AI agent systems, backend architecture, and observability. I build production systems in Python, TypeScript, and .NET — and write about how they work.",
  locale: "en_PH",
  url: siteUrl,
  email: "delmellomida@gmail.com",
  location: "Metro Manila, Philippines",
  /** Drives the availability indicator in the nav and the contact page. */
  availability: {
    open: true,
    label: "Open to opportunities",
    detail: "Available for AI/ML and full-stack roles, plus freelance collaborations.",
  },
} as const;

export type SocialKey = "github" | "linkedin" | "email" | "instagram" | "facebook";

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
  /** Primary links surface in the nav and hero; the rest live in the footer. */
  primary: boolean;
}

export const socials: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/DelMellomida",
    primary: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jhondel-mellomida-415b54318/",
    primary: true,
  },
  {
    key: "email",
    label: "Email",
    href: `mailto:${site.email}`,
    primary: true,
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/jhndlmllmd/",
    primary: false,
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/jhondel.jumuadmellomida/",
    primary: false,
  },
];

export const primarySocials = socials.filter((s) => s.primary);

export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Writing" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
