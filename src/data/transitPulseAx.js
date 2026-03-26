/** Set `VITE_TRANSIT_PULSE_PROTOTYPE_URL` in `.env` (e.g. Figma embed or hosted prototype). */
export const TRANSIT_PULSE_PROTOTYPE_URL = (
  import.meta.env.VITE_TRANSIT_PULSE_PROTOTYPE_URL ?? ''
).trim();

export const TRANSIT_PULSE_CONCEPT = {
  title: 'Concept & Why',
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

/** Replace with real process shots under `public/transit-pulse/` when available. */
export const TRANSIT_PULSE_PROCESS_PLACEHOLDERS = [
  { label: 'Journey map', hint: 'public/transit-pulse/journey.png' },
  { label: 'Wireflow', hint: 'public/transit-pulse/wireflow.png' },
  { label: 'Component audit', hint: 'public/transit-pulse/components.png' },
];
