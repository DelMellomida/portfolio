"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navItems, site } from "@/lib/site";
import { useIsClient } from "@/lib/hooks";
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-200",
        scrolled ? "border-border bg-bg/85 border-b backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-5 sm:px-6"
      >
        <Link
          href="/"
          className="shrink-0 font-mono text-sm font-medium tracking-tight transition-opacity hover:opacity-70"
        >
          <span className="text-accent">~/</span>
          {site.shortName.toLowerCase()}
        </Link>

        <div className="flex items-center gap-1">
          {/* Six links need room; below lg the drawer takes over. */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "hover:bg-surface-hover rounded-md px-2.5 py-2 text-sm transition-colors",
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

          <div className="bg-border mx-2 hidden h-5 w-px lg:block" />

          <ThemeToggle />

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
            className="text-muted hover:text-text hover:bg-surface-hover inline-flex size-9 items-center justify-center rounded-md transition-colors lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </nav>

      {open && <MobileDrawer pathname={pathname} onClose={close} />}
    </header>
  );
}

/**
 * Rendered through a portal into <body>.
 *
 * It cannot live inside <header>: once scrolled, the header gets
 * `backdrop-blur-md`, and a backdrop-filter establishes a containing block for
 * fixed-position descendants — so `fixed inset-0` would resolve against the
 * 64px header instead of the viewport, leaving the overlay covering only a
 * thin strip at the top of the screen.
 */
function MobileDrawer({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
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

    // Lock scroll without the page jumping as the scrollbar disappears.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.paddingRight;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (!isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Opaque enough that page content never reads through the menu. */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="bg-surface border-border absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col border-l shadow-2xl"
      >
        <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-5">
          <span className="font-mono text-sm font-medium">
            <span className="text-accent">~/</span>
            {site.shortName.toLowerCase()}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-muted hover:text-text hover:bg-surface-hover -mr-2 inline-flex size-9 items-center justify-center rounded-md transition-colors"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-3 text-base transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-accent-subtle text-text font-medium"
                    : "text-muted hover:bg-surface-hover hover:text-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {site.availability.open && (
          <p className="text-muted border-border flex shrink-0 items-center gap-2 border-t px-5 py-4 font-mono text-xs">
            <span className="bg-success size-1.5 shrink-0 rounded-full" aria-hidden="true" />
            {site.availability.label}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
