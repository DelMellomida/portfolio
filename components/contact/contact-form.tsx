"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { Button } from "@/components/ui/primitives";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  // Stamped after mount rather than during render — Date.now() in a render
  // body is impure, and the value is only ever read inside handlers.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("sending");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      reset();
      setStatus("sent");
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border-success/30 bg-success/5 rounded-[--radius-card] border p-8 text-center"
      >
        <p className="text-success font-medium">Message sent.</p>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-6"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      noValidate
      className="space-y-5"
    >
      <Field label="Name" error={errors.name?.message}>
        {(id, describedBy) => (
          <input
            id={id}
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={describedBy}
            className={inputClass(!!errors.name)}
            {...register("name")}
          />
        )}
      </Field>

      <Field label="Email" error={errors.email?.message}>
        {(id, describedBy) => (
          <input
            id={id}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy}
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        )}
      </Field>

      <Field label="Message" error={errors.message?.message}>
        {(id, describedBy) => (
          <textarea
            id={id}
            rows={6}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy}
            className={cn(inputClass(!!errors.message), "resize-y")}
            {...register("message")}
          />
        )}
      </Field>

      {/* Honeypot — hidden from users, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        <p className="text-faint text-xs">
          Or email me at{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
            {site.email}
          </a>
        </p>
      </div>

      {serverError && (
        <p role="alert" className="text-danger text-sm">
          {serverError}
        </p>
      )}
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "bg-surface w-full rounded-md border px-3 py-2.5 text-sm transition-colors placeholder:text-[var(--text-faint)]",
    hasError ? "border-danger" : "border-border focus:border-accent",
  );
}

/** Label + control + error message, wired together with matching ids. */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: (id: string, describedBy: string | undefined) => React.ReactNode;
}) {
  const id = label.toLowerCase();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children(id, error ? errorId : undefined)}
      {error && (
        <p id={errorId} className="text-danger mt-1.5 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
