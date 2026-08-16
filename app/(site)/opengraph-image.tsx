import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: site.role,
    title: site.tagline,
  });
}
