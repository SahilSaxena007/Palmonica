import { useEffect, useState } from "react";
import { initAudio, playNote, stopNote } from "./audio/soundEngine";
import { keyMap } from "./audio/keyMap";
import { useHandTracking } from "./hooks/useHandTracking";
import KeyboardUI from "./components/KeyboardUI";
import "./components/styles.css";

const PRESSURE_GATE = 0.05;

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentNotes, setCurrentNotes] = useState([]);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const pressure = useHandTracking();

  // --- Press + Release Logic ---
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

  // --- Keyboard Events ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      pressKey(e.key);
    };
    const handleKeyUp = (e) => {
      releaseKey(e.key);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeKeys, pressure]);

  // --- Stop sound when pressure drops ---
  useEffect(() => {
    if (pressure < PRESSURE_GATE && currentNotes.length > 0) {
      currentNotes.forEach((n) => stopNote(n));
      setCurrentNotes([]);
    }
  }, [pressure]);

  return (
    <div className="app-wrapper">
      {/* CAMERA */}
      <div className="top-right-video card">
        <video id="input_video" autoPlay playsInline muted />
      </div>

      {/* TITLE */}
      <div className="header">
        <h1 className="title">🎶 Palmonica</h1>
        <p className="subtitle">
          Air-Controlled Harmonium — Play with your keyboard and hand movement
        </p>
      </div>

      {/* PRESSURE */}
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

      {/* KEYBOARD */}
      <KeyboardUI
        keyMap={keyMap}
        activeKeys={activeKeys}
        onKeyPress={pressKey}
        onKeyRelease={releaseKey}
      />

      {/* ACTIVE NOTES */}
      {currentNotes.length > 0 && (
        <div className="notes-pill">
          {currentNotes.map((n) => (
            <span key={n} className="note-chip">
              {n}
            </span>
          ))}
        </div>
      )}

      {/* STATUS */}
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
