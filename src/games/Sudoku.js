import React, { useState } from "react";

// A simple 4x4 Sudoku puzzle for demo purposes
const initialBoard = [
  [1, 0, 0, 4],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [3, 0, 0, 2],
];

const solution = [
  [1, 2, 3, 4],
  [4, 3, 2, 1],
  [2, 4, 1, 3],
  [3, 1, 4, 2],
];

function Sudoku() {
  const [board, setBoard] = useState(initialBoard);
  const [message, setMessage] = useState("");

  const handleChange = (row, col, value) => {
    if (value === "" || (/^[1-4]$/.test(value) && initialBoard[row][col] === 0)) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = value === "" ? 0 : parseInt(value, 10);
      setBoard(newBoard);
      setMessage("");
    }
  };

  const checkSolution = () => {
    if (JSON.stringify(board) === JSON.stringify(solution)) {
      setMessage("🎉 Congratulations! You solved it!");
    } else {
      setMessage("❌ Not quite right. Keep trying!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Mini Sudoku (4x4)</h2>
      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-lg shadow-lg">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <input
              key={`${rIdx}-${cIdx}`}
              className={`w-12 h-12 text-center text-xl rounded border-2 ${
                initialBoard[rIdx][cIdx] !== 0
                  ? "bg-gray-700 text-gray-300 border-gray-600"
                  : "bg-gray-900 text-blue-300 border-blue-400 focus:outline-none"
              }`}
              type="text"
              maxLength={1}
              value={cell === 0 ? "" : cell}
              disabled={initialBoard[rIdx][cIdx] !== 0}
              onChange={e => handleChange(rIdx, cIdx, e.target.value)}
            />
          ))
        )}
      </div>
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={checkSolution}
      >
        Check Solution
      </button>
      {message && <div className="mt-3 text-lg">{message}</div>}
    </div>
  );
}

export default Sudoku;