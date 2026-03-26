export default function DetailPanel({ children, className = '' }) {
  return (
    <div className={['glass border-white/10 p-10', className].filter(Boolean).join(' ')}>{children}</div>
  );
}
