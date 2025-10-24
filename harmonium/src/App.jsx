import { useEffect } from "react";
import { initAudio, playNote, stopNote } from "./audio/soundEngine";
import { keyMap } from "./audio/keyMap"; // move keyMap into its own file

function App() {
  // Keep track of which keys are currently pressed (avoid repeats)
  const activeKeys = new Set();

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (!note || event.repeat) return; // ignore unmapped or held keys
    if (activeKeys.has(key)) return; // prevent duplicate plays
    activeKeys.add(key);

    initAudio().then(() => {
      playNote(note);
    });
  };

  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (!note) return;
    activeKeys.delete(key);
    stopNote(note);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // cleanup when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <h1>Palmonica 🎶</h1>;
}

export default App;
