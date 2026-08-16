"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/primitives";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Sign in failed.");
        setBusy(false);
        return;
      }

      // Only allow relative redirects, so ?next= can't be used to bounce
      // someone to an external site after a successful login.
      const next = searchParams.get("next");
      const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Couldn't reach the server.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          className="border-border bg-surface focus:border-accent w-full rounded-md border px-3 py-2.5 text-sm transition-colors"
        />
      </div>

      {error && (
        <p id="login-error" role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}

      <Button type="submit" disabled={busy || !password} className="w-full">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
