# Portfolio — Jhondel Mellomida

Personal site and writing, built with Next.js App Router.

**Stack:** Next.js 16 · React 19 · TypeScript (strict) · Tailwind v4 · MDX · Resend · Vercel

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (fails on type errors *and* invalid MDX frontmatter) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier |

## Environment variables

There is no `.env` in the repo, and there shouldn't be. Copy [`.env.example`](.env.example) to **`.env.local`** for local development — it's gitignored. For production, set the same keys in **Vercel → your project → Settings → Environment Variables**, then redeploy.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical URLs, OG image resolution, sitemap, RSS. No trailing slash. |
| `RESEND_API_KEY` | For the contact form | Sends contact submissions. Without it the form returns 503 and tells visitors to email directly. |
| `CONTACT_FROM_EMAIL` | No | Sender address, e.g. `Portfolio <hello@yourdomain.com>`. Defaults to Resend's shared `onboarding@resend.dev`, which works but is more likely to land in spam. Requires a verified domain in Resend. |
| `ADMIN_PASSWORD` | For `/admin` | The admin login password. |
| `AUTH_SECRET` | For `/admin` | Signs the admin session cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `GITHUB_TOKEN` | For `/admin` | Fine-grained PAT scoped to this repo with **Contents: Read and write**. Lets the admin commit posts. |
| `GITHUB_REPO` | For `/admin` | `owner/repo`, e.g. `DelMellomida/portfolio`. |
| `GITHUB_BRANCH` | No | Branch the admin commits to. Defaults to `main`. |

## Admin (`/admin`)

A password-protected editor for blog posts at [`/admin`](http://localhost:3000/admin).

**How it works:** the admin reads and writes MDX files in `content/blog/` through the GitHub Contents API. Saving a post is a real commit, which triggers a Vercel rebuild — so changes appear on the live site after roughly a minute, and every edit keeps its git history.

- `middleware.ts` guards `/admin/*` and `/api/admin/*`. Unauthenticated page requests redirect to the login screen; API requests get a 401.
- The session is a signed, HTTP-only cookie with a 12-hour expiry and no server-side store. Signing uses Web Crypto so the same code runs on the Edge runtime.
- Login is rate-limited to 5 attempts per 10 minutes per IP.
- The editor previews with the **same** remark/rehype pipeline the published post uses, so Shiki highlighting and GFM tables render exactly as they will live.
- Updates are pinned to the file's blob SHA, so GitHub rejects a write if the file changed underneath you rather than silently overwriting.
- `/admin` is `noindex` and disallowed in `robots.txt`.

**Shortcuts:** `Ctrl/⌘+S` save · `Ctrl/⌘+B` bold · `Ctrl/⌘+I` italic · `Ctrl/⌘+K` link.

New posts default to `draft: true`, so nothing publishes until you tick **Published**.

## Adding content

### A blog post

Create `content/blog/my-post.mdx`:

```mdx
---
title: "Post title"
description: "One or two sentences — this is the meta description and the OG card subtitle."
date: "2026-03-01"        # must be quoted, YYYY-MM-DD
tags: ["AI Agents", "Python"]
draft: false              # true keeps it off /blog, the sitemap, and the feed
---

Body in MDX. Code fences get syntax highlighting in both themes.
```

Drafts are viewable at their direct URL in dev, and excluded everywhere in production.

### A case study

Create `content/work/my-project.mdx` with `title`, `role`, `period`, `summary`, `tech`, `featured`, `order`, and optional `image` / `links`. See the existing files for the shape.

**Quote anything that looks like a number.** `period: 2025` is parsed by YAML as a number and will fail the build — `period: "2025"` is correct.

Frontmatter is validated by zod in [`lib/content.ts`](lib/content.ts), so a mistake fails `next build` with the offending file named rather than shipping a broken page.

### Everything else

Non-MDX content is typed data, not JSX:

- `data/profile.ts` — bio, hero roles, education, certifications
- `data/experience.ts` — work history
- `data/skills.ts` — skill categories (also drives the terminal's `skills` command)
- `lib/site.ts` — name, socials, nav, availability status

## Notable pieces

- **`components/terminal/`** — a real shell on `/skills`: command parsing, Tab completion, `↑`/`↓` history, `Ctrl+L`, `Ctrl+C`. Commands live in [`lib/terminal.ts`](lib/terminal.ts); add one by appending to the `commands` array. `/skills` also server-renders the full skill inventory, so the terminal stays progressive enhancement.
- **`lib/sudoku.ts`** — 4×4 generator with a uniqueness guarantee, played at `/playground` or via `sudoku` in the terminal.
- **`lib/og.tsx`** — social cards generated at build time by `next/og`, one per post and case study.
- **`app/globals.css`** — every color is a CSS variable defined once per theme. Components reference `var(--text-muted)`, never a hardcoded Tailwind gray, which is what keeps the light/dark toggle to a single source of truth.

## Deployment

Deploys on Vercel from `main`. No `vercel.json` is needed — Next.js routing is handled natively, and `/projects` and `/experience` redirect to their new homes via `next.config.ts`.
