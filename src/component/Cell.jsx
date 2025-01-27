import React, { memo } from "react";

const Cell = memo(({ cell, onClick, onRightClick }) => {
  return (
    <div
      className="cell"
      onClick={onClick}
      onContextMenu={onRightClick}
      style={{
        backgroundColor: cell.isRevealed ? (cell.isMine ? "red" : "#ADD8E6") : "blue",
        border: "1px solid white",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "black",
      }}
    >
      {cell.isRevealed && cell.isMine && <span>💣</span>} {/* Icona della bomba */}
      {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
        <span style={{ color: "black", fontWeight: "bold" }}>
          {cell.adjacentMines}
        </span>
      )}
      {!cell.isRevealed && cell.isFlagged && <span>🚩</span>}
    </div>
  );
});

export default Cell;