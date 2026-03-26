import { LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnToPortfolioButton() {
  return (
    <div className="pointer-events-none fixed left-4 top-20 z-[110] md:left-6 md:top-24">
      <Link
        to="/?wing=east"
        className="pointer-events-auto inline-flex items-center gap-2 btn-theme px-4 py-2.5 text-sm font-medium no-underline"
      >
        <LayoutGrid className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Return to Portfolio
      </Link>
    </div>
  );
}
