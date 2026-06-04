import ImmersiveMediaCarousel from '../components/ImmersiveMediaCarousel';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import { VISUALIZATION_3D_ITEMS } from '../data/visualization3dMedia';

export default function Visualization3D() {
  return (
    <div className="flex min-h-[100svh] min-w-0 flex-col px-4 pb-16 pt-4 text-white md:px-8 md:pb-20 md:pt-10">
      <ReturnToPortfolioButton />

      <div className="relative isolate mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden glass-hub-sheet glass-hub-sheet--no-backdrop p-6 md:min-h-0 md:p-10">
        <div className="relative isolate flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="max-w-2xl shrink-0 pb-4 md:pb-5">
            <p className="text-xs font-semibold tracking-tight text-white">3D visualization</p>
            <h1 className="page-heading-xl mt-2 text-white">Immersive gallery</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              3D renders as a pre-decision tool. The underlying problem in furniture retail is that most
              customers cannot confidently visualize a product in their own space — so they either overbuy
              and return, or they walk away unsure. These renders close that gap: showing not just what a
              product looks like, but how a configured room feels to be in. The goal was always a
              confident yes, not a hedged maybe.
            </p>
          </header>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <ImmersiveMediaCarousel items={VISUALIZATION_3D_ITEMS} />
          </div>
        </div>
      </div>
    </div>
  );
}
