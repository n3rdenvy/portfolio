import { Mail } from 'lucide-react';
import InteractiveButton from './InteractiveButton';

const DEFAULT_MAIL = 'mailto:erik@example.com';

export default function ContactButton({ href = DEFAULT_MAIL }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] md:bottom-6 md:right-6">
      <InteractiveButton
        as="a"
        href={href}
        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium no-underline"
      >
        <Mail className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        <span>Erik + Email</span>
      </InteractiveButton>
    </div>
  );
}
