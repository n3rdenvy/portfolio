import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';
import AiBadge from '../components/AiBadge';
import PageShell from '../components/PageShell';
import { TRANSIT_PULSE_PROTOTYPE_URL } from '../data/transitPulseAx';

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{children}</p>
  );
}

function PersonaCard({ name, role, age, quote, priorities }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-white/45">{age} · {role}</p>
      </div>
      <p className="text-xs leading-relaxed text-white/60 italic">"{quote}"</p>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1.5">Needs first</p>
        <ul className="space-y-1">
          {priorities.map((p, i) => (
            <li key={i} className="flex gap-2 text-xs text-white/55">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400/50" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PainCluster({ title, points }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-semibold text-white mb-2">{title}</p>
      <ul className="space-y-1">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-xs text-white/50 leading-snug">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/20" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionRow({ decision, why }) {
  return (
    <div className="flex gap-4 border-b border-white/[0.06] py-3 last:border-0">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/50" />
      <div>
        <p className="text-sm text-white">{decision}</p>
        <p className="mt-0.5 text-xs text-white/45 leading-relaxed">{why}</p>
      </div>
    </div>
  );
}

const PERSONAS = [
  {
    name: 'Nadia W.',
    role: 'Psychology Student',
    age: 28,
    quote: 'If a wait is over 15 minutes, I am out.',
    priorities: ['Verified stop safety and lighting data', 'Low-density car selection before boarding'],
  },
  {
    name: 'Marcus S.',
    role: 'Substitute Teacher',
    age: 29,
    quote: 'I need to know the train is actually coming, not just that it is supposed to.',
    priorities: ['Real-time location verification from other riders', 'Contributor reputation to trust the data'],
  },
  {
    name: 'Theo D.',
    role: 'Instructional Designer',
    age: 28,
    quote: 'If I cannot get a seat, I am turning around and going home.',
    priorities: ['Live car density before the train arrives', 'Baseline travel time to plan departure precisely'],
  },
  {
    name: 'Dana H.',
    role: 'Graphic Designer',
    age: 40,
    quote: 'I walk further just to avoid a stop I know is bad.',
    priorities: ['Block-by-block GPS tracking, not a countdown', 'Stop safety ratings from other riders'],
  },
];

const PAIN_CLUSTERS = [
  {
    title: 'The Trust Gap',
    points: [
      'Official apps report ghost buses as real arrivals',
      'Google Maps data trails reality by minutes',
      'Users check 2-3 apps per trip because no single one is reliable',
      'Peer-reported data trusted over official schedules',
    ],
  },
  {
    title: 'The Limbo Trigger',
    points: [
      'Frustration threshold hits at 15-20 minutes regardless of user',
      'Useless countdown timers when the vehicle is not moving',
      'Missing one bus on a long-cycle route is catastrophic',
      'Block-by-block movement needed to reduce stop exposure time',
    ],
  },
  {
    title: 'Sensory and Social Load',
    points: [
      'Lighting at stops is a primary safety filter, especially for solo travelers',
      'Preference for low-occupancy cars for sensory management',
      'Immediate departure from poorly lit or crowded stops',
      'Situational safety determines boarding decisions before arrival times',
    ],
  },
  {
    title: 'The Productivity Extension',
    points: [
      'Two-car trains almost guarantee no available seat',
      'Trains used as mobile workspaces — inability to sit = commute failure',
      'Baseline travel time display expected by default',
      'Seat availability is a go/no-go decision factor',
    ],
  },
  {
    title: 'Accountability and Professional Impact',
    points: [
      'Users need verifiable proof of delay to share with employers',
      'Transit failures collapse professional and personal schedules',
      'Non-negotiable pickup windows require absolute certainty',
      'Willingness to pay rideshare specifically to avoid ghosting hopelessness',
    ],
  },
];

export default function TransitPulseAx() {
  const hasPrototype = Boolean(TRANSIT_PULSE_PROTOTYPE_URL);

  return (
    <PageShell width="wide">
      <ReturnToPortfolioButton />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-24 pt-4 max-md:pt-[3.85rem] md:pt-8">

        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="Transit Pulse AX"
              subtitle="Real-time community transit app for Philadelphia. Built from user research up."
            />
            <div className="mt-3 pl-1">
              <AiBadge models={['claude', 'cursor']} />
            </div>
          </div>
        </HubPageHeadingRow>

        <div className="mt-8 flex flex-col gap-6 md:mt-10">

          {/* Fork statement */}
          <div className="glass-hub-sheet px-6 py-5 md:px-8">
            <p className="text-sm leading-relaxed text-white/70">
              This started as a Springboard UX bootcamp project. I left the program when a course video on using AI for personas turned out to be three years old. At the rate AI moves, that is basically a different era. The course also wanted static 2D deliverables. I had the research done and a working concept, so I built the app instead.
            </p>
          </div>

          {/* Prototype */}
          <div className="glass-hub-sheet glass-hub-sheet--no-backdrop p-6 md:p-8">
            <SectionLabel>Live prototype</SectionLabel>
            {hasPrototype ? (
              <div className="mt-4 flex justify-center">
                <div
                  className="relative w-full overflow-hidden rounded-[2rem] border border-white/12 bg-black shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-inset ring-white/[0.06]"
                  style={{ maxWidth: 390, aspectRatio: '390 / 844' }}
                >
                  <iframe
                    title="Transit Pulse AX interactive prototype"
                    src={TRANSIT_PULSE_PROTOTYPE_URL}
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 flex min-h-[8rem] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-xs text-white/30">
                  Set <code className="rounded bg-white/10 px-1.5 py-0.5">VITE_TRANSIT_PULSE_PROTOTYPE_URL</code> to embed the live prototype
                </p>
              </div>
            )}
          </div>

          {/* Problem */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <SectionLabel>The Problem</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Official transit apps provide GPS coordinates and scheduled arrival times. What they do not provide is ground truth — whether the bus is actually moving, whether the stop is safe at this hour, whether there is room to board, or whether the arrival time reflects reality at all.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  The stress of public transit is not the wait itself. It is the uncertainty. Riders cannot trust the tool they rely on, so they hedge — checking multiple apps, leaving earlier, calling rideshares preemptively. Every one of those workarounds is a failure the app caused.
                </p>
              </div>
              <div className="space-y-3">
                <SectionLabel>The Solution</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Transit Pulse layers community-verified reality on top of official data. Riders submit live conditions — vehicle location, occupancy, safety vibe, cleanliness — and that signal travels instantly to everyone waiting down the line.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  The schedule is a suggestion. The community is the source of truth.
                </p>
              </div>
            </div>
          </div>

          {/* Research */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Research</SectionLabel>
            <p className="mt-1 mb-5 text-sm text-white/50">Self-directed. January – February 2026.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { stat: '19', label: 'Screener survey respondents', detail: 'Ghost buses ranked as the #1 stress factor. "Is it actually coming?" was the most-wanted piece of information.' },
                { stat: '5', label: 'Recorded user interviews', detail: '30-minute sessions with participants recruited from the screener. Interviews covered navigation habits, uncertainty triggers, and reporting behavior.' },
                { stat: '4', label: 'Personas developed', detail: 'Each grounded in a real participant. Each with a documented feature priority ranking derived from their interview.' },
              ].map(({ stat, label, detail }) => (
                <div key={stat} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-3xl font-bold text-white">{stat}</p>
                  <p className="mt-1 text-xs font-semibold text-white/60">{label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personas */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>User Personas</SectionLabel>
            <p className="mt-1 mb-5 text-sm text-white/50">Names changed for privacy. Each grounded in a real interview participant.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PERSONAS.map((p) => (
                <PersonaCard key={p.name} {...p} />
              ))}
            </div>
          </div>

          {/* Pain clusters */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Thematic Analysis — 5 Pain Clusters</SectionLabel>
            <p className="mt-1 mb-5 text-sm text-white/50">Synthesized from affinity mapping across all 5 interviews. Each cluster maps to one or more design decisions.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PAIN_CLUSTERS.map((c) => (
                <PainCluster key={c.title} {...c} />
              ))}
            </div>
          </div>

          {/* Design Decisions */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Design Decisions</SectionLabel>
            <div className="mt-4">
              <DecisionRow
                decision="Pivot 1: The schedule is a suggestion"
                why="Early iterations assumed SEPTA data was mostly accurate. Research proved otherwise — ghost buses, abrupt detours, and hardware latency are systemic. The UI now actively surfaces discrepancies rather than presenting official data at face value."
              />
              <DecisionRow
                decision="Pivot 2: Safety is a primary metric, not a secondary filter"
                why="Three of five interview participants named physical security as their top transit concern before timing or convenience. Stop safety ratings and safe-corridor mapping moved from optional features to top-level navigation."
              />
              <DecisionRow
                decision="Pivot 3: Brutalist efficiency over clean corporate design"
                why="If a gradient reduces legibility in direct sunlight, it is removed. The design language draws from Philly Handstyle graffiti and the kinetic visual vocabulary of Vogue and Waacking — highly visible, highly intentional, built for motion."
              />
              <DecisionRow
                decision="The Two-Tap Mandate"
                why="Any critical action — reporting a safety hazard, checking an alternate route, confirming vehicle location — must complete in a maximum of two taps. This is the governing rule of the UX. Users are moving, cold, stressed, or in low-signal environments. The interface has to earn every second."
              />
              <DecisionRow
                decision="Signal Independence"
                why="The app architecture assumes a poor connection by default. Critical UI components load without heavy assets. Data caches intelligently. An app that fails in an underground station is an app that fails its users at exactly the moment they need it most."
              />
            </div>
          </div>

          {/* Competitive positioning */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Competitive Positioning</SectionLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  name: 'Google Maps',
                  label: 'The Generalist',
                  gap: 'Treats a bus stop the same as a coffee shop. Reports the bus as arriving if the API says so, regardless of whether it is actually moving.',
                },
                {
                  name: 'Transit App',
                  label: 'The Specialist',
                  gap: 'Strong routing and a clean UI, but relies entirely on official GTFS data. Does not crowdsource conditions — safety, lighting, occupancy, vibe.',
                },
                {
                  name: 'Citizen',
                  label: 'The Alarmist',
                  gap: 'Excellent real-time safety alerts, but frames the city as a threat. High anxiety, no utility layer. Users feel worse, not better informed.',
                },
              ].map(({ name, label, gap }) => (
                <div key={name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35 mt-0.5">{label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{gap}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.03] p-4">
              <p className="text-xs font-semibold text-amber-200/80 uppercase tracking-widest">Transit Pulse</p>
              <p className="mt-1 text-sm text-white/70">The utility of Transit App with the awareness of Citizen — but helpful rather than alarmist. Community-verified reality layered on top of official schedules, with a UI built for people who are already moving.</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 px-1">
            {[
              'React Native', 'SEPTA API', 'Geospatial', 'User Research',
              'Personas', 'Gamification', 'WCAG', 'Accessibility',
              'Chronopsychology', 'Real-Time Data', 'Community Validation',
            ].map((t) => (
              <span key={t} className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/60">
                {t}
              </span>
            ))}
          </div>

        </div>
      </div>
    </PageShell>
  );
}
