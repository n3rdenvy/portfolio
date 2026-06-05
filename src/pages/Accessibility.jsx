import FlipFeatureCard from '../components/FlipFeatureCard';
import PageShell from '../components/PageShell';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';

const CARDS = [
  {
    title: 'WCAG 2.1 Compliance',
    body: 'Contrast ratios hit WCAG 2.1 minimum. Every interactive element reachable and operable by keyboard alone.',
  },
  {
    title: 'Adaptive Interface Agency',
    body: 'OpenDyslexic toggle and sensory controls built in. Users reshape the environment to fit their brain, not the other way around.',
  },
  {
    title: 'Chronopsychology',
    body: 'Warm and dark theme shifts that track the light cycle. Less friction at night without requiring a manual toggle.',
  },
  {
    title: 'Incentivized Personalization',
    body: 'Rewards tied to verified rider contributions. The more accurate data you submit, the more the app works for you.',
  },
  {
    title: 'UX Localization',
    body: 'Transit terminology localized for Spanish, French, and Chinese speakers. Built for context, not just vocabulary.',
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
              subtitle="Five capability lenses. Flip each card to read the thesis. Keyboard: Tab to focus, Enter or Space to flip."
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
