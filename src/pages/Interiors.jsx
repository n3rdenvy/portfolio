import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';

export default function Interiors() {
  return (
    <PageShell width="compact">
      <ReturnToHub />
      <div className="glass rounded-2xl p-10">
        <h1 className="text-lg font-semibold tracking-tight text-white">Interiors</h1>
        <p className="mt-4 text-sm text-white">Interiors page — content TBD.</p>
      </div>
    </PageShell>
  );
}
