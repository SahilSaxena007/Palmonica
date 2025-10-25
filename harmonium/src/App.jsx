import { useEffect, useState } from "react";
import { initAudio, playNote, stopNote } from "./audio/soundEngine";
import { keyMap } from "./audio/keyMap";
import { useHandTracking } from "./hooks/useHandTracking";
import { useBreathTracking } from "./hooks/useBreathTracking";
import KeyboardUI from "./components/KeyboardUI";
import "./components/styles.css";

const PRESSURE_GATE = 0.05;

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentNotes, setCurrentNotes] = useState([]);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [mode, setMode] = useState("hand"); // hand | breath | manual

  // Tracking sources
  const handPressure = useHandTracking(mode === "hand");
  const breathPressure = useBreathTracking(mode === "breath");
  const pressure =
    mode === "hand" ? handPressure : mode === "breath" ? breathPressure : 1; // manual mode = full pressure

  // Play & stop logic
  const pressKey = (keyChar) => {
    const k = keyChar.toLowerCase();
    const note = keyMap[k];
    if (!note || activeKeys.has(k)) return;

    const newKeys = new Set(activeKeys);
    newKeys.add(k);
    setActiveKeys(newKeys);

    initAudio().then(() => {
      setIsLoaded(true);
      if (pressure > PRESSURE_GATE) {
        playNote(note, pressure);
        setCurrentNotes((prev) =>
          prev.includes(note) ? prev : [...prev, note]
        );
      }
    });
  };

  const releaseKey = (keyChar) => {
    const k = keyChar.toLowerCase();
    const note = keyMap[k];
    if (!note) return;

    const newKeys = new Set(activeKeys);
    newKeys.delete(k);
    setActiveKeys(newKeys);

    stopNote(note);
    setCurrentNotes((prev) => prev.filter((n) => n !== note));
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      pressKey(e.key);
    };
    const handleKeyUp = (e) => releaseKey(e.key);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeKeys, pressure]);

  // Pressure-based decay
  useEffect(() => {
    if (pressure < PRESSURE_GATE && currentNotes.length > 0) {
      currentNotes.forEach((n) => stopNote(n));
      setCurrentNotes([]);
    }
  }, [pressure]);

  return (
    <div className="app-wrapper">
      {/* Camera */}
      {mode === "hand" && (
        <div className="top-right-video card">
          <video id="input_video" autoPlay playsInline muted />
        </div>
      )}

      {/* Header */}
      <div className="header">
        <h1 className="title">🎶 Palmonica</h1>
        <p className="subtitle">
          Air-Controlled Harmonium — switch between Hand, Breath, or Manual
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={mode === "hand" ? "active" : ""}
          onClick={() => setMode("hand")}
        >
          ✋ Hand Tracking
        </button>
        <button
          className={mode === "breath" ? "active" : ""}
          onClick={() => setMode("breath")}
        >
          💨 Breath Tracking
        </button>
        <button
          className={mode === "manual" ? "active" : ""}
          onClick={() => setMode("manual")}
        >
          🎹 Manual
        </button>
      </div>

      {/* Pressure Bar */}
      <div className="card pressure-card">
        <div className="pressure-bar">
          <div
            className="pressure-fill"
            style={{ width: `${Math.round(pressure * 100)}%` }}
          />
        </div>
        <div className="pressure-meta">
          <span>Pressure</span>
          <span>{Math.round(pressure * 100)}%</span>
        </div>
      </div>

      {/* Keyboard */}
      <KeyboardUI
        keyMap={keyMap}
        activeKeys={activeKeys}
        onKeyPress={pressKey}
        onKeyRelease={releaseKey}
      />

      {/* Active Notes */}
      {currentNotes.length > 0 && (
        <div className="notes-pill">
          {currentNotes.map((n) => (
            <span key={n} className="note-chip">
              {n}
            </span>
          ))}
        </div>
      )}

      {/* Load Status */}
      <p
        style={{
          color: isLoaded ? "#34d399" : "#a0acc0",
          marginTop: "12px",
        }}
      >
        {isLoaded
          ? "✅ Samples Ready"
          : "Loading harmonium samples... press any key to start"}
      </p>
    </div>
  );
}
