import React, { useState, useEffect, useCallback } from "react";
import Cell from "./Cell";

const generateGrid = (gridSize, mineCount) => {
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 }));

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);

    if (!grid[row][col].isMine) {
      grid[row][col] = { ...grid[row][col], isMine: true };
      minesPlaced++;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (
            newRow >= 0 &&
            newRow < gridSize &&
            newCol >= 0 &&
            newCol < gridSize &&
            !grid[newRow][newCol].isMine
          ) {
            grid[newRow][newCol].adjacentMines++;
          }
        }
      }
    }
  }
  return grid;
};

const revealCells = (grid, row, col) => {
  const gridSize = grid.length;
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const stack = [[row, col]];

  while (stack.length) {
    const [currentRow, currentCol] = stack.pop();
    if (
      currentRow < 0 ||
      currentRow >= gridSize ||
      currentCol < 0 ||
      currentCol >= gridSize ||
      newGrid[currentRow][currentCol].isRevealed
    ) {
      continue;
    }

    newGrid[currentRow][currentCol].isRevealed = true;

    if (newGrid[currentRow][currentCol].adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          stack.push([currentRow + i, currentCol + j]);
        }
      }
    }
  }

  return newGrid;
};

const Grid16x16 = () => {
  const gridSize = 16;
  const mineCount = 40;
  const [grid, setGrid] = useState(generateGrid(gridSize, mineCount));
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!gameOver && !gameWon) {
      const timer = setInterval(() => setTime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameOver, gameWon]);

  const handleCellClick = useCallback((row, col) => {
    if (gameOver || gameWon || grid[row][col].isRevealed || grid[row][col].isFlagged) return;

    if (grid[row][col].isMine) {
      setGameOver(true);
      alert("Game Over! You clicked on a mine.");
    } else {
      const newGrid = revealCells([...grid.map(row => row.map(cell => ({ ...cell })))], row, col);
      setGrid(newGrid);

      const nonMineCells = gridSize * gridSize - mineCount;
      const revealedCells = newGrid.flat().filter(cell => cell.isRevealed).length;
      if (revealedCells === nonMineCells) {
        setGameWon(true);
        alert("Congratulations! You won the game.");
      }
    }
  }, [gameOver, gameWon, grid]);

  const handleRightClick = useCallback((row, col) => {
    if (gameOver || gameWon || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
  }, [gameOver, gameWon, grid]);

  const restartGame = () => {
    setGrid(generateGrid(gridSize, mineCount));
    setGameOver(false);
    setGameWon(false);
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Minesweeper</h1>
      <div className="flex justify-between w-full max-w-screen-lg mx-auto p-4">
        <span>Time: {time}s</span>
        <span>Mines: {mineCount}</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 30px)`, // 16 colonne di 30px ciascuna
          gridTemplateRows: `repeat(${gridSize}, 30px)`, // 16 righe di 30px ciascuna
          gap: "1px", // Spazio tra le celle
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onRightClick={(e) => {
                e.preventDefault();
                handleRightClick(rowIndex, colIndex);
              }}
            />
          ))
        )}
      </div>
      {gameOver && <p className="text-red-600 font-bold mt-4">Game Over! Try again.</p>}
      {gameWon && <p className="text-green-600 font-bold mt-4">You Won! Congratulations!</p>}
      <button
        onClick={restartGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Restart
      </button>
    </div>
  );
};

export default Grid16x16;