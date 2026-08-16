"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin", label: "Posts" },
  { href: "/admin/skills", label: "Skills" },
];

function isActive(pathname: string, href: string) {
  // /admin would otherwise match /admin/skills too.
  return href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/edit") || pathname.startsWith("/admin/new") : pathname.startsWith(href);
}

export function AdminTabs() {
  const pathname = usePathname();

  // The login screen has nothing to navigate between.
  if (pathname === "/admin/login") return null;

  return (
    <nav aria-label="Admin sections" className="flex gap-1">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={isActive(pathname, tab.href) ? "page" : undefined}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-sm transition-colors",
            isActive(pathname, tab.href)
              ? "bg-surface-hover text-text font-medium"
              : "text-muted hover:text-text hover:bg-surface-hover",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
