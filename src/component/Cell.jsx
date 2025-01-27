import React, { memo } from "react";

const Cell = memo(({ cell, onClick, onRightClick }) => {
  return (
    <div
      className="cell"
      onClick={onClick}
      onContextMenu={onRightClick}
      style={{
        backgroundColor: cell.isRevealed ? (cell.isMine ? "red" : "#ADD8E6") : "blue", // Sfondo blu per celle nascoste, azzurro per rivelate
        border: "1px solid white", // Bordo bianco
        width: "30px", // Larghezza della cella
        height: "30px", // Altezza della cella
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "black", // Forza il colore del testo
      }}
    >
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