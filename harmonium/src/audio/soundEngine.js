import * as Tone from "tone";

const harmonium = new Tone.Sampler({
  urls: {
    // A
    "A#3": "sounds/harmonium-a#3.wav",
    "A#4": "sounds/harmonium-a#4.wav",
    A3: "sounds/harmonium-a3.wav",
    A4: "sounds/harmonium-a4.wav",

    // B
    B3: "sounds/harmonium-b3.wav",
    B4: "sounds/harmonium-b4.wav",

    // C
    "C#3": "sounds/harmonium-c#3.wav",
    "C#4": "sounds/harmonium-c#4.wav",
    C3: "sounds/harmonium-c3.wav",
    C4: "sounds/harmonium-c4.wav",

    // D
    "D#3": "sounds/harmonium-d#3.wav",
    "D#4": "sounds/harmonium-d#4.wav",
    D3: "sounds/harmonium-d3.wav",
    D4: "sounds/harmonium-d4.wav",

    // E
    E3: "sounds/harmonium-e3.wav",
    E4: "sounds/harmonium-e4.wav",

    // F
    "F#3": "sounds/harmonium-f#3.wav",
    "F#4": "sounds/harmonium-f#4.wav",
    F3: "sounds/harmonium-f3.wav",
    F4: "sounds/harmonium-f4.wav",

    // G
    "G#3": "sounds/harmonium-g#3.wav",
    "G#4": "sounds/harmonium-g#4.wav",
    G3: "sounds/harmonium-g3.wav",
    G4: "sounds/harmonium-g4.wav",
  },
  release: 1.2,
  baseUrl: "/",
}).toDestination();

// Add light reverb for warmth
const reverb = new Tone.Reverb(2).toDestination();
harmonium.connect(reverb);

export async function initAudio() {
  if (Tone.context.state !== "running") await Tone.start();
  await Tone.loaded();
  console.log("✅ Samples loaded!");
}

export function playNote(note, pressure = 1) {
  const now = Tone.now();
  harmonium.triggerAttack(note, now);
  harmonium.volume.value = Tone.gainToDb(pressure);
}

export function stopNote(note) {
  const now = Tone.now();
  harmonium.triggerRelease(note, now);
}
