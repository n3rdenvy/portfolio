import { Activity, Box, Clapperboard, Sparkles } from 'lucide-react';
import PageShell from './PageShell';
import PortfolioHubCard from './PortfolioHubCard';
import ReturnToHub from './ReturnToHub';
import HubPageHeading, { HubPageHeadingRow } from './HubPageHeading';

const PORTFOLIO_HUB_CARDS = [
  {
    to: '/commercials',
    title: 'Commercials & Interior Expertise',
    description: 'Spec work, commissioned motion, and set-forward visual systems.',
    icon: Clapperboard,
  },
  {
    to: '/3d-visualization',
    title: '3D Visualization Portfolio',
    description: 'Spatial studies, materials, and real-time presentation frames.',
    icon: Box,
  },
  {
    to: '/transit-pulse-ax',
    title: 'Transit Pulse AX App',
    description: 'Application shell, accessibility posture, and operational telemetry UX.',
    icon: Activity,
  },
  {
    to: '/coming-soon',
    title: 'Coming Soon',
    description: 'New case studies and experiments in the pipeline.',
    icon: Sparkles,
    badge: 'Soon',
  },
];

export default function PortfolioHubPanel() {
  return (
    <PageShell width="process">
      <ReturnToHub mobileLayout="pill-end" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-20 pt-4 max-md:pt-[3.85rem] md:pt-8">
        <HubPageHeadingRow>
          <HubPageHeading
            title="Portfolio hub"
            subtitle="Pick a stream to open its detail page."
          />
        </HubPageHeadingRow>

        <div className="mt-6 flex min-h-0 min-w-0 flex-1 flex-col justify-center max-md:mt-5 md:mt-8 lg:mt-6">
          <ul className="mx-auto grid w-full max-w-[min(100%,40rem)] grid-cols-1 gap-y-5 md:max-w-[min(100%,42rem)] md:grid-cols-2 md:gap-x-8 md:gap-y-5 md:items-stretch lg:max-w-[min(100%,44rem)] lg:gap-x-10">
            {PORTFOLIO_HUB_CARDS.map((card) => (
              <li
                key={card.to}
                className="flex min-h-0 min-w-0 max-md:flex-1 max-md:basis-0 md:h-full"
              >
                <PortfolioHubCard
                  to={card.to}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  badge={card.badge}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
