import { useState, useEffect, useRef } from "react";

export function useBreathTracking(isActive = true) {
  const [pressure, setPressure] = useState(0);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    let isMounted = true;
    let stream;

    async function initMic() {
      try {
        audioCtxRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtxRef.current.createMediaStreamSource(stream);

        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 1024;
        const dataArray = new Uint8Array(analyser.fftSize);
        source.connect(analyser);
        analyserRef.current = analyser;

        function update() {
          if (!isMounted) return;
          analyser.getByteTimeDomainData(dataArray);

          let sumSquares = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const val = (dataArray[i] - 128) / 128;
            sumSquares += val * val;
          }
          const rms = Math.sqrt(sumSquares / dataArray.length);
          const p = Math.min(1, Math.max(0, (rms - 0.02) * 12));
          setPressure(p);

          requestAnimationFrame(update);
        }
        update();
      } catch (err) {
        console.error("🎤 Microphone access denied:", err);
      }
    }

    initMic();

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [isActive]);

  return pressure;
}
