import type { Metadata } from "next";
import { primarySocials, site, siteUrl, socials } from "./site";

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} - ${site.role}`,
};

export function absoluteUrl(path = "") {
  if (!path) return siteUrl;
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: site.locale,
      siteName: site.name,
      title,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function personJsonLd(knowsAbout: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: site.name,
    url: siteUrl,
    image: absoluteUrl("/images/me.jpg"),
    jobTitle: site.role,
    email: site.email,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
      addressCountry: "PH",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Pamantasan ng Lungsod ng Pasig",
    },
    worksFor: [
      { "@type": "Organization", name: "Ellinov Technologies" },
      { "@type": "Organization", name: "DEVCON Philippines" },
    ],
    knowsAbout,
    sameAs: socials.filter((s) => s.key !== "email").map((s) => s.href),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${site.name} Portfolio`,
    url: siteUrl,
    description: site.description,
    publisher: { "@id": `${siteUrl}/#person` },
    inLanguage: "en",
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    url: siteUrl,
    name: `${site.name} - ${site.role}`,
    about: { "@id": `${siteUrl}/#person` },
    mainEntity: { "@id": `${siteUrl}/#person` },
    sameAs: primarySocials.filter((s) => s.key !== "email").map((s) => s.href),
  };
}
