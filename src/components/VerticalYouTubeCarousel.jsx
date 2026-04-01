import {
  Captions,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useMediaPlaybackOrchestrator } from '../context/MediaPlaybackOrchestrator';

function buildEmbedSrc(videoId, captionsOn, { muted: m, autoplay: ap } = {}) {
  const p = new URLSearchParams({
    enablejsapi: '1',
    rel: '0',
    modestbranding: '1',
    /** iOS Safari: inline playback inside the page instead of forcing fullscreen-only. */
    playsinline: '1',
    cc_load_policy: captionsOn ? '1' : '0',
  });
  if (m) p.set('mute', '1');
  if (ap) p.set('autoplay', '1');
  if (typeof window !== 'undefined' && window.location?.origin) {
    p.set('origin', window.location.origin);
  }
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${p.toString()}`;
}

function postYouTubeCommand(iframe, func, args = []) {
  if (!iframe?.contentWindow) return;
  try {
    iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), 'https://www.youtube.com');
  } catch {
    /* ignore */
  }
}

const YT_ENDED = 0;
const YT_PLAYING = 1;

function normalizeItems(videoIds, mediaItems) {
  if (mediaItems?.length) return mediaItems;
  return (videoIds ?? []).map((id) => ({ type: 'youtube', id }));
}

export default function VerticalYouTubeCarousel({ title, videoIds, mediaItems, sectionLabel }) {
  const orch = useMediaPlaybackOrchestrator();
  const instanceId = useId().replace(/:/g, '');
  const [index, setIndex] = useState(0);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [muted, setMuted] = useState(false);
  const [autoplayCycle, setAutoplayCycle] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  /** >0 after first navigation with autoplay on — first slide loads without autoplay (avoids dual-carousel fights). */
  const [ytAutoplayNonce, setYtAutoplayNonce] = useState(0);

  const shellRef = useRef(null);
  const stageRef = useRef(null);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const headingId = useId();

  /** Desktop: show chrome while pointer is inside the video bounds (iframe does not bubble mouse events). */
  const [pointerInStage, setPointerInStage] = useState(false);
  const [toolbarFocusWithin, setToolbarFocusWithin] = useState(false);

  const interactedRef = useRef(false);
  const autoplayCycleRef = useRef(autoplayCycle);
  autoplayCycleRef.current = autoplayCycle;

  const items = normalizeItems(videoIds, mediaItems);
  const safeIndex = Math.min(index, Math.max(0, items.length - 1));
  const current = items[safeIndex];
  const isYoutube = current?.type === 'youtube';
  const videoId = isYoutube ? current.id : '';

  const goNext = useCallback(() => {
    interactedRef.current = true;
    if (autoplayCycle) setYtAutoplayNonce((n) => n + 1);
    setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [autoplayCycle, items.length]);

  const goPrev = useCallback(() => {
    interactedRef.current = true;
    if (autoplayCycle) setYtAutoplayNonce((n) => n + 1);
    setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [autoplayCycle, items.length]);

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  const pauseLocal = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      postYouTubeCommand(iframe, 'pauseVideo');
    }
    videoRef.current?.pause();
  }, []);

  useEffect(() => {
    if (!orch) return;
    return orch.register(instanceId, pauseLocal);
  }, [orch, instanceId, pauseLocal]);

  useEffect(() => {
    if (!isYoutube) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onMsg = (event) => {
      if (event.source !== iframe.contentWindow) return;
      if (typeof event.data !== 'string') return;
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data.event !== 'onStateChange' || data.info === undefined) return;
      if (data.info === YT_PLAYING) {
        orch?.claimPlayback(instanceId);
      }
      if (data.info === YT_ENDED && autoplayCycleRef.current) {
        goNextRef.current();
      }
    };

    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [isYoutube, videoId, captionsOn, ytAutoplayNonce, instanceId, orch]);

  const onYoutubeIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    postYouTubeCommand(iframe, 'addEventListener', ['onStateChange']);
  }, []);

  useEffect(() => {
    if (!isYoutube || !iframeRef.current?.contentWindow) return;
    postYouTubeCommand(iframeRef.current, muted ? 'mute' : 'unMute');
  }, [muted, isYoutube, videoId, captionsOn, ytAutoplayNonce]);

  useEffect(() => {
    if (isYoutube || !autoplayCycle || !videoRef.current) return;
    if (!interactedRef.current && safeIndex === 0) return;
    videoRef.current.play().catch(() => {});
  }, [isYoutube, safeIndex, current?.src, autoplayCycle]);

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

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const syncPointerInside = (clientX, clientY) => {
      const root = document.fullscreenElement ?? stageRef.current;
      if (!root || !mq.matches) return;
      const r = root.getBoundingClientRect();
      const inside =
        clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      setPointerInStage(inside);
    };

    const onMove = (e) => syncPointerInside(e.clientX, e.clientY);
    const onMq = () => {
      if (!mq.matches) setPointerInStage(false);
    };

    window.addEventListener('mousemove', onMove);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('mousemove', onMove);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const youtubeAutoplayInUrl = autoplayCycle && ytAutoplayNonce > 0;
  const embedSrc =
    isYoutube && videoId
      ? buildEmbedSrc(videoId, captionsOn, { muted, autoplay: youtubeAutoplayInUrl })
      : '';

  const handleFileVideoEnded = useCallback(() => {
    if (!autoplayCycleRef.current) return;
    goNextRef.current();
  }, []);

  if (!items.length) {
    return null;
  }

  const showDesktopChrome = pointerInStage || toolbarFocusWithin;

  const onToolbarBlur = (e) => {
    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;
    setToolbarFocusWithin(false);
  };

  return (
    <section className="flex flex-col gap-4" aria-labelledby={headingId}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={headingId} className="text-xl font-bold tracking-tight text-white md:text-2xl">
          {title}
        </h2>
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <span className="text-xs font-medium tabular-nums text-white" aria-live="polite">
            {safeIndex + 1} / {items.length}
          </span>
          {isYoutube && videoId ? (
            <a
              href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-white/90 underline decoration-white/35 underline-offset-2 transition-opacity hover:opacity-100 hover:decoration-white/70"
            >
              <ExternalLink className="size-3.5 shrink-0 opacity-90" aria-hidden />
              Open on YouTube
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 md:gap-4">
        <aside className="hidden shrink-0 flex-col justify-center md:flex">
          <button
            type="button"
            onClick={goPrev}
            className="btn-theme inline-flex size-12 items-center justify-center p-0 lg:size-14"
            aria-label={`Previous ${sectionLabel} video`}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <div
            ref={shellRef}
            className="frame-theme-media-embed relative aspect-video overflow-hidden p-2 md:p-3"
          >
            <div ref={stageRef} className="relative h-full w-full min-h-0 overflow-hidden rounded-xl bg-black">
              {isYoutube ? (
                <iframe
                  ref={iframeRef}
                  key={`${videoId}-${captionsOn}-${ytAutoplayNonce}`}
                  title={`${title}: video ${safeIndex + 1}`}
                  src={embedSrc}
                  onLoad={onYoutubeIframeLoad}
                  className="absolute inset-0 size-full rounded-xl bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <video
                  ref={videoRef}
                  key={current.src}
                  title={current.title ?? `${title}: video ${safeIndex + 1}`}
                  className="absolute inset-0 size-full rounded-xl bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  muted={muted}
                  onPlay={() => orch?.claimPlayback(instanceId)}
                  onEnded={handleFileVideoEnded}
                >
                  <source src={current.src} type="video/mp4" />
                </video>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden md:block">
                <div
                  role="toolbar"
                  aria-label={`${sectionLabel} player controls`}
                  onFocus={() => setToolbarFocusWithin(true)}
                  onBlur={onToolbarBlur}
                  className={`flex flex-wrap items-center justify-start gap-x-3 gap-y-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2 pb-2 pt-8 transition-opacity duration-300 ease-out motion-reduce:transition-none md:px-3 md:pb-3 md:pt-12 ${
                    showDesktopChrome ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <span
                    className="pointer-events-none size-2 shrink-0 rounded-full bg-[#ffc933] shadow-[0_0_10px_rgba(255,201,51,0.55)]"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="btn-theme inline-flex items-center gap-2 px-3 py-2 text-xs font-medium md:px-4 md:py-2.5 md:text-sm"
                    aria-pressed={muted}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? (
                      <VolumeX className="size-4 shrink-0" aria-hidden />
                    ) : (
                      <Volume2 className="size-4 shrink-0" aria-hidden />
                    )}
                    {muted ? 'Unmute' : 'Mute'}
                  </button>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-white md:text-sm">
                    <input
                      type="checkbox"
                      checked={autoplayCycle}
                      onChange={(e) => setAutoplayCycle(e.target.checked)}
                      className="size-4 shrink-0 rounded border-white/40 bg-slateBg/80 text-[#ffc933] focus:ring-2 focus:ring-white/30"
                    />
                    Autoplay
                  </label>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="btn-theme inline-flex items-center gap-2 px-3 py-2 text-xs font-medium md:px-4 md:py-2.5 md:text-sm"
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
                  {isYoutube ? (
                    <button
                      type="button"
                      onClick={toggleCaptions}
                      className="btn-theme inline-flex items-center gap-2 px-3 py-2 text-xs font-medium md:px-4 md:py-2.5 md:text-sm"
                      aria-pressed={captionsOn}
                      aria-label={captionsOn ? 'Turn captions off' : 'Turn captions on'}
                    >
                      <Captions className="size-4 shrink-0" aria-hidden />
                      CC {captionsOn ? 'on' : 'off'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div
            role="toolbar"
            aria-label={`${sectionLabel} player controls`}
            className="mt-3 flex flex-wrap items-center justify-start gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-[9.9px] md:hidden"
          >
            <span
              className="size-2 shrink-0 rounded-full bg-[#ffc933] shadow-[0_0_10px_rgba(255,201,51,0.55)]"
              aria-hidden
            />
            <button
              type="button"
              onClick={toggleMute}
              className="btn-theme inline-flex items-center gap-2 px-3 py-2 text-xs font-medium"
              aria-pressed={muted}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <VolumeX className="size-4 shrink-0" aria-hidden />
              ) : (
                <Volume2 className="size-4 shrink-0" aria-hidden />
              )}
              {muted ? 'Unmute' : 'Mute'}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-white">
              <input
                type="checkbox"
                checked={autoplayCycle}
                onChange={(e) => setAutoplayCycle(e.target.checked)}
                className="size-4 shrink-0 rounded border-white/40 bg-slateBg/80 text-[#ffc933] focus:ring-2 focus:ring-white/30"
              />
              Autoplay
            </label>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="btn-theme inline-flex items-center gap-2 px-3 py-2 text-xs font-medium"
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
            {isYoutube ? (
              <button
                type="button"
                onClick={toggleCaptions}
                className="btn-theme inline-flex items-center gap-2 px-3 py-2 text-xs font-medium"
                aria-pressed={captionsOn}
                aria-label={captionsOn ? 'Turn captions off' : 'Turn captions on'}
              >
                <Captions className="size-4 shrink-0" aria-hidden />
                CC {captionsOn ? 'on' : 'off'}
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex justify-center gap-3 md:hidden">
            <button
              type="button"
              onClick={goPrev}
              className="btn-theme inline-flex size-12 items-center justify-center p-0"
              aria-label={`Previous ${sectionLabel} video`}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="btn-theme inline-flex size-12 items-center justify-center p-0"
              aria-label={`Next ${sectionLabel} video`}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <aside className="hidden shrink-0 flex-col justify-center md:flex">
          <button
            type="button"
            onClick={goNext}
            className="btn-theme inline-flex size-12 items-center justify-center p-0 lg:size-14"
            aria-label={`Next ${sectionLabel} video`}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </aside>
      </div>
    </section>
  );
}
