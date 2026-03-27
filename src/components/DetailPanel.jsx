export default function DetailPanel({ children, className = '' }) {
  return (
    <div className={['glass p-10', className].filter(Boolean).join(' ')}>{children}</div>
  );
}
