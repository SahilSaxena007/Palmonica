import { useEffect, useState } from "react";
import { initAudio, playNote, stopNote } from "./audio/soundEngine";
import { keyMap } from "./audio/keyMap";
import { useHandTracking } from "./hooks/useHandTracking";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentNotes, setCurrentNotes] = useState([]);
  const activeKeys = new Set();

  const pressure = useHandTracking(); // 👈 new hook

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (!note || event.repeat || activeKeys.has(key)) return;

    activeKeys.add(key);
    if (!isLoaded) {
      initAudio().then(() => {
        setIsLoaded(true);
        playNote(note, pressure);
        setCurrentNotes((prev) => [...prev, note]);
      });
    } else {
      playNote(note, pressure);
      setCurrentNotes((prev) => [...prev, note]);
    }
  };

  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (!note) return;
    activeKeys.delete(key);
    stopNote(note);
    setCurrentNotes((prev) => prev.filter((n) => n !== note));
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isLoaded, pressure]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1>🎶 Palmonica (v2) – Air-Controlled Harmonium</h1>
      <p>
        Play with keys (A–L or your mapping) <br />
        Move your hand closer/farther to control volume 💨
      </p>

      <video
        id="input_video"
        style={{
          display: "block",
          margin: "1rem auto",
          transform: "scaleX(-1)",
          borderRadius: "8px",
          width: "480px",
        }}
        autoPlay
        playsInline
      ></video>

      <div
        style={{
          width: "200px",
          height: "20px",
          margin: "1rem auto",
          border: "2px solid #444",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#ddd",
        }}
      >
        <div
          style={{
            width: `${pressure * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #34d399, #059669)",
            transition: "width 0.1s",
          }}
        ></div>
      </div>

      <p>Pressure: {(pressure * 100).toFixed(0)}%</p>

      {isLoaded ? (
        <p style={{ color: "green" }}>✅ Harmonium ready</p>
      ) : (
        <p style={{ color: "orange" }}>Loading harmonium samples...</p>
      )}
      {currentNotes.length > 0 && <p>Now Playing: {currentNotes.join(", ")}</p>}
    </div>
  );
}

export default App;
