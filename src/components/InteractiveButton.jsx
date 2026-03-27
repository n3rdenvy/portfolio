import { createElement } from 'react';

/**
 * T-Junction and in-app controls: `.btn-theme` (transparent; white typography).
 */
export default function InteractiveButton({ as = 'button', className = '', children, ...props }) {
  return createElement(
    as,
    { className: ['btn-theme', className].filter(Boolean).join(' '), ...props },
    children,
  );
}
