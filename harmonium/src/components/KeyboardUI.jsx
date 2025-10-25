import React from "react";
import "./styles.css";

export default function KeyboardUI({
  keyMap,
  activeKeys,
  onKeyPress,
  onKeyRelease,
}) {
  // White keys ordered left → right
  const whiteKeys = [
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
  ];
  // Black keys with horizontal offsets matching white keys
  const blackKeys = [
    { key: "w", position: 0.7 },
    { key: "e", position: 1.7 },
    { key: "t", position: 3.7 },
    { key: "y", position: 4.7 },
    { key: "u", position: 5.7 },
    { key: "r", position: 8.7 },
    { key: "k", position: 11.7 },
    { key: "l", position: 12.7 },
  ];

  return (
    <div className="keyboard-wrapper">
      {/* White keys */}
      <div className="white-keys">
        {whiteKeys.map((k) => {
          const note = keyMap[k];
          const isActive = activeKeys.has(k);
          return (
            <div
              key={k}
              className={`key white ${isActive ? "active" : ""}`}
              onMouseDown={() => onKeyPress(k)}
              onMouseUp={() => onKeyRelease(k)}
              onMouseLeave={() => isActive && onKeyRelease(k)}
            >
              <span className="note">{note}</span>
              <span className="kbd">{k.toUpperCase()}</span>
            </div>
          );
        })}
      </div>

      {/* Black keys overlay */}
      <div className="black-keys">
        {blackKeys.map(({ key, position }) => {
          const note = keyMap[key];
          if (!note) return null;
          const isActive = activeKeys.has(key);
          return (
            <div
              key={key}
              className={`key black ${isActive ? "active" : ""}`}
              style={{ left: `${position * 60}px` }}
              onMouseDown={() => onKeyPress(key)}
              onMouseUp={() => onKeyRelease(key)}
              onMouseLeave={() => isActive && onKeyRelease(key)}
            >
              <span className="note">{note}</span>
              <span className="kbd">{key.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
