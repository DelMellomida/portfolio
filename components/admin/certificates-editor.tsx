"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Certificate } from "@/lib/certificates";
import { Button } from "@/components/ui/primitives";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function emptyCertificate(index: number, availableFiles: string[]): Certificate {
  const file = availableFiles[0] ?? "/certificates/";
  return {
    id: `certificate-${index + 1}`,
    title: "New certificate",
    issuer: "",
    issuedAt: "",
    file,
    tags: [],
    visible: true,
  };
}

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

function csvToList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CertificatesEditor({
  initialCertificates,
  initialSha,
  initialAvailableFiles,
}: {
  initialCertificates: Certificate[];
  initialSha: string | null;
  initialAvailableFiles: string[];
}) {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [sha, setSha] = useState(initialSha);
  const [availableFiles, setAvailableFiles] = useState(initialAvailableFiles);
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

  const update = (next: Certificate[]) => {
    setCertificates(next);
    setDirty(true);
    setSaved(false);
  };

  const patchCertificate = (index: number, patch: Partial<Certificate>) =>
    update(
      certificates.map((certificate, i) =>
        i === index ? { ...certificate, ...patch } : certificate,
      ),
    );

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificates, sha }),
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

      const fresh = await fetch("/api/admin/certificates").then((r) => r.json());
      if (fresh?.sha) setSha(fresh.sha);
      if (Array.isArray(fresh?.availableFiles)) setAvailableFiles(fresh.availableFiles);
    } catch {
      setError("Couldn't reach the server.");
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Certificates</h1>
          <p className="text-muted mt-1 text-sm">
            {certificates.length} certificates. Saving commits{" "}
            <code className="font-mono text-xs">content/certificates.json</code> and rebuilds the
            site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && !dirty && <span className="text-success font-mono text-xs">Saved</span>}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              update([...certificates, emptyCertificate(certificates.length, availableFiles)])
            }
          >
            Add certificate
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

      {certificates.length === 0 ? (
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-10 text-center">
          <p className="text-muted text-sm">No certificates yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {certificates.map((certificate, index) => (
            <section
              key={index}
              className={cn(
                "border-border bg-surface rounded-[--radius-card] border p-5",
                !certificate.visible && "opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Title"
                    value={certificate.title}
                    onChange={(value) => patchCertificate(index, { title: value })}
                  />
                  <Field
                    label="Id"
                    mono
                    value={certificate.id}
                    onChange={(value) => patchCertificate(index, { id: value })}
                  />
                  <Field
                    label="Issuer"
                    value={certificate.issuer}
                    onChange={(value) => patchCertificate(index, { issuer: value })}
                  />
                  <Field
                    label="Issued"
                    placeholder="Jul 2026"
                    value={certificate.issuedAt}
                    onChange={(value) => patchCertificate(index, { issuedAt: value })}
                  />
                  <FileField
                    value={certificate.file}
                    availableFiles={availableFiles}
                    onChange={(value) => patchCertificate(index, { file: value })}
                  />
                  <Field
                    label="Tags"
                    hint="Comma-separated"
                    value={certificate.tags.join(", ")}
                    onChange={(value) => patchCertificate(index, { tags: csvToList(value) })}
                  />
                  <label className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={certificate.visible}
                      onChange={(e) => patchCertificate(index, { visible: e.target.checked })}
                      className="accent-accent size-4"
                    />
                    <span className="text-muted text-sm">Show on About page</span>
                  </label>
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <MoveButtons
                    onUp={() => update(move(certificates, index, index - 1))}
                    onDown={() => update(move(certificates, index, index + 1))}
                    disableUp={index === 0}
                    disableDown={index === certificates.length - 1}
                    label={certificate.title || "certificate"}
                  />
                  <button
                    type="button"
                    onClick={() => update(certificates.filter((_, i) => i !== index))}
                    aria-label={`Delete ${certificate.title || "certificate"}`}
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
  mono,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-muted mb-1 block text-xs font-medium">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
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

function FileField({
  value,
  availableFiles,
  onChange,
}: {
  value: string;
  availableFiles: string[];
  onChange: (value: string) => void;
}) {
  if (availableFiles.length === 0) {
    return (
      <Field
        label="PDF path"
        mono
        placeholder="/certificates/example.pdf"
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <label className="block">
      <span className="text-muted mb-1 block text-xs font-medium">PDF</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-bg focus:border-accent w-full rounded-md border px-2.5 py-1.5 text-sm transition-colors"
      >
        {!availableFiles.includes(value) && <option value={value}>{value}</option>}
        {availableFiles.map((file) => (
          <option key={file} value={file}>
            {file.replace("/certificates/", "")}
          </option>
        ))}
      </select>
      <span className="text-faint mt-1 block font-mono text-xs">
        Files from public/certificates
      </span>
    </label>
  );
}
