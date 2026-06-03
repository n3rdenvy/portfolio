/**
 * Stacked AI model logo badges.
 * Usage: <AiBadge models={['claude', 'cursor', 'gemini']} />
 */

const MODEL_META = {
  claude: {
    label: 'Claude (Anthropic)',
    bg: '#D4541A',
    // Anthropic starburst — 4-petal spark, recognizable at small sizes
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="white"
          d="M12 2.5Q13.2 9 21.5 12Q13.2 15 12 21.5Q10.8 15 2.5 12Q10.8 9 12 2.5Z"
        />
      </svg>
    ),
  },
  cursor: {
    label: 'Cursor',
    bg: '#151515',
    // Cursor arrow — the most recognizable cursor shape
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="white"
          d="M5.5 3.5L5.5 19.5L9.8 15.2L12.8 21L15 19.8L12 14L18.5 14Z"
        />
      </svg>
    ),
  },
  gemini: {
    label: 'Gemini (Google)',
    bg: '#1A6FD4',
    // Gemini 4-pointed star — longer vertical axis (the actual Gemini wordmark shape)
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="white"
          d="M12 2Q12.4 9.8 20 12Q12.4 14.2 12 22Q11.6 14.2 4 12Q11.6 9.8 12 2Z"
        />
      </svg>
    ),
  },
};

export default function AiBadge({ models = [], className = '' }) {
  if (!models.length) return null;

  const label = models.map((m) => MODEL_META[m]?.label).filter(Boolean).join(' + ');

  return (
    <div
      className={`flex items-center ${className}`}
      role="img"
      aria-label={`Built with: ${label}`}
    >
      {models.map((m, i) => {
        const meta = MODEL_META[m];
        if (!meta) return null;
        return (
          <div
            key={m}
            title={meta.label}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 shadow-sm"
            style={{
              backgroundColor: meta.bg,
              marginLeft: i > 0 ? '-8px' : '0',
              zIndex: models.length - i,
              position: 'relative',
            }}
          >
            {meta.icon}
          </div>
        );
      })}
    </div>
  );
}
