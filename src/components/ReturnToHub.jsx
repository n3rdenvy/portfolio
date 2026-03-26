import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function ReturnToHub() {
  return (
    <Link
      to="/"
      className="fixed top-8 left-8 z-50 glass px-4 py-2 flex items-center gap-2 hover:bg-white/10 hover:text-accent transition-all text-textPrimary"
    >
      <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      Home
    </Link>
  );
}
