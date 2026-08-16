"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { useIsClient } from "@/lib/hooks";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The server can't know the visitor's theme, so the icon is deferred until
  // hydration. The button itself renders immediately, so the header never shifts.
  const isClient = useIsClient();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isClient ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      className="text-muted hover:text-text hover:bg-surface-hover inline-flex size-9 items-center justify-center rounded-md transition-colors"
    >
      {isClient ? (
        isDark ? (
          <SunIcon className="size-[18px]" />
        ) : (
          <MoonIcon className="size-[18px]" />
        )
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  );
}
