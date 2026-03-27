import { motion } from 'framer-motion';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const MotionDiv = motion.div;

const DRAG_CLICK_THRESHOLD_PX = 12;

export default function InteriorCarousel({ images, linkTo }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const dragMovedPastThresholdRef = useRef(false);
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
      <MotionDiv
        ref={trackRef}
        className="flex w-max cursor-grab gap-4 pb-2 active:cursor-grabbing"
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragMomentum
        onDragStart={() => {
          dragMovedPastThresholdRef.current = false;
        }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) >= DRAG_CLICK_THRESHOLD_PX) {
            dragMovedPastThresholdRef.current = true;
          }
        }}
        aria-label="Interior gallery — drag horizontally to scroll"
        role="region"
      >
        {images.map((src, i) => {
          const inner = (
            <img
              src={src}
              alt={linkTo ? '' : `Interior visualization ${i + 1}`}
              className="h-52 w-72 rounded-2xl object-cover sm:h-56 sm:w-80 md:h-64 md:w-96"
              draggable={false}
            />
          );
          const shellClass =
            'glass shrink-0 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-slateBg';

          if (linkTo) {
            return (
              <Link
                key={src}
                to={linkTo}
                className={`${shellClass} block cursor-pointer no-underline transition-opacity hover:opacity-95`}
                aria-label={`Open 3D visualization portfolio — preview ${i + 1} of ${images.length}`}
                onClick={(e) => {
                  if (dragMovedPastThresholdRef.current) {
                    e.preventDefault();
                    dragMovedPastThresholdRef.current = false;
                  }
                }}
              >
                {inner}
              </Link>
            );
          }

          return (
            <div key={src} className={shellClass}>
              {inner}
            </div>
          );
        })}
      </MotionDiv>
    </div>
  );
}
