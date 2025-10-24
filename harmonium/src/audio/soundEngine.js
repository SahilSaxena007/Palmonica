import * as Tone from "tone";

const synth = new Tone.Synth({
  oscillator: {
    type: "triangle", // smooth, harmonium-like tone
  },
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.8,
    release: 0.3,
  },
}).toDestination();

// Start Tone.js audio context (must be user-triggered)
export async function initAudio() {
  if (Tone.context.state !== "running") {
    await Tone.start();
    console.log("🎶 Audio context started");
  }
}

export function playNote(note, pressure = 1) {
  const now = Tone.now();
  synth.triggerAttack(note, now);
  synth.volume.value = Tone.gainToDb(pressure);
}

export function stopNote(note) {
  const now = Tone.now();
  synth.triggerRelease(now);
}

// Add to bottom of soundEngine.js temporarily:
window.initAudio = initAudio;
window.playNote = playNote;
window.stopNote = stopNote;
