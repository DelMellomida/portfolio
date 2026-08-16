"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1800;
const SWITCH_MS = 220;

/**
 * Dependency-free replacement for the old typed.js hero.
 *
 * Two things the old one got wrong:
 *  - it animated regardless of prefers-reduced-motion
 *  - screen readers announced every intermediate character as the string grew
 *
 * The animated span is aria-hidden; a stable sr-only sentence carries the
 * meaning instead. Every state transition is scheduled through a timeout, so
 * the effect never sets state synchronously.
 */
export function TypingRoles({ roles, className }: { roles: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || roles.length === 0) return;

    const current = roles[index % roles.length] ?? "";
    let delay = TYPE_MS;
    let step: () => void;

    if (!deleting) {
      if (text === current) {
        delay = HOLD_MS;
        step = () => setDeleting(true);
      } else {
        step = () => setText(current.slice(0, text.length + 1));
      }
    } else if (text === "") {
      delay = SWITCH_MS;
      step = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      };
    } else {
      delay = DELETE_MS;
      step = () => setText(text.slice(0, -1));
    }

    const id = setTimeout(step, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, roles, reduced]);

  if (reduced) {
    return (
      <p className={className}>
        <span className="text-accent font-mono">{roles[0] ?? ""}</span>
      </p>
    );
  }

  return (
    <p className={className}>
      {/* Stable, complete text for assistive tech. */}
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden="true" className="text-accent font-mono">
        {text}
        <span className="bg-accent ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] motion-safe:animate-pulse" />
      </span>
    </p>
  );
}
