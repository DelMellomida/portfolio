"use client";

import { useCallback, useRef, useState } from "react";
import {
  cloneGrid,
  findConflicts,
  generatePuzzle,
  isComplete,
  type Grid,
  type Puzzle,
} from "@/lib/sudoku";
import { Button } from "@/components/ui/primitives";
import { useIsClient } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface Game {
  puzzle: Puzzle;
  grid: Grid;
}

function newGame(): Game {
  const puzzle = generatePuzzle();
  return { puzzle, grid: cloneGrid(puzzle.puzzle) };
}

export function Sudoku({ compact = false }: { compact?: boolean }) {
  const [game, setGame] = useState<Game>(newGame);
  const cellRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // The board is randomly generated, so the server's version would never match
  // the client's. Rendering a placeholder until hydration avoids the mismatch
  // without needing an effect to regenerate.
  const isClient = useIsClient();

  const reset = useCallback(() => setGame(newGame()), []);

  const focusCell = useCallback((r: number, c: number) => {
    const cell = cellRefs.current[r]?.[c];
    cell?.focus();
    cell?.select();
  }, []);

  if (!isClient) {
    return (
      <div
        className={cn(
          "bg-bg-subtle border-border rounded-md border",
          compact ? "size-[9.5rem]" : "size-[12.5rem]",
        )}
        aria-busy="true"
        aria-label="Loading puzzle"
      />
    );
  }

  const { puzzle, grid } = game;
  const conflicts = findConflicts(grid);
  const solved = isComplete(grid) && conflicts.size === 0;

  /** Advance to the next editable cell after a successful entry. */
  const focusNext = (r: number, c: number) => {
    for (let i = r * 4 + c + 1; i < 16; i++) {
      const nr = Math.floor(i / 4);
      const nc = i % 4;
      if (!puzzle.given[nr]![nc]) {
        requestAnimationFrame(() => focusCell(nr, nc));
        return;
      }
    }
  };

  const setCell = (r: number, c: number, raw: string) => {
    if (puzzle.given[r]![c]) return;
    const value = raw.replace(/[^1-4]/g, "").slice(-1);
    const next = cloneGrid(grid);
    next[r]![c] = value === "" ? 0 : Number(value);
    setGame({ puzzle, grid: next });
    if (value !== "") focusNext(r, c);
  };

  /** Arrow-key navigation across the grid — the old version had none. */
  const onKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    const moves: Record<string, [number, number]> = {
      ArrowUp: [r - 1, c],
      ArrowDown: [r + 1, c],
      ArrowLeft: [r, c - 1],
      ArrowRight: [r, c + 1],
    };
    const move = moves[e.key];
    if (move) {
      const [nr, nc] = move;
      if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
        e.preventDefault();
        focusCell(nr, nc);
      }
      return;
    }
    if ((e.key === "Backspace" || e.key === "Delete") && !puzzle.given[r]![c]) {
      e.preventDefault();
      setCell(r, c, "");
    }
  };

  const cellSize = compact ? "size-9 text-base" : "size-12 text-lg";

  return (
    <div className={compact ? "" : "flex flex-col items-start"}>
      <div
        role="group"
        aria-label="4 by 4 sudoku. Use arrow keys to move between cells and type 1 to 4 to fill them."
        className="border-border-strong grid w-fit grid-cols-4 gap-px rounded-md border-2 bg-[var(--border-strong)] p-px"
      >
        {grid.map((row, r) =>
          row.map((value, c) => {
            const given = puzzle.given[r]![c]!;
            const conflicted = conflicts.has(`${r}-${c}`);

            return (
              <input
                key={`${r}-${c}`}
                ref={(el) => {
                  cellRefs.current[r] ??= [];
                  cellRefs.current[r]![c] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={1}
                readOnly={given}
                value={value === 0 ? "" : value}
                onChange={(e) => setCell(r, c, e.target.value)}
                onKeyDown={(e) => onKeyDown(e, r, c)}
                onFocus={(e) => e.target.select()}
                aria-label={`Row ${r + 1}, column ${c + 1}${given ? ", given" : ""}`}
                aria-invalid={conflicted || undefined}
                aria-readonly={given || undefined}
                className={cn(
                  "text-center font-mono transition-colors focus:outline-none focus-visible:z-10",
                  cellSize,
                  // Emphasize the 2x2 box boundaries.
                  c === 1 && "mr-px",
                  r === 1 && "mb-px",
                  given
                    ? "bg-bg-subtle text-text cursor-default font-semibold"
                    : "bg-surface text-accent caret-transparent focus:bg-accent-subtle",
                  conflicted && "!bg-danger/15 !text-danger",
                )}
              />
            );
          }),
        )}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 font-mono text-xs">
        {solved ? (
          <span className="text-success">Solved. Nicely done.</span>
        ) : conflicts.size > 0 ? (
          <span className="text-danger">
            {conflicts.size} conflicting {conflicts.size === 1 ? "cell" : "cells"}
          </span>
        ) : (
          <span className="text-faint">Fill every row, column, and 2×2 box with 1–4.</span>
        )}
      </p>

      <Button variant="secondary" size="sm" onClick={reset} className="mt-2">
        New puzzle
      </Button>
    </div>
  );
}
