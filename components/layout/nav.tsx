"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drawer behaviour the old build was missing entirely: Escape to close,
  // scroll lock, focus moved into the panel, and focus returned on close.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-200",
        scrolled
          ? "border-border bg-bg/80 border-b backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-6"
      >
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight transition-opacity hover:opacity-70"
        >
          <span className="text-accent">~/</span>
          {site.shortName.toLowerCase()}
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "hover:bg-surface-hover rounded-md px-3 py-2 text-sm transition-colors",
                    isActive(pathname, item.href)
                      ? "text-text font-medium"
                      : "text-muted hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="bg-border mx-2 hidden h-5 w-px md:block" />

          <ThemeToggle />

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="text-muted hover:text-text hover:bg-surface-hover inline-flex size-9 items-center justify-center rounded-md transition-colors md:hidden"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </nav>

      {/*
        Rendered only while open. The old build kept the drawer mounted and
        translated off-screen, leaving its links in the tab order permanently.
      */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="bg-surface border-border absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l p-5 shadow-2xl"
          >
            <div className="flex h-6 items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close menu"
                className="text-muted hover:text-text hover:bg-surface-hover -mr-2 inline-flex size-9 items-center justify-center rounded-md transition-colors"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <ul className="mt-6 flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    // Closed here rather than in an effect on pathname — the
                    // click is the actual trigger, so no extra render pass.
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "hover:bg-surface-hover block rounded-md px-3 py-3 text-base transition-colors",
                      isActive(pathname, item.href)
                        ? "text-text font-medium"
                        : "text-muted hover:text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {site.availability.open && (
              <p className="text-muted border-border mt-auto flex items-center gap-2 border-t pt-5 font-mono text-xs">
                <span className="bg-success size-1.5 rounded-full" aria-hidden="true" />
                {site.availability.label}
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
