import * as Tone from "tone";

const harmonium = new Tone.Sampler({
  urls: {
    // A
    "A#2": "sounds/harmonium-a#2.wav",
    "A#3": "sounds/harmonium-a#3.wav", // NOT WORKING
    "A#4": "sounds/harmonium-a#4.wav", // NOT WORKING
    A2: "sounds/harmonium-a2.wav", // no mapping at all
    A3: "sounds/harmonium-a3.wav", // NOT WORKING
    A4: "sounds/harmonium-a4.wav",

    // B
    B2: "sounds/harmonium-b2.wav", // no mapping at all
    B3: "sounds/harmonium-b3.wav", // NOT WORKING
    B4: "sounds/harmonium-b4.wav",

    // C
    "C#2": "sounds/harmonium-c#2.wav",
    "C#3": "sounds/harmonium-c#3.wav", // NOT WORKING
    "C#4": "sounds/harmonium-c#4.wav", // NOT WORKING
    "C#5": "sounds/harmonium-c#5.wav", // no mapping at all
    C2: "sounds/harmonium-c2.wav", // no mapping at all
    C3: "sounds/harmonium-c3.wav", // w
    C4: "sounds/harmonium-c4.wav",
    C5: "sounds/harmonium-c5.wav", // no mapping at all

    // D
    "D#2": "sounds/harmonium-d#2.wav",
    "D#3": "sounds/harmonium-d#3.wav", // NOT WORKING
    "D#4": "sounds/harmonium-d#4.wav", // NOT WORKING
    D2: "sounds/harmonium-d2.wav", // no mapping at all
    D3: "sounds/harmonium-d3.wav", //not working
    D4: "sounds/harmonium-d4.wav",
    D5: "sounds/harmonium-d5.wav", // no mapping at all

    // E
    E2: "sounds/harmonium-e2.wav", // no mapping at all
    E3: "sounds/harmonium-e3.wav", //NOT
    E4: "sounds/harmonium-e4.wav",

    // F
    "F#2": "sounds/harmonium-f#2.wav",
    "F#3": "sounds/harmonium-f#3.wav", // NOT WORKING
    "F#4": "sounds/harmonium-f#4.wav", // NOT WORKING
    F2: "sounds/harmonium-f2.wav", // no mapping at all
    F3: "sounds/harmonium-f3.wav", //w
    F4: "sounds/harmonium-f4.wav",

    // G
    "G#2": "sounds/harmonium-g#2.wav",
    "G#3": "sounds/harmonium-g#3.wav", // NOT WORKING
    "G#4": "sounds/harmonium-g#4.wav", // NOT WORKING
    G2: "sounds/harmonium-g2.wav", // no mapping at all
    G3: "sounds/harmonium-g3.wav", // NOT WORKING
    G4: "sounds/harmonium-g4.wav",
  },
  release: 1.2,
  baseUrl: "/",
}).toDestination();

// Add light reverb for realism
const reverb = new Tone.Reverb(2).toDestination();
harmonium.connect(reverb);

// init + sample loading
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
