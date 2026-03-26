import FlipFeatureCard from '../components/FlipFeatureCard';
import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';

const CARDS = [
  {
    title: 'WCAG 2.1 Compliance',
    body: 'Strict adherence to contrast ratios and keyboard logic.',
  },
  {
    title: 'Adaptive Interface Agency',
    body: 'Integrated OpenDyslexic and sensory shaping for total neurodivergent environment agency.',
  },
  {
    title: 'Chronopsychology',
    body: 'Circadian-aligned UI shifts reducing cognitive friction.',
  },
  {
    title: 'Incentivized Personalization',
    body: 'Visual Trophies unlocked via peer-validated data to drive retention.',
  },
  {
    title: 'UX Localization',
    body: 'Contextual translation framework for Spanish, French, and Chinese transit terminology.',
  },
];

export default function Accessibility() {
  return (
    <PageShell>
      <ReturnToHub />
      <header className="glass mb-10 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-accent md:text-3xl">Accessibility strategy</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-textSecondary">
          Five capability lenses—flip each card to read the thesis. Keyboard: Tab to focus, Enter or Space
          to flip.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <FlipFeatureCard key={c.title} title={c.title} body={c.body} />
        ))}
      </div>
    </PageShell>
  );
}
