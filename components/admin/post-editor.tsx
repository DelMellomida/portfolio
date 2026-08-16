"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/primitives";
import { slugFromTitle, todayIso } from "@/lib/post-file";
import { cn } from "@/lib/utils";

export interface EditorInitialValues {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  body: string;
}

type FieldErrors = Partial<Record<string, string[]>>;

const STARTER_BODY = `Open with the problem — what was actually hard, and why the obvious approach doesn't work.

## Approach

What you did, and the reasoning behind the choice.

\`\`\`ts
// Code fences get syntax highlighting in both themes.
const example = true;
\`\`\`

## What I'd do differently

The part that makes a post worth reading.
`;

export function PostEditor({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: EditorInitialValues;
}) {
  const router = useRouter();

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date || todayIso());
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [draft, setDraft] = useState(initial?.draft ?? true);
  const [body, setBody] = useState(initial?.body ?? STARTER_BODY);

  const [previewHtml, setPreviewHtml] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [dirty, setDirty] = useState(false);

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Debounced preview, rendered server-side with the real plugin pipeline.
  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        });
        const data = await res.json();
        setPreviewHtml(res.ok ? data.html : `<p>Preview error: ${data.error}</p>`);
      } catch {
        setPreviewHtml("<p>Preview unavailable.</p>");
      }
    }, 400);

    return () => clearTimeout(id);
  }, [body]);

  // Warn before losing unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const onTitleChange = (value: string) => {
    setTitle(value);
    setDirty(true);
    // Auto-derive the slug until the author edits it themselves. Never
    // auto-change it when editing — that would break the published URL.
    if (!slugTouched) setSlug(slugFromTitle(value));
  };

  /** Wrap or prefix the current selection with markdown syntax. */
  const applyFormat = (kind: "bold" | "italic" | "code" | "link" | "h2" | "list" | "quote") => {
    const el = bodyRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end);

    const wrap = (before: string, after = before, placeholder = "text") => {
      const inner = selected || placeholder;
      const next = body.slice(0, start) + before + inner + after + body.slice(end);
      setBody(next);
      setDirty(true);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + before.length, start + before.length + inner.length);
      });
    };

    const prefixLine = (prefix: string) => {
      const lineStart = body.lastIndexOf("\n", start - 1) + 1;
      const next = body.slice(0, lineStart) + prefix + body.slice(lineStart);
      setBody(next);
      setDirty(true);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, end + prefix.length);
      });
    };

    switch (kind) {
      case "bold":
        return wrap("**");
      case "italic":
        return wrap("*");
      case "code":
        return selected.includes("\n") ? wrap("```\n", "\n```", "code") : wrap("`", "`", "code");
      case "link":
        return wrap("[", "](https://)", "link text");
      case "h2":
        return prefixLine("## ");
      case "list":
        return prefixLine("- ");
      case "quote":
        return prefixLine("> ");
    }
  };

  const onBodyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      applyFormat("bold");
    } else if (key === "i") {
      e.preventDefault();
      applyFormat("italic");
    } else if (key === "k") {
      e.preventDefault();
      applyFormat("link");
    } else if (key === "s") {
      e.preventDefault();
      void save();
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const payload = { slug, title, description, date, tags, draft, body };
    const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initial!.slug}`;

    try {
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Save failed.");
        setFieldErrors(data.fields ?? {});
        setSaving(false);
        return;
      }

      setDirty(false);
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server.");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl">{mode === "create" ? "New post" : "Edit post"}</h1>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!draft}
              onChange={(e) => {
                setDraft(!e.target.checked);
                setDirty(true);
              }}
              className="accent-[var(--accent)]"
            />
            Published
          </label>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="border-danger/40 bg-danger/5 text-danger mb-6 rounded-md border px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {/* Frontmatter */}
      <div className="border-border bg-bg-subtle mb-6 grid gap-4 rounded-[--radius-card] border p-5 sm:grid-cols-2">
        <TextField
          label="Title"
          value={title}
          onChange={onTitleChange}
          error={fieldErrors.title?.[0]}
          className="sm:col-span-2"
        />

        <TextField
          label="Slug"
          value={slug}
          onChange={(v) => {
            setSlug(v);
            setSlugTouched(true);
            setDirty(true);
          }}
          hint={`/blog/${slug || "…"}`}
          error={fieldErrors.slug?.[0]}
          mono
        />

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(v) => {
            setDate(v);
            setDirty(true);
          }}
          error={fieldErrors.date?.[0]}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(v) => {
            setDescription(v);
            setDirty(true);
          }}
          hint={`${description.length}/300 — used as the meta description and OG subtitle`}
          error={fieldErrors.description?.[0]}
          className="sm:col-span-2"
        />

        <TextField
          label="Tags"
          value={tagsInput}
          onChange={(v) => {
            setTagsInput(v);
            setDirty(true);
          }}
          hint="Comma separated"
          error={fieldErrors.tags?.[0]}
          className="sm:col-span-2"
        />
      </div>

      {/* Toolbar */}
      <div className="border-border bg-surface flex flex-wrap items-center gap-1 rounded-t-[--radius-card] border border-b-0 px-3 py-2">
        <ToolbarButton onClick={() => applyFormat("bold")} label="Bold (Ctrl+B)">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat("italic")} label="Italic (Ctrl+I)">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat("h2")} label="Heading">
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat("link")} label="Link (Ctrl+K)">
          Link
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat("code")} label="Code">
          Code
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat("list")} label="Bullet list">
          List
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat("quote")} label="Quote">
          Quote
        </ToolbarButton>

        {/* Tab switcher — the panes sit side by side from `lg` up. */}
        <div className="ml-auto flex gap-1 lg:hidden">
          <ToolbarButton onClick={() => setTab("write")} label="Write" active={tab === "write"}>
            Write
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setTab("preview")}
            label="Preview"
            active={tab === "preview"}
          >
            Preview
          </ToolbarButton>
        </div>
      </div>

      <div className="border-border grid overflow-hidden rounded-b-[--radius-card] border lg:grid-cols-2">
        <div className={cn("lg:block", tab === "write" ? "block" : "hidden")}>
          <label htmlFor="body" className="sr-only">
            Post body (Markdown)
          </label>
          <textarea
            id="body"
            ref={bodyRef}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setDirty(true);
            }}
            onKeyDown={onBodyKeyDown}
            spellCheck
            className="bg-surface h-[36rem] w-full resize-none p-5 font-mono text-[13px] leading-relaxed outline-none"
          />
          {fieldErrors.body?.[0] && (
            <p className="text-danger px-5 pb-3 text-xs">{fieldErrors.body[0]}</p>
          )}
        </div>

        <div
          className={cn(
            "border-border bg-bg h-[36rem] overflow-y-auto p-5 lg:block lg:border-l",
            tab === "preview" ? "block" : "hidden",
          )}
        >
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>

      <p className="text-faint mt-3 text-xs">
        Saving commits <code className="font-mono">content/blog/{slug || "…"}.mdx</code> to the
        repo. Ctrl+S saves, Ctrl+B/I/K format.
      </p>
    </form>
  );
}

function ToolbarButton({
  onClick,
  label,
  active,
  children,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "hover:bg-surface-hover rounded px-2 py-1 font-mono text-xs transition-colors",
        active ? "bg-accent text-accent-fg" : "text-muted hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  hint,
  error,
  type = "text",
  mono,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  type?: string;
  mono?: boolean;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          "bg-surface w-full rounded-md border px-3 py-2 text-sm transition-colors",
          mono && "font-mono",
          error ? "border-danger" : "border-border focus:border-accent",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="text-danger mt-1 text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-faint mt-1 font-mono text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
