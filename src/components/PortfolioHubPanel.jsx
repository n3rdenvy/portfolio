import { Activity, Box, Clapperboard, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import PageShell from './PageShell';
import PortfolioHubCard from './PortfolioHubCard';
import ReturnToHub from './ReturnToHub';
import HubPageHeading, { HubPageHeadingRow } from './HubPageHeading';

const listVariants = {
  visible: (reduceMotion) => ({
    transition: reduceMotion ? {} : { staggerChildren: 0.08 },
  }),
  hidden: {},
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.22, 1, 0.36, 1], duration: 0.45 },
  },
};

const PORTFOLIO_HUB_CARDS = [
  {
    to: '/commercials',
    title: 'Set Design + Designer Tips',
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
    description:
      'Real-time agentic navigation and proactive routing systems for the modern commuter.',
    icon: Activity,
  },
  {
    to: '/coming-soon',
    title: 'Future Projects',
    description:
      "New case studies and experiments in the pipeline. Plus other projects I'm having fun with right now.",
    icon: Sparkles,
  },
];

export default function PortfolioHubPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <PageShell width="process">
      <ReturnToHub mobileLayout="pill-end" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-20 pt-4 max-md:pt-[3.85rem] md:pt-8">
        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="Portfolio hub"
              subtitle="Pick a stream to open its detail page."
            />
          </div>
        </HubPageHeadingRow>

        <div className="mt-6 flex min-h-0 min-w-0 flex-1 flex-col justify-center max-md:mt-5 md:mt-8 lg:mt-6">
          <motion.ul
            className="mx-auto grid w-full max-w-[min(100%,40rem)] grid-cols-1 gap-y-5 md:max-w-[min(100%,42rem)] md:grid-cols-2 md:gap-x-8 md:gap-y-5 md:items-stretch lg:max-w-[min(100%,44rem)] lg:gap-x-10"
            variants={listVariants}
            custom={reduceMotion}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            {PORTFOLIO_HUB_CARDS.map((card) => (
              <motion.li
                key={card.to}
                variants={reduceMotion ? {} : itemVariants}
                className="flex min-h-0 min-w-0 max-md:flex-1 max-md:basis-0 md:h-full"
              >
                <PortfolioHubCard
                  to={card.to}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  badge={card.badge}
                />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </PageShell>
  );
}
