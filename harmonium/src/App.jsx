import { useEffect, useState } from "react";
import { initAudio, playNote, stopNote } from "./audio/soundEngine";
import { keyMap } from "./audio/keyMap";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentNotes, setCurrentNotes] = useState([]);
  const activeKeys = new Set();

  // handle keydown
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (!note || event.repeat || activeKeys.has(key)) return;

    activeKeys.add(key);
    if (!isLoaded) {
      initAudio().then(() => {
        setIsLoaded(true);
        playNote(note);
        setCurrentNotes((prev) => [...prev, note]);
      });
    } else {
      playNote(note);
      setCurrentNotes((prev) => [...prev, note]);
    }
  };

  // handle keyup
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
  }, [isLoaded]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "4rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1>🎶 Palmonica</h1>
      <h3>Play with A–J (lower octave) and Z–M (upper octave)</h3>
      {!isLoaded && (
        <p style={{ color: "orange", fontWeight: "600" }}>
          Loading harmonium samples... (press any key to start)
        </p>
      )}
      {isLoaded && (
        <>
          <p style={{ color: "green", fontWeight: "600" }}>Samples Ready ✅</p>
          {currentNotes.length > 0 && (
            <p style={{ fontSize: "1.2rem" }}>
              Now Playing: {currentNotes.join(", ")}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
