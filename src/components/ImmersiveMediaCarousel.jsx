import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function ImmersiveMediaCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const n = items.length;
  const safe = n ? index % n : 0;
  const item = items[safe];

  const prev = useCallback(() => {
    if (!n) return;
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const next = useCallback(() => {
    if (!n) return;
    setIndex((i) => (i + 1) % n);
  }, [n]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!n || !item) {
    return null;
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 pt-2 md:px-6">
        <div className="frame-theme-media relative flex h-full max-h-[min(78svh,100%)] w-full max-w-[min(100%,180vh)] items-center justify-center overflow-hidden p-1 md:p-2">
          {item.type === 'image' ? (
            <img
              src={item.src}
              alt={item.alt ?? ''}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          ) : (
            <video
              key={item.src}
              src={item.src}
              className="max-h-full max-w-full object-contain"
              controls
              playsInline
              preload="metadata"
            />
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <button
          type="button"
          onClick={prev}
          className="btn-theme inline-flex size-12 items-center justify-center p-0 md:size-14"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <span className="min-w-[4.5rem] text-center text-xs font-medium tabular-nums text-white">
          {safe + 1} / {n}
        </span>
        <button
          type="button"
          onClick={next}
          className="btn-theme inline-flex size-12 items-center justify-center p-0 md:size-14"
          aria-label="Next slide"
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>
    </div>
  );
}
