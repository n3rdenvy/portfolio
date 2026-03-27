import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import VerticalYouTubeCarousel from '../components/VerticalYouTubeCarousel';
import {
  INTERIOR_EXPERT_TIPS_VIDEO_IDS,
  SET_DESIGN_VIDEO_IDS,
} from '../data/motionMediaVideos';

export default function Commercials() {
  return (
    <div className="min-h-[100svh] bg-slateBg px-4 pb-16 pt-20 text-white md:px-8 md:pb-20 md:pt-24">
      <ReturnToPortfolioButton />

      <header className="mx-auto mb-12 max-w-4xl">
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

      <div className="mx-auto flex max-w-4xl flex-col gap-16 md:gap-20">
        <VerticalYouTubeCarousel
          title="Set Design"
          videoIds={SET_DESIGN_VIDEO_IDS}
          sectionLabel="Set Design"
        />
        <VerticalYouTubeCarousel
          title="Interior Expert Tips"
          videoIds={INTERIOR_EXPERT_TIPS_VIDEO_IDS}
          sectionLabel="Interior Expert Tips"
        />
      </div>
    </div>
  );
}
