import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import VerticalYouTubeCarousel from '../components/VerticalYouTubeCarousel';
import { MediaPlaybackOrchestratorProvider } from '../context/MediaPlaybackOrchestrator';
import {
  INTERIOR_EXPERT_TIPS_VIDEO_IDS,
  SET_DESIGN_MEDIA_ITEMS,
} from '../data/motionMediaVideos';

export default function Commercials() {
  return (
    <MediaPlaybackOrchestratorProvider>
      <div className="min-h-[100svh] px-4 pb-16 pt-4 text-white md:px-8 md:pb-20 md:pt-10">
        <ReturnToPortfolioButton />

        <div className="relative isolate mx-auto max-w-4xl overflow-hidden glass-hub-sheet glass-hub-sheet--no-backdrop p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[linear-gradient(125deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.07)_14%,rgba(255,255,255,0.02)_26%,transparent_46%)] mix-blend-overlay"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[radial-gradient(120%_85%_at_0%_0%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_22%,transparent_55%)] mix-blend-soft-light"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[linear-gradient(305deg,transparent_62%,rgba(255,255,255,0.03)_82%,rgba(255,255,255,0.08)_100%)] opacity-90 mix-blend-overlay"
            aria-hidden
          />
          <div className="relative z-[2] isolate">
            <header className="mb-10 md:mb-12">
              <p className="text-xs font-semibold tracking-tight text-white">Motion media</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Commercial / set design & motion
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white md:text-base">
                Two vertical carousels<span className="text-white/90"> · </span>
                set work and interior tips. Use full screen for focus; CC toggles YouTube caption loading on the
                active embed.
              </p>
            </header>

            <div className="flex flex-col gap-16 md:gap-20">
              <VerticalYouTubeCarousel
                title="Commercial Set Design"
                mediaItems={SET_DESIGN_MEDIA_ITEMS}
                sectionLabel="Commercial Set Design"
              />
              <VerticalYouTubeCarousel
                title="Designer Videos w/ IKEA - Interior Design Expertise"
                videoIds={INTERIOR_EXPERT_TIPS_VIDEO_IDS}
                sectionLabel="Designer Videos w/ IKEA - Interior Design Expertise"
              />
            </div>
          </div>
        </div>
      </div>
    </MediaPlaybackOrchestratorProvider>
  );
}
