import ImmersiveMediaCarousel from '../components/ImmersiveMediaCarousel';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import { VISUALIZATION_3D_ITEMS } from '../data/visualization3dMedia';

export default function Visualization3D() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-slateBg text-textPrimary">
      <ReturnToPortfolioButton />

      <header className="shrink-0 px-4 pb-2 pt-28 md:px-8 md:pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-textSecondary">3D visualization</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-textPrimary md:text-2xl">Immersive gallery</h1>
        <p className="mt-1 text-xs text-textSecondary md:text-sm">
          Arrow keys · on-screen controls — media scales to available viewport.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <ImmersiveMediaCarousel items={VISUALIZATION_3D_ITEMS} />
      </div>
    </div>
  );
}
