import ImmersiveMediaCarousel from '../components/ImmersiveMediaCarousel';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import { VISUALIZATION_3D_ITEMS } from '../data/visualization3dMedia';

export default function Visualization3D() {
  return (
    <div className="flex min-h-[100svh] min-w-0 flex-col px-4 pb-16 pt-4 text-white md:px-8 md:pb-20 md:pt-10">
      <ReturnToPortfolioButton />

      <div className="relative isolate mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden glass-hub-sheet glass-hub-sheet--no-backdrop p-6 md:min-h-0 md:p-10">
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

        <div className="relative z-[2] isolate flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="max-w-2xl shrink-0 pb-4 md:pb-5">
            <p className="text-xs font-semibold tracking-tight text-white">3D visualization</p>
            <h1 className="page-heading-xl mt-2 text-white">Immersive gallery</h1>
          </header>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <ImmersiveMediaCarousel items={VISUALIZATION_3D_ITEMS} />
          </div>
        </div>
      </div>
    </div>
  );
}
