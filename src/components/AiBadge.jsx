/**
 * Small stacked AI model logo badges.
 * Usage: <AiBadge models={['claude', 'cursor', 'gemini']} />
 */

const MODEL_META = {
  claude: {
    label: 'Claude (Anthropic)',
    bg: '#C96B2C',
    icon: (
      // Simplified Anthropic starburst — 4-petal spark mark
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
        <path
          fill="white"
          d="M12 2.5Q12.6 8.5 18 12Q12.6 15.5 12 21.5Q11.4 15.5 6 12Q11.4 8.5 12 2.5Z"
        />
        <path
          fill="white"
          opacity="0.7"
          d="M12 5Q14 10 19 12Q14 14 12 19Q10 14 5 12Q10 10 12 5Z"
        />
      </svg>
    ),
  },
  cursor: {
    label: 'Cursor',
    bg: '#1A1A1A',
    icon: (
      // Cursor arrow — the Cursor IDE logo approximation
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
        <path
          fill="white"
          d="M5 3L5 18L9 14L12.5 21L14.5 20L11 13L17 13Z"
        />
      </svg>
    ),
  },
  gemini: {
    label: 'Gemini',
    bg: '#1A6CC8',
    icon: (
      // Gemini 4-pointed star — longer vertical axis
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
        <path
          fill="white"
          d="M12 2Q12.4 9 19 12Q12.4 15 12 22Q11.6 15 5 12Q11.6 9 12 2Z"
        />
      </svg>
    ),
  },
};

export default function AiBadge({ models = [], className = '' }) {
  if (!models.length) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Built with: ${models.map(m => MODEL_META[m]?.label).join(', ')}`}>
      {models.map((m, i) => {
        const meta = MODEL_META[m];
        if (!meta) return null;
        return (
          <div
            key={m}
            title={meta.label}
            className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/20 shadow-sm"
            style={{
              backgroundColor: meta.bg,
              marginLeft: i > 0 ? '-6px' : '0',
              zIndex: models.length - i,
            }}
          >
            {meta.icon}
          </div>
        );
      })}
    </div>
  );
}
