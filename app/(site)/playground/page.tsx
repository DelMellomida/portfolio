import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/primitives";
import { Sudoku } from "@/components/playground/sudoku";

export const metadata: Metadata = {
  title: "Playground",
  description: "Small interactive things — including a keyboard-playable 4×4 sudoku.",
  alternates: { canonical: "/playground" },
  openGraph: {
    title: "Playground",
    description: "Small interactive things, including a keyboard-playable sudoku.",
    url: "/playground",
  },
};

export default function PlaygroundPage() {
  return (
    <>
      <PageHeader
        label="Playground"
        title="Things to poke at"
        description="Small experiments that don't warrant a case study. Everything here is keyboard-playable."
      />

      <Section label="Puzzle" title="Mini sudoku">
        <div className="border-border bg-bg-subtle rounded-[--radius-card] border p-6 sm:p-8">
          <p className="text-muted mb-6 max-w-lg text-sm leading-relaxed">
            A 4×4 sudoku with a freshly generated, guaranteed-unique puzzle each round. Move with
            the arrow keys, type 1–4 to fill a cell, and Backspace to clear one. Conflicts highlight
            as you go.
          </p>
          <Sudoku />
          <p className="text-faint mt-6 font-mono text-xs">
            Also reachable by typing <code className="text-muted">sudoku</code> in the{" "}
            <a href="/skills" className="text-accent underline underline-offset-4">
              terminal
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
