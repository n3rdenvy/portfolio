import { useEffect, useRef, useState } from 'react';

const FRAMES = [
  { src: '/devtools/ignus/white_mesh.png',     hold: 2000 },
  { src: '/devtools/ignus/flame25.png',         hold: 800  },
  { src: '/devtools/ignus/flame50.png',         hold: 600  },
  { src: '/devtools/ignus/flame75.png',         hold: 600  },
  { src: '/devtools/ignus/full_flame_real.png', hold: 2200 },
  { src: '/devtools/ignus/flame75.png',         hold: 600  },
  { src: '/devtools/ignus/flame50.png',         hold: 600  },
  { src: '/devtools/ignus/flame25.png',         hold: 800  },
];

const FADE = 400; // ms cross-fade between frames

export function IgnusFlameCanvas() {
  const [cur, setCur]     = useState(0);
  const [next, setNext]   = useState(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    function advance() {
      const nextIdx = (cur + 1) % FRAMES.length;
      setNext(nextIdx);
      setFading(true);

      // After fade completes, commit the new frame
      timerRef.current = setTimeout(() => {
        setCur(nextIdx);
        setNext(null);
        setFading(false);

        // Hold then advance again
        timerRef.current = setTimeout(advance, FRAMES[nextIdx].hold);
      }, FADE);
    }

    timerRef.current = setTimeout(advance, FRAMES[cur].hold);
    return () => clearTimeout(timerRef.current);
  }, [cur]);

  return (
    <div className="relative w-full h-full">
      {/* Current frame */}
      <img
        src={FRAMES[cur].src}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE}ms ease-in-out` }}
      />

      {/* Next frame fades in */}
      {next !== null && (
        <img
          src={FRAMES[next].src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: fading ? 1 : 0, transition: `opacity ${FADE}ms ease-in-out` }}
        />
      )}
    </div>
  );
}
