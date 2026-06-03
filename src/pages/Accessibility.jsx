import FlipFeatureCard from '../components/FlipFeatureCard';
import PageShell from '../components/PageShell';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';

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
      <ReturnToPortfolioButton />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-24 pt-4 max-md:pt-[3.85rem] md:pt-8">
        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="Accessibility strategy"
              subtitle="Five capability lenses — flip each card to read the thesis. Keyboard: Tab to focus, Enter or Space to flip."
            />
          </div>
        </HubPageHeadingRow>

        <div className="mt-8 md:mt-10">
          <div className="glass-hub-sheet p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {CARDS.map((c) => (
                <FlipFeatureCard key={c.title} title={c.title} body={c.body} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
