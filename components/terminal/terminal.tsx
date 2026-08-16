"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  complete,
  findCommand,
  type CommandContext,
  type PostSummary,
  type ProjectSummary,
  type TerminalLine,
} from "@/lib/terminal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Sudoku } from "@/components/playground/sudoku";

const PROMPT = "jhondel@dev:~$";

const BOOT: TerminalLine[] = [
  { type: "muted", value: `${site.name} — interactive shell` },
  { type: "muted", value: "Type `help` for commands. Tab completes, ↑/↓ recalls history." },
  { type: "text", value: "" },
];

export function Terminal({
  posts,
  projects,
  className,
  autoFocus = false,
}: {
  posts: PostSummary[];
  projects: ProjectSummary[];
  className?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [lines, setLines] = useState<TerminalLine[]>(BOOT);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Built on demand rather than held in a ref, so nothing is written during render.
  const makeCtx = useCallback(
    (): CommandContext => ({
      navigate: (href) => router.push(href),
      setTheme,
      clear: () => setLines([]),
      posts,
      projects,
    }),
    [router, setTheme, posts, projects],
  );

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const next: TerminalLine[] = [{ type: "input", value: trimmed }];

      if (trimmed) {
        const [name, ...args] = trimmed.split(/\s+/);
        const cmd = findCommand(name ?? "");

        setHistory((h) => [...h, trimmed]);

        // `clear` wipes the buffer including its own echoed input, as a real
        // shell does — so it short-circuits before anything is appended.
        if (cmd?.name === "clear") {
          setLines([]);
          setInput("");
          setHistoryIndex(null);
          return;
        }

        if (!cmd) {
          next.push({ type: "error", value: `command not found: ${name}` });
          next.push({ type: "muted", value: "try `help`" });
        } else {
          const output = cmd.run(args, makeCtx());
          if (output) next.push(...output);
        }
      }

      setLines((prev) => [...prev, ...next]);
      setInput("");
      setHistoryIndex(null);
    },
    [makeCtx],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const { value, options } = complete(input, makeCtx());
      setInput(value);
      if (options.length > 1) {
        setLines((prev) => [
          ...prev,
          { type: "input", value: input },
          { type: "muted", value: options.join("   ") },
        ]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? "");
      }
      return;
    }

    // Ctrl+L clears, Ctrl+C abandons the current line — as in a real shell.
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setLines((prev) => [...prev, { type: "input", value: `${input}^C` }]);
      setInput("");
    }
  };

  return (
    <div
      className={cn(
        "bg-terminal-bg border-border-strong overflow-hidden rounded-lg border shadow-xl",
        className,
      )}
      onClick={(e) => {
        // Don't steal focus when the user is interacting with output (links, sudoku).
        if ((e.target as HTMLElement).closest("a, input, button")) return;
        inputRef.current?.focus();
      }}
    >
      {/* Title bar */}
      <div className="border-border-strong/60 flex items-center gap-2 border-b bg-black/20 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="text-terminal-fg/60 flex-1 text-center font-mono text-xs">
          jhondel — shell
        </span>
      </div>

      <div
        ref={scrollRef}
        className="text-terminal-fg h-[26rem] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((line, i) => (
            <Line key={i} line={line} />
          ))}
        </div>

        <label className="flex items-center gap-2">
          <span className="sr-only">Terminal input</span>
          <span aria-hidden="true" className="shrink-0 text-[var(--accent)]">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-describedby="terminal-hint"
            className="text-terminal-fg min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
        <p id="terminal-hint" className="sr-only">
          Type a command and press Enter. Press Tab to complete, Up and Down arrows for history.
        </p>
      </div>
    </div>
  );
}

function Line({ line }: { line: TerminalLine }) {
  switch (line.type) {
    case "input":
      return (
        <p className="break-all">
          <span className="text-[var(--accent)]">{PROMPT}</span> {line.value}
        </p>
      );
    case "muted":
      return <p className="text-terminal-fg/55 break-words">{line.value || " "}</p>;
    case "error":
      return <p className="text-[var(--danger)] break-words">{line.value}</p>;
    case "heading":
      return <p className="mt-2 font-semibold text-[var(--accent)]">{line.value}</p>;
    case "kv":
      return (
        <p className="break-words">
          <span className="text-terminal-fg inline-block w-44 align-top">{line.key}</span>
          <span className="text-terminal-fg/55">{line.value}</span>
        </p>
      );
    case "link":
      return line.external ? (
        <a
          href={line.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-fg block break-all underline decoration-dotted underline-offset-4 hover:text-[var(--accent)]"
        >
          {line.label}
        </a>
      ) : (
        <Link
          href={line.href}
          className="text-terminal-fg block break-all underline decoration-dotted underline-offset-4 hover:text-[var(--accent)]"
        >
          {line.label}
        </Link>
      );
    case "widget":
      return (
        <div className="my-3">
          <Sudoku compact />
        </div>
      );
    case "text":
      // Empty strings are deliberate spacers; keep the line height.
      return <p className="break-words whitespace-pre-wrap">{line.value || " "}</p>;
    default:
      return <p>{" "}</p>;
  }
}
