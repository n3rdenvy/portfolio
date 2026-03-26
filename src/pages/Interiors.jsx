import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';

export default function Interiors() {
  return (
    <PageShell width="compact">
      <ReturnToHub />
      <div className="glass rounded-2xl p-10">
        <h1 className="text-lg font-semibold uppercase tracking-widest text-accent">Interiors</h1>
        <p className="mt-4 text-sm text-textSecondary">Interiors page — content TBD.</p>
      </div>
    </PageShell>
  );
}
