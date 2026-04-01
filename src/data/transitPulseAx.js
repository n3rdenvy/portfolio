/**
 * Live embed for the Transit Pulse case study (`/transit-pulse-ax`).
 * Default: production app on Vercel. Override locally or on Vercel with
 * `VITE_TRANSIT_PULSE_PROTOTYPE_URL` (e.g. a preview deployment or Figma embed).
 *
 * If the iframe is blank, the Transit Pulse app must allow embedding (no
 * `X-Frame-Options: DENY` / tight `Content-Security-Policy: frame-ancestors`).
 */
const TRANSIT_PULSE_DEFAULT_URL = 'https://transit-pulse-nine.vercel.app';

export const TRANSIT_PULSE_PROTOTYPE_URL = (
  import.meta.env.VITE_TRANSIT_PULSE_PROTOTYPE_URL || TRANSIT_PULSE_DEFAULT_URL
).trim();

export const TRANSIT_PULSE_CONCEPT = {
  title: 'Concept & why',
  body: [
    'Transit Pulse AX frames operational telemetry for riders and operators in a single, legible surface: status, delay context, and recovery paths without burying signal under decorative chrome.',
    'The prototype stress-tests density, motion restraint, and screen-reader order so the shell stays trustworthy under load — the same posture we expect in live transit control and platform signage.',
  ],
};

export const TRANSIT_PULSE_LEARNINGS = {
  title: 'Learnings & Process',
  items: [
    'Mapped primary tasks (where is my vehicle, what changed, what do I do next) before visual polish so hierarchy stayed anchored to real urgency.',
    'Iterated contrast and touch targets against WCAG AA on the slate glass stack used across this portfolio wing.',
    'Validated copy with trauma-informed tone: short clauses, no blame framing, explicit next steps when service degrades.',
    'Prototyped in tight loops with embedded device aspect ratios to avoid desktop-only illusions.',
  ],
};

/**
 * Process imagery for Learnings & Process carousel (`public/transit-pulse/` → served from `/transit-pulse/`).
 * If a file is missing, the UI falls back to the label + hint placeholder.
 */
export const TRANSIT_PULSE_PROCESS_PLACEHOLDERS = [
  { label: 'Journey map', src: '/transit-pulse/journey.png', hint: 'public/transit-pulse/journey.png' },
  { label: 'Wireflow', src: '/transit-pulse/wireflow.png', hint: 'public/transit-pulse/wireflow.png' },
  { label: 'Component audit', src: '/transit-pulse/components.png', hint: 'public/transit-pulse/components.png' },
];
