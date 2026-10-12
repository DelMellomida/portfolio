import { getAllPosts, getAllProjects } from "@/lib/content";
import { site, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const projects = getAllProjects()
    .map((project) => `- ${project.title}: ${siteUrl}/work/${project.slug}`)
    .join("\n");
  const posts = getAllPosts()
    .map((post) => `- ${post.title}: ${siteUrl}/blog/${post.slug}`)
    .join("\n");

  const body = `# ${site.name}

${site.description}

## Profile

- Site: ${siteUrl}
- About: ${siteUrl}/about
- Work: ${siteUrl}/work
- Skills: ${siteUrl}/skills
- Contact: ${siteUrl}/contact
- GitHub: https://github.com/${site.githubUsername}

## Selected Work

${projects}

## Writing

${posts || "- No public posts yet."}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
