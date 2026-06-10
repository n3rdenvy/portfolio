import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageShell from '../components/PageShell';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Erik Smith';
  }, []);

  return (
    <PageShell width="narrow">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">404</p>
        <h1 className="page-heading-xl text-white">Nothing lives here.</h1>
        <p className="max-w-md text-sm leading-relaxed text-white/70">
          The link was wrong or the page moved on. Everything that exists is one click away.
        </p>
        <Link
          to="/"
          className="btn-theme btn-theme-contact-send flex items-center gap-2 text-sm font-semibold no-underline"
        >
          <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          Back to the start
        </Link>
      </div>
    </PageShell>
  );
}
