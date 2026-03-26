export default function ProcessStep({ stepLabel, description }) {
  return (
    <article className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
      <div className="glass flex min-h-[min(40vh,22rem)] flex-1 flex-col rounded-2xl p-6 lg:min-h-[20rem] lg:flex-[1.4]">
        <div className="flex min-h-[12rem] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-accent/35 bg-accent/[0.06]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-textSecondary">
            UI screenshot · placeholder
          </span>
        </div>
      </div>
      <div className="glass flex flex-1 flex-col rounded-2xl p-6 lg:max-w-md lg:flex-none">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-textSecondary">{stepLabel}</p>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-accent">Technical Discovery</h2>
        <p className="mt-3 text-sm leading-relaxed text-textSecondary">{description}</p>
      </div>
    </article>
  );
}
