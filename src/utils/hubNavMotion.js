/**
 * Shared “ping-pong” timing for hub wing chevrons, resume scroll hint, and Transit Pulse triggers.
 * Keeps directional nudges visually in sync across the site.
 */
export const HUB_NAV_EDGE_PULSE_TRANSITION = {
  duration: 3.25,
  repeat: Infinity,
  ease: [0.42, 0, 0.58, 1],
  repeatDelay: 0.5,
};

/** Horizontal nudge (px) for left/right-pointing arrows. */
export const HUB_NAV_PULSE_X = 10;

/** Vertical nudge (px) for down-pointing arrows (matches resume scroll chevron travel). */
export const HUB_NAV_PULSE_Y = 18;
