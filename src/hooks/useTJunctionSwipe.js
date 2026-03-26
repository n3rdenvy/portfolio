import { useEffect, useRef } from 'react';

const THRESHOLD_PX = 56;
const AXIS_RATIO = 1.25;
const MAX_GESTURE_MS = 900;
const SCROLL_TOP_EPSILON = 24;

/**
 * Maps touch swipes to T-Junction navigation on `/`.
 * Center: swipe left → east, right → west, down → south.
 * Wing panels: opposite swipe returns home (south: only when scroll is at top).
 */
export function useTJunctionSwipe(containerRef, facet, go) {
  const startRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const onStart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      startRef.current = {
        x: t.clientX,
        y: t.clientY,
        id: t.identifier,
        time: Date.now(),
      };
    };

    const onEnd = (e) => {
      const start = startRef.current;
      if (!start) return;
      const touch = [...e.changedTouches].find((c) => c.identifier === start.id);
      startRef.current = null;
      if (!touch) return;

      const dt = Date.now() - start.time;
      if (dt > MAX_GESTURE_MS) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (facet === 'center') {
        if (absX < THRESHOLD_PX && absY < THRESHOLD_PX) return;
        if (absX >= absY * AXIS_RATIO) {
          if (dx < -THRESHOLD_PX) go('east');
          else if (dx > THRESHOLD_PX) go('west');
        } else if (absY >= absX * AXIS_RATIO) {
          if (dy > THRESHOLD_PX) go('south');
        }
        return;
      }

      if (facet === 'west') {
        if (absX >= absY * AXIS_RATIO && dx > THRESHOLD_PX) go('center');
        return;
      }

      if (facet === 'east') {
        if (absX >= absY * AXIS_RATIO && dx < -THRESHOLD_PX) go('center');
        return;
      }

      if (facet === 'south') {
        if (absY >= absX * AXIS_RATIO && dy < -THRESHOLD_PX && el.scrollTop < SCROLL_TOP_EPSILON) {
          go('center');
        }
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [containerRef, facet, go]);
}
