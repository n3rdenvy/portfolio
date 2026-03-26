import { motion } from 'framer-motion';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export default function InteriorCarousel({ images }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const left = Math.min(0, viewport.clientWidth - track.scrollWidth);
    setDragConstraints({ left, right: 0 });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return (
    <div ref={viewportRef} className="w-full overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex w-max cursor-grab gap-4 pb-2 active:cursor-grabbing"
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragMomentum
        aria-label="Interior gallery — drag horizontally to scroll"
        role="region"
      >
        {images.map((src, i) => (
          <div key={src} className="glass shrink-0 rounded-2xl p-2">
            <img
              src={src}
              alt={`Interior visualization ${i + 1}`}
              className="h-52 w-72 rounded-2xl object-cover sm:h-56 sm:w-80 md:h-64 md:w-96"
              draggable={false}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
