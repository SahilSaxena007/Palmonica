import { useEffect, useState, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export function useHandTracking() {
  const [pressure, setPressure] = useState(0);
  const lastZ = useRef(null);
  const lastTime = useRef(null);
  const pressureRef = useRef(0);

  useEffect(() => {
    const videoElement = document.getElementById("input_video");

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      const now = performance.now();
      const decayRate = 0.01; // how fast air leaks
      const k = 8; // sensitivity to velocity

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const palm = results.multiHandLandmarks[0][9];
        const z = palm.z;
        if (lastZ.current !== null && lastTime.current !== null) {
          const dt = (now - lastTime.current) / 1000;
          const velocity = (lastZ.current - z) / dt; // positive = moving closer
          pressureRef.current = Math.max(
            0,
            Math.min(1, pressureRef.current + k * velocity * dt - decayRate)
          );
          setPressure(pressureRef.current);
        }
        lastZ.current = z;
        lastTime.current = now;
      } else {
        // no hand → leak air gradually
        pressureRef.current = Math.max(0, pressureRef.current - 0.02);
        setPressure(pressureRef.current);
        lastZ.current = null;
        lastTime.current = null;
      }
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => camera.stop();
  }, []);

  return pressure;
}
