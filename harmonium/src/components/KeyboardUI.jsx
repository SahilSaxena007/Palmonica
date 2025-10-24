import React from "react";
import "./styles.css";

// Expect: props.keyMap (object char->note), props.activeKeys (Set of chars),
// props.onKeyPress(keyChar), props.onKeyRelease(keyChar)

export default function KeyboardUI({
  keyMap,
  activeKeys,
  onKeyPress,
  onKeyRelease,
}) {
  // White row (your mapping)
  const whites = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "[",
    "]",
    "\\",
  ];

  // Black keys positioned between specific whites (index refers to the white “gap”)
  // Gaps (white index): between q-w -> 0, w-e ->1, e-r ->2, r-t ->3, y-u ->5, u-i ->6, i-o ->7
  const blacks = [
    { k: "1", gapIndex: 0 }, // between q & w
    { k: "2", gapIndex: 1 }, // between w & e
    { k: "4", gapIndex: 2 }, // between e & r
    { k: "5", gapIndex: 3 }, // between r & t
    { k: "7", gapIndex: 5 }, // between y & u
    { k: "8", gapIndex: 6 }, // between u & i
    { k: "9", gapIndex: 7 }, // between i & o
  ];

  // Grid trick: 26 columns; whites at even columns, blacks at odd columns (centered over the gap)
  const totalCols = 26;

  const whiteCells = whites.map((k, i) => {
    const note = keyMap[k];
    const isActive = activeKeys.has(k);
    // place at even columns: col = i*2 + 1, span 2
    const gridColumn = `${i * 2 + 1} / span 2`;
    return (
      <div
        key={k}
        className={`key white ${isActive ? "active" : ""}`}
        style={{ gridColumn }}
        onMouseDown={() => onKeyPress(k)}
        onMouseUp={() => onKeyRelease(k)}
        onMouseLeave={() => isActive && onKeyRelease(k)}
      >
        <div className="label-top">{note}</div>
        <div className="label-bottom">{k}</div>
      </div>
    );
  });

  const blackCells = blacks
    .filter(({ k }) => keyMap[k]) // render only if mapped
    .map(({ k, gapIndex }) => {
      const note = keyMap[k];
      const isActive = activeKeys.has(k);
      // place at odd columns centered over the gap: col = gapIndex*2 + 2, span 2 (narrow)
      const gridColumn = `${gapIndex * 2 + 2} / span 2`;
      return (
        <div
          key={k}
          className={`key black ${isActive ? "active" : ""}`}
          style={{ gridColumn }}
          onMouseDown={() => onKeyPress(k)}
          onMouseUp={() => onKeyRelease(k)}
          onMouseLeave={() => isActive && onKeyRelease(k)}
        >
          <div className="label-top">{note}</div>
          <div className="label-bottom">{k}</div>
        </div>
      );
    });

  return (
    <div className="keyboard-card">
      <div
        className="keyboard-grid"
        style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}
      >
        {/* whites underneath */}
        {whiteCells}
        {/* blacks on top layer */}
        <div className="black-layer">{blackCells}</div>
      </div>
    </div>
  );
}
