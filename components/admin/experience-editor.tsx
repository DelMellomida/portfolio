"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ExperienceEntry } from "@/lib/types";
import { Button } from "@/components/ui/primitives";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function emptyEntry(): ExperienceEntry {
  return {
    company: "",
    role: "",
    period: "",
    location: "",
    current: false,
    highlights: [""],
    tech: [""],
  };
}

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function csvToList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ExperienceEditor({
  initialEntries,
  initialSha,
}: {
  initialEntries: ExperienceEntry[];
  initialSha: string | null;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<ExperienceEntry[]>(initialEntries);
  const [sha, setSha] = useState(initialSha);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const update = (next: ExperienceEntry[]) => {
    setEntries(next);
    setDirty(true);
    setSaved(false);
  };

  const patchEntry = (index: number, patch: Partial<ExperienceEntry>) =>
    update(entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, sha }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail ? `${data.error}\n${data.detail}` : (data.error ?? "Save failed."));
        setSaving(false);
        return;
      }

      setDirty(false);
      setSaved(true);
      setSaving(false);
      router.refresh();
      const fresh = await fetch("/api/admin/experience").then((r) => r.json());
      if (fresh?.sha) setSha(fresh.sha);
    } catch {
      setError("Couldn't reach the server.");
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Experience</h1>
          <p className="text-muted mt-1 text-sm">
            {entries.length} roles. Saving commits{" "}
            <code className="font-mono text-xs">content/experience.json</code> and rebuilds the
            site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && !dirty && <span className="text-success font-mono text-xs">Saved</span>}
          <Button
            type="button"
            variant="secondary"
            onClick={() => update([emptyEntry(), ...entries])}
          >
            Add role
          </Button>
          <Button type="button" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <pre
          role="alert"
          className="border-danger/40 bg-danger/5 text-danger mb-6 rounded-md border px-4 py-3 font-mono text-xs whitespace-pre-wrap"
        >
          {error}
        </pre>
      )}

      {entries.length === 0 ? (
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-10 text-center">
          <p className="text-muted text-sm">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map((entry, index) => (
            <section
              key={index}
              className="border-border bg-surface rounded-[--radius-card] border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Role"
                    value={entry.role}
                    onChange={(value) => patchEntry(index, { role: value })}
                  />
                  <Field
                    label="Company"
                    value={entry.company}
                    onChange={(value) => patchEntry(index, { company: value })}
                  />
                  <Field
                    label="Period"
                    value={entry.period}
                    onChange={(value) => patchEntry(index, { period: value })}
                  />
                  <Field
                    label="Location"
                    value={entry.location}
                    onChange={(value) => patchEntry(index, { location: value })}
                  />
                  <Field
                    label="Image path"
                    className="sm:col-span-2"
                    placeholder="/images/radius-office.jpg"
                    value={entry.image ?? ""}
                    onChange={(value) => patchEntry(index, { image: value || undefined })}
                  />
                  <TextareaField
                    label="Highlights"
                    className="sm:col-span-2"
                    value={entry.highlights.join("\n")}
                    onChange={(value) => patchEntry(index, { highlights: linesToList(value) })}
                  />
                  <Field
                    label="Tech"
                    className="sm:col-span-2"
                    hint="Comma-separated"
                    value={entry.tech.join(", ")}
                    onChange={(value) => patchEntry(index, { tech: csvToList(value) })}
                  />
                  <label className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={entry.current ?? false}
                      onChange={(e) =>
                        patchEntry(index, { current: e.target.checked || undefined })
                      }
                      className="accent-accent size-4"
                    />
                    <span className="text-muted text-sm">Current role</span>
                  </label>
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <MoveButtons
                    onUp={() => update(move(entries, index, index - 1))}
                    onDown={() => update(move(entries, index, index + 1))}
                    disableUp={index === 0}
                    disableDown={index === entries.length - 1}
                    label={entry.role || "role"}
                  />
                  <button
                    type="button"
                    onClick={() => update(entries.filter((_, i) => i !== index))}
                    aria-label={`Delete ${entry.role || "role"}`}
                    className="text-muted hover:text-danger hover:bg-danger/10 inline-flex size-7 items-center justify-center rounded transition-colors"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function MoveButtons({
  onUp,
  onDown,
  disableUp,
  disableDown,
  label,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp: boolean;
  disableDown: boolean;
  label: string;
}) {
  const base =
    "text-muted hover:text-text hover:bg-surface-hover inline-flex size-7 items-center justify-center rounded font-mono text-xs transition-colors disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <span className="flex shrink-0 flex-col gap-0.5">
      <button
        type="button"
        onClick={onUp}
        disabled={disableUp}
        aria-label={`Move ${label} up`}
        className={base}
      >
        Up
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={disableDown}
        aria-label={`Move ${label} down`}
        className={base}
      >
        Dn
      </button>
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-muted mb-1 block text-xs font-medium">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-bg focus:border-accent w-full rounded-md border px-2.5 py-1.5 text-sm transition-colors"
      />
      {hint && <span className="text-faint mt-1 block font-mono text-xs">{hint}</span>}
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-muted mb-1 block text-xs font-medium">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-bg focus:border-accent min-h-28 w-full rounded-md border px-2.5 py-1.5 text-sm leading-relaxed transition-colors"
      />
      <span className="text-faint mt-1 block font-mono text-xs">One highlight per line</span>
    </label>
  );
}
