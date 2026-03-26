import { Link } from 'react-router-dom';

/**
 * Hub tile: `btn-theme` + `portfolio-hub-card` hover/focus (shark slate theme).
 */
export default function PortfolioHubCard({ to, title, description, icon: Icon, badge }) {
  return (
    <Link
      to={to}
      className={['btn-theme', 'portfolio-hub-card', 'h-full min-h-0 w-full p-6 md:p-8'].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon ? (
          <Icon className="size-9 shrink-0 text-accent" strokeWidth={1.35} aria-hidden />
        ) : null}
        {badge ? (
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-textPrimary">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="min-h-0">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-textPrimary md:text-lg">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-200 text-pretty">{description}</p>
        ) : null}
      </div>
    </Link>
  );
}
