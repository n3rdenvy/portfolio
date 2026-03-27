import { Captions, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

function buildEmbedSrc(videoId, captionsOn) {
  const p = new URLSearchParams({
    enablejsapi: '1',
    rel: '0',
    modestbranding: '1',
    cc_load_policy: captionsOn ? '1' : '0',
  });
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${p.toString()}`;
}

export default function VerticalYouTubeCarousel({ title, videoIds, sectionLabel }) {
  const [index, setIndex] = useState(0);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const shellRef = useRef(null);
  const headingId = useId();
  const safeIndex = Math.min(index, Math.max(0, videoIds.length - 1));
  const videoId = videoIds[safeIndex] ?? '';

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? videoIds.length - 1 : i - 1));
  }, [videoIds.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= videoIds.length - 1 ? 0 : i + 1));
  }, [videoIds.length]);

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCaptions = useCallback(() => {
    setCaptionsOn((c) => !c);
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  if (!videoIds.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby={headingId}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={headingId} className="text-xl font-bold tracking-tight text-white md:text-2xl">
          {title}
        </h2>
        <span className="text-xs font-medium tabular-nums text-white" aria-live="polite">
          {safeIndex + 1} / {videoIds.length}
        </span>
      </div>

      <div className="flex gap-2 md:gap-4">
        <aside className="hidden shrink-0 flex-col justify-center md:flex">
          <button
            type="button"
            onClick={goPrev}
            className="btn-theme inline-flex size-12 items-center justify-center p-0 lg:size-14"
            aria-label={`Previous ${sectionLabel} video`}
          >
            <ChevronUp className="size-5" aria-hidden />
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <div ref={shellRef} className="frame-theme-media aspect-video overflow-hidden p-2 md:p-3">
            <iframe
              key={`${videoId}-${captionsOn ? 'cc' : 'no-cc'}`}
              title={`${title}: video ${safeIndex + 1}`}
              src={buildEmbedSrc(videoId, captionsOn)}
              className="size-full rounded-xl bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-between">
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="btn-theme inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                  aria-pressed={fullscreen}
                  aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  {fullscreen ? (
                    <Minimize2 className="size-4 shrink-0" aria-hidden />
                  ) : (
                    <Maximize2 className="size-4 shrink-0" aria-hidden />
                  )}
                  {fullscreen ? 'Exit' : 'Full screen'}
                </button>
                <button
                  type="button"
                  onClick={toggleCaptions}
                  className="btn-theme inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                  aria-pressed={captionsOn}
                  aria-label={captionsOn ? 'Turn captions off' : 'Turn captions on'}
                >
                  <Captions className="size-4 shrink-0" aria-hidden />
                  CC {captionsOn ? 'on' : 'off'}
                </button>
              </div>
              <button
                type="button"
                onClick={goNext}
                className="btn-theme hidden items-center gap-2 px-4 py-2.5 text-sm font-medium md:inline-flex"
                aria-label={`Next ${sectionLabel} video`}
              >
                Next
                <ChevronDown className="size-4" aria-hidden />
              </button>
            </div>

            <div className="flex justify-center gap-3 md:hidden">
              <button
                type="button"
                onClick={goPrev}
                className="btn-theme inline-flex size-12 items-center justify-center p-0"
                aria-label={`Previous ${sectionLabel} video`}
              >
                <ChevronUp className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="btn-theme inline-flex size-12 items-center justify-center p-0"
                aria-label={`Next ${sectionLabel} video`}
              >
                <ChevronDown className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <aside className="hidden shrink-0 flex-col justify-center md:flex">
          <button
            type="button"
            onClick={goNext}
            className="btn-theme inline-flex size-12 items-center justify-center p-0 lg:size-14"
            aria-label={`Next ${sectionLabel} video`}
          >
            <ChevronDown className="size-5" aria-hidden />
          </button>
        </aside>
      </div>
    </section>
  );
}
