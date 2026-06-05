import PageShell from '../components/PageShell';
import ProcessStep from '../components/ProcessStep';
import ReturnToHub from '../components/ReturnToHub';

const STEPS = [
  {
    stepLabel: 'Step 01',
    description:
      'Discovery before design. Stakeholders mapped, data flows identified, failure modes catalogued before a single screen gets drawn. Screenshots will document the actual research workspace as it lands.',
  },
  {
    stepLabel: 'Step 02',
    description:
      'Synthesis turns interviews and telemetry into annotated flows. The annotations carry the rationale so design, engineering, and ops are already aligned when they read it, not after a meeting.',
  },
];

export default function Process() {
  return (
    <PageShell width="process">
      <ReturnToHub />
      <header className="glass mb-12 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Process
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white">
          Technical discovery, documented as paired artifacts: surface (UI) and annotation (rationale).
        </p>
      </header>
      <div className="space-y-16 md:space-y-20">
        {STEPS.map((s) => (
          <ProcessStep key={s.stepLabel} stepLabel={s.stepLabel} description={s.description} />
        ))}
      </div>
    </PageShell>
  );
}
