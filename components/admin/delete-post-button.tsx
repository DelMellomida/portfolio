"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Delete failed.");
      setBusy(false);
      setConfirming(false);
      return;
    }

    router.refresh();
  };

  if (error) {
    return (
      <span className="text-danger text-xs" role="alert">
        {error}
      </span>
    );
  }

  // Inline two-step confirm rather than window.confirm, which is blocked in
  // some browsers and can't be styled or reached consistently by screen readers.
  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          aria-label={`Confirm deleting ${title}`}
          className="bg-danger rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="text-muted hover:text-text hover:bg-surface-hover rounded-md px-2.5 py-1.5 text-xs transition-colors"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${title}`}
      className="text-muted hover:text-danger hover:bg-danger/10 rounded-md px-2.5 py-1.5 text-xs transition-colors"
    >
      Delete
    </button>
  );
}
