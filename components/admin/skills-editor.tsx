"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  skillLevelLabel,
  skillLevels,
  type Skill,
  type SkillCategory,
  type SkillLevel,
} from "@/lib/skills";
import { Button } from "@/components/ui/primitives";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function emptyCategory(index: number): SkillCategory {
  return {
    id: `category-${index + 1}`,
    label: "New category",
    description: "What this group covers.",
    skills: [{ name: "New skill", level: "proficient" }],
  };
}

/** Move an item within an array, returning a new array. */
function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

export function SkillsEditor({
  initialCategories,
  initialSha,
}: {
  initialCategories: SkillCategory[];
  initialSha: string | null;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
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

  const update = (next: SkillCategory[]) => {
    setCategories(next);
    setDirty(true);
    setSaved(false);
  };

  const patchCategory = (index: number, patch: Partial<SkillCategory>) =>
    update(categories.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const patchSkill = (categoryIndex: number, skillIndex: number, patch: Partial<Skill>) =>
    update(
      categories.map((c, i) =>
        i === categoryIndex
          ? { ...c, skills: c.skills.map((s, j) => (j === skillIndex ? { ...s, ...patch } : s)) }
          : c,
      ),
    );

  const totalSkills = categories.reduce((n, c) => n + c.skills.length, 0);

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, sha }),
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
      // The blob SHA changes on every commit; refetch so a second save in the
      // same session doesn't get rejected as a stale write.
      router.refresh();
      const fresh = await fetch("/api/admin/skills").then((r) => r.json());
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
          <h1 className="text-2xl">Skills</h1>
          <p className="text-muted mt-1 text-sm">
            {categories.length} categories · {totalSkills} skills. Saving commits{" "}
            <code className="font-mono text-xs">content/skills.json</code> and rebuilds the site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && !dirty && <span className="text-success font-mono text-xs">Saved</span>}
          <Button
            type="button"
            variant="secondary"
            onClick={() => update([...categories, emptyCategory(categories.length)])}
          >
            Add category
          </Button>
          <Button type="button" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save"}
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

      {categories.length === 0 ? (
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-10 text-center">
          <p className="text-muted text-sm">No categories yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {categories.map((category, ci) => (
            <section
              key={ci}
              className="border-border bg-surface rounded-[--radius-card] border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Label"
                    value={category.label}
                    onChange={(v) => patchCategory(ci, { label: v })}
                  />
                  <Field
                    label="Id"
                    mono
                    hint={`terminal: skills ${category.id}`}
                    value={category.id}
                    onChange={(v) => patchCategory(ci, { id: v })}
                  />
                  <Field
                    label="Description"
                    className="sm:col-span-2"
                    value={category.description}
                    onChange={(v) => patchCategory(ci, { description: v })}
                  />
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <MoveButtons
                    onUp={() => update(move(categories, ci, ci - 1))}
                    onDown={() => update(move(categories, ci, ci + 1))}
                    disableUp={ci === 0}
                    disableDown={ci === categories.length - 1}
                    label={`category ${category.label}`}
                  />
                  <button
                    type="button"
                    onClick={() => update(categories.filter((_, i) => i !== ci))}
                    aria-label={`Delete category ${category.label}`}
                    className="text-muted hover:text-danger hover:bg-danger/10 inline-flex size-7 items-center justify-center rounded transition-colors"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              </div>

              <ul className="border-border mt-5 space-y-2 border-t pt-4">
                {category.skills.map((skill, si) => (
                  <li key={si} className="flex flex-wrap items-center gap-2">
                    <input
                      value={skill.name}
                      onChange={(e) => patchSkill(ci, si, { name: e.target.value })}
                      aria-label={`Skill name in ${category.label}`}
                      placeholder="Skill"
                      className="border-border bg-bg focus:border-accent min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-sm transition-colors"
                    />

                    <select
                      value={skill.level}
                      onChange={(e) =>
                        patchSkill(ci, si, { level: e.target.value as SkillLevel })
                      }
                      aria-label={`Level for ${skill.name || "skill"}`}
                      className="border-border bg-bg focus:border-accent rounded-md border px-2 py-1.5 font-mono text-xs transition-colors"
                    >
                      {skillLevels.map((level) => (
                        <option key={level} value={level}>
                          {skillLevelLabel[level]}
                        </option>
                      ))}
                    </select>

                    <input
                      value={skill.note ?? ""}
                      onChange={(e) =>
                        patchSkill(ci, si, { note: e.target.value || undefined })
                      }
                      aria-label={`Optional note for ${skill.name || "skill"}`}
                      placeholder="Note (optional)"
                      className="border-border bg-bg focus:border-accent min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-sm transition-colors"
                    />

                    <MoveButtons
                      onUp={() =>
                        patchCategory(ci, { skills: move(category.skills, si, si - 1) })
                      }
                      onDown={() =>
                        patchCategory(ci, { skills: move(category.skills, si, si + 1) })
                      }
                      disableUp={si === 0}
                      disableDown={si === category.skills.length - 1}
                      label={skill.name || "skill"}
                      row
                    />

                    <button
                      type="button"
                      onClick={() =>
                        patchCategory(ci, {
                          skills: category.skills.filter((_, j) => j !== si),
                        })
                      }
                      aria-label={`Remove ${skill.name || "skill"}`}
                      className="text-muted hover:text-danger hover:bg-danger/10 inline-flex size-7 shrink-0 items-center justify-center rounded transition-colors"
                    >
                      <CloseIcon className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() =>
                  patchCategory(ci, {
                    skills: [...category.skills, { name: "", level: "proficient" }],
                  })
                }
              >
                + Add skill
              </Button>
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
  row,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp: boolean;
  disableDown: boolean;
  label: string;
  row?: boolean;
}) {
  // Buttons rather than drag-and-drop: reordering stays fully keyboard
  // operable and needs no extra dependency.
  const base =
    "text-muted hover:text-text hover:bg-surface-hover inline-flex size-7 items-center justify-center rounded font-mono text-xs transition-colors disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <span className={cn("flex shrink-0 gap-0.5", row ? "flex-row" : "flex-col")}>
      <button type="button" onClick={onUp} disabled={disableUp} aria-label={`Move ${label} up`} className={base}>
        ↑
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={disableDown}
        aria-label={`Move ${label} down`}
        className={base}
      >
        ↓
      </button>
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  mono,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-muted mb-1 block text-xs font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-border bg-bg focus:border-accent w-full rounded-md border px-2.5 py-1.5 text-sm transition-colors",
          mono && "font-mono",
        )}
      />
      {hint && <span className="text-faint mt-1 block font-mono text-xs">{hint}</span>}
    </label>
  );
}
