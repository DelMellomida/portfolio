export type Grid = number[][]; // 4x4, 0 = empty

const SIZE = 4;
const BOX = 2;

export function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

/** Is `value` legal at (row, col), ignoring whatever currently sits there? */
export function isLegal(grid: Grid, row: number, col: number, value: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (i !== col && grid[row]![i] === value) return false;
    if (i !== row && grid[i]![col] === value) return false;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r++) {
    for (let c = boxCol; c < boxCol + BOX; c++) {
      if ((r !== row || c !== col) && grid[r]![c] === value) return false;
    }
  }
  return true;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Counts solutions, short-circuiting at `limit` — used to guarantee uniqueness. */
function countSolutions(grid: Grid, limit = 2): number {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c] !== 0) continue;
      let total = 0;
      for (let v = 1; v <= SIZE; v++) {
        if (!isLegal(grid, r, c, v)) continue;
        grid[r]![c] = v;
        total += countSolutions(grid, limit - total);
        grid[r]![c] = 0;
        if (total >= limit) return total;
      }
      return total;
    }
  }
  return 1; // fully filled and legal
}

function fill(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c] !== 0) continue;
      for (const v of shuffle([1, 2, 3, 4])) {
        if (!isLegal(grid, r, c, v)) continue;
        grid[r]![c] = v;
        if (fill(grid)) return true;
        grid[r]![c] = 0;
      }
      return false;
    }
  }
  return true;
}

export interface Puzzle {
  puzzle: Grid;
  solution: Grid;
  /** true where the cell was given and must stay locked */
  given: boolean[][];
}

/**
 * Generates a fresh puzzle with a unique solution.
 *
 * The old CRA version shipped one hardcoded board and compared the whole grid
 * against one fixed answer — so it could only ever be played once, and any
 * alternative valid arrangement would have been marked wrong.
 */
export function generatePuzzle(clues = 6): Puzzle {
  const solution = emptyGrid();
  fill(solution);

  const puzzle = cloneGrid(solution);
  const positions = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, i) => [Math.floor(i / SIZE), i % SIZE] as const),
  );

  let remaining = SIZE * SIZE;
  for (const [r, c] of positions) {
    if (remaining <= clues) break;
    const backup = puzzle[r]![c]!;
    puzzle[r]![c] = 0;
    if (countSolutions(cloneGrid(puzzle)) !== 1) {
      puzzle[r]![c] = backup; // removing it would allow a second solution
    } else {
      remaining--;
    }
  }

  return {
    puzzle,
    solution,
    given: puzzle.map((row) => row.map((v) => v !== 0)),
  };
}

export function isComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((v) => v !== 0));
}

/** Coordinates of every cell that conflicts with another — for live feedback. */
export function findConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = grid[r]![c]!;
      if (v !== 0 && !isLegal(grid, r, c, v)) conflicts.add(`${r}-${c}`);
    }
  }
  return conflicts;
}
