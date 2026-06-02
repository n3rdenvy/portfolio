import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';
import AiBadge from '../components/AiBadge';

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/70">
      {children}
    </span>
  );
}

function ToolCard({ name, tagline, screenshot, screenshotAlt, logo, why, decisions, tags, githubUrl, aiTools = [], flip = false }) {
  return (
    <div className="glass-hub-sheet p-6 md:p-8">
      <div className={`flex flex-col gap-8 lg:flex-row lg:items-start ${flip ? 'lg:flex-row-reverse' : ''}`}>

        {/* Screenshot */}
        <div className="w-full shrink-0 lg:w-[340px]">
          {logo && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={logo} alt={`${name} logo`} className="h-10 w-10 rounded-xl object-contain" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{name}</span>
              </div>
              {aiTools.length > 0 && <AiBadge models={aiTools} />}
            </div>
          )}
          {!logo && aiTools.length > 0 && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{name}</span>
              <AiBadge models={aiTools} />
            </div>
          )}
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <img
              src={screenshot}
              alt={screenshotAlt}
              className="w-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {!logo && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{name}</p>
          )}
          <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
            {tagline}
          </h3>

          <div className="space-y-3 text-sm leading-relaxed text-white/70">
            <p className="font-semibold text-white/50 uppercase tracking-widest text-[10px]">Why it exists</p>
            <p>{why}</p>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-white/70">
            <p className="font-semibold text-white/50 uppercase tracking-widest text-[10px]">Design decisions</p>
            <ul className="space-y-1.5">
              {decisions.map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-white/40 transition-colors duration-200 hover:text-white/70"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const TOOLS = [
  {
    name: 'NitrousToken',
    aiTools: ['claude', 'cursor'],
    tagline: 'Real-time token quota gauges for every AI tool you run.',
    screenshot: '/devtools/nitroustoken.png',
    screenshotAlt: 'NitrousToken panel showing Anthropic, Cursor, and Google quota gauges',
    why: "When you're running 5–10 AI services daily, quota limits are invisible until you slam into them mid-task. I needed always-on visibility — not buried in a settings page, but in the menu bar where I actually work.",
    decisions: [
      '6 themes (Asphalt to Burnout) so it fits any desktop setup without visual noise',
      '5 idle animation modes per gauge — pulse, engine hum, radar sweep, live drift, charge cycle — because static numbers feel dead',
      'Burn rate and reset time shown per service, not just percentage consumed',
      '10 service integrations covering Anthropic, OpenAI, Cursor, Google, Copilot, and more',
    ],
    tags: ['Electron', 'React', 'Menu Bar', 'API Integrations', 'Data Viz'],
  },
  {
    name: 'Ignus',
    aiTools: ['claude', 'cursor'],
    tagline: 'One-click launcher for local AI image generation.',
    screenshot: '/devtools/ignus.png',
    screenshotAlt: 'Ignus launcher panel showing InvokeAI running and ComfyUI ready to start',
    logo: '/devtools/ignus_logo.png',
    why: "Running InvokeAI and ComfyUI locally means terminal commands, port management, and waiting to confirm services started. That friction breaks flow before you've generated a single image. Ignus collapses it to one button.",
    decisions: [
      'Service status at a glance — running/stopped with port number, no terminal needed',
      'Single Launch button that handles sequencing, so order-of-operations errors disappear',
      'Flame-mesh identity: wireframe overlay on real fire — the collision between structure and generation',
      'launchd integration so services survive restarts without babysitting',
    ],
    tags: ['Electron', 'launchd', 'InvokeAI', 'ComfyUI', 'Local AI'],
    githubUrl: 'https://github.com/n3rdenvy/Ignus',
    flip: true,
  },
];

export default function DevTools() {
  return (
    <PageShell width="wide">
      <ReturnToHub mobileLayout="pill-end" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-20 pt-4 max-md:pt-[3.85rem] md:pt-8">
        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="Dev tools"
              subtitle="Tools I build for myself. Scratching itches, shipping things."
            />
          </div>
        </HubPageHeadingRow>

        <div className="mt-8 flex flex-col gap-6 md:mt-10">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
