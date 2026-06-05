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
          <div className="relative isolate">
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

            <div className="mb-12 grid gap-4 md:mb-14 md:grid-cols-2 md:gap-6">
              <div className="glass-hub-sheet rounded-xl p-5 md:p-6">
                <p className="mb-1 text-xs font-semibold tracking-tight text-white/60">Commercial set design</p>
                <p className="text-sm leading-relaxed text-white/90">
                  These spots required designing environments that read correctly on camera under studio lighting,
                  a different constraint than designing a room to live in. The spatial decisions are the same
                  (sightlines, material contrast, focal anchors), but the success metric shifts from
                  &ldquo;how does this feel to be in&rdquo; to &ldquo;how does this read at 24fps.&rdquo;
                </p>
              </div>
              <div className="glass-hub-sheet rounded-xl p-5 md:p-6">
                <p className="mb-1 text-xs font-semibold tracking-tight text-white/60">IKEA expert videos</p>
                <p className="text-sm leading-relaxed text-white/90">
                  The interior tips series is customer education focused on reducing the gap between seeing a product in a
                  showroom and knowing how to actually use it at home. The design challenge is communicating
                  spatial logic in two minutes to someone who has never thought about sightlines or material
                  tension before.
                </p>
              </div>
            </div>

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
