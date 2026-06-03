import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import PageShell from '../components/PageShell';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';
import AiBadge from '../components/AiBadge';

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="size-5" strokeWidth={2} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        draggable={false}
      />
    </div>
  );
}

function Img({ src, alt, className = '' }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className}`}
        draggable={false}
        onClick={() => setOpen(true)}
      />
      {open && <Lightbox src={src} alt={alt} onClose={close} />}
    </>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/60">
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{children}</p>;
}

function GitHubLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-white/40 transition-colors duration-200 hover:text-white/70"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
      View on GitHub
    </a>
  );
}

// ─── NitrousToken ─────────────────────────────────────────────────────────────

const NT_MOTIONS = [
  { gif: '/devtools/nt_motions/pulse_compact.gif',  label: 'Pulse',        desc: 'Arc glow breathes on a slow cycle' },
  { gif: '/devtools/nt_motions/hum_compact.gif',    label: 'Engine Hum',   desc: 'Needle jitters like an analog gauge under load' },
  { gif: '/devtools/nt_motions/sweep_compact.gif',  label: 'Radar Sweep',  desc: 'Ghost segments scan across the filled arc' },
  { gif: '/devtools/nt_motions/drift_compact.gif',  label: 'Live Drift',   desc: 'Fill oscillates slowly around the true value' },
  { gif: '/devtools/nt_motions/charge_compact.gif', label: 'Charge Cycle', desc: 'Ring expands from center and fades' },
];

function NitrousTokenCard() {
  return (
    <div className="glass-hub-sheet p-6 md:p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">NitrousToken</p>
          <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
            Real-time token quota gauges for every AI tool you run.
          </h3>
        </div>
        <div className="shrink-0"><AiBadge models={['claude', 'cursor']} /></div>
      </div>

      {/* Panel + why */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0 lg:w-[560px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            <Img src="/devtools/nitroustoken.png" alt="NitrousToken main panel — 5 service quota gauges" className="w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-5 text-sm leading-relaxed text-white/70">
          <div>
            <SectionLabel>Why it exists</SectionLabel>
            <p>When you're running 5–10 AI services daily, quota limits are invisible until you slam into them mid-task. I needed always-on visibility — not buried in a settings page, but in the menu bar where I actually work.</p>
          </div>
          <div>
            <SectionLabel>Design decisions</SectionLabel>
            <ul className="space-y-1.5">
              {[
                '10 service integrations — Anthropic, OpenAI, Cursor, Google, Mistral, xAI, Perplexity, Meta, Cohere, Copilot',
                '6 themes from Asphalt to Burnout — fits any desktop without visual noise',
                'Burn rate forecasting shows days remaining and projected exhaust date per service',
                'Cursor auth is zero-config — reads local SQLite without an API key',
                'Google Gemini uses OAuth credentials already on disk from the Gemini CLI',
              ].map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Electron', 'React', 'Menu Bar', 'API Integrations', 'Data Viz', 'macOS'].map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
      </div>

      {/* Burn rate */}
      <div>
        <SectionLabel>Burn rate &amp; forecasting</SectionLabel>
        <p className="mb-3 text-xs leading-relaxed text-white/50">Usage over time per service, with projected exhaust date and warnings when a service is on track to run out before its reset.</p>
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] w-fit">
          <Img src="/devtools/nt_burn_rate.png" alt="NitrousToken burn rate panel — multi-line chart with projection table" className="block" />
        </div>
      </div>

      {/* Settings */}
      <div>
        <SectionLabel>Personalization</SectionLabel>
        <div className="flex flex-wrap items-start gap-3">
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <Img src="/devtools/nt_settings_top.png" alt="NitrousToken settings — theme selector and per-service color pickers" className="w-[180px] block" />
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <Img src="/devtools/nt_settings_motions.png" alt="NitrousToken settings — motion toggle chips and transparency sliders" className="w-[180px] block" />
          </div>
          <p className="max-w-[200px] self-end pb-1 text-xs leading-relaxed text-white/40">
            6 themes, per-service color overrides, motion toggles, and transparency controls.
          </p>
        </div>
      </div>

      {/* Always-on meters */}
      <div>
        <SectionLabel>Always-on gauge motion styles</SectionLabel>
        <p className="mb-4 text-xs leading-relaxed text-white/50">
          Each floating meter window is randomly assigned one motion on open — so five open at once look like five different instruments.
          Hover or pin any meter to reveal the detail panel.
        </p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
          {NT_MOTIONS.map(({ gif, label, desc }) => (
            <div key={label} className="flex flex-col gap-2">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                <Img src={gif} alt={`${label} motion`} className="w-full block" />
              </div>
              <p className="text-[11px] font-semibold text-white/80">{label}</p>
              <p className="text-[10px] leading-snug text-white/40">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <Img src="/devtools/nt_motions/sweep_expanded.gif" alt="Expanded meter detail panel showing usage breakdown and reset date" className="w-[130px] block" />
          </div>
          <p className="max-w-[260px] pt-1 text-xs leading-relaxed text-white/40">
            Hover or pin any meter to expand — usage breakdown, input/output token split, reset date, and per-model quotas for Google Gemini.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Ignus ────────────────────────────────────────────────────────────────────

const IGNUS_STAGES = [
  { src: '/devtools/ignus/stage_default.png',  label: 'Ready',    desc: 'Both services off, nothing selected' },
  { src: '/devtools/ignus/stage_selected.png', label: 'Selected', desc: 'InvokeAI checked, ready to launch' },
  { src: '/devtools/ignus/stage_running.png',  label: 'Running',  desc: 'Both services live — stop controls visible' },
];

function IgnusCard() {
  return (
    <div className="glass-hub-sheet p-6 md:p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/devtools/ignus/ignus_dark.png" alt="Ignus logo" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Ignus</p>
            <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
              One-click launcher for local AI image generation.
            </h3>
          </div>
        </div>
        <div className="shrink-0"><AiBadge models={['claude', 'cursor']} /></div>
      </div>

      {/* Flame card + why */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col gap-4 lg:w-[340px]">

          {/* Live flame/mesh animation */}
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            style={{ aspectRatio: '340/280' }}
          >
            <img src="/devtools/ignus/full_flame.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ animation: 'ignus-flame 6s ease-in-out infinite' }} />
            <img src="/devtools/ignus/white_mesh.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ animation: 'ignus-mesh 6s ease-in-out infinite', mixBlendMode: 'screen' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <span className="text-sm font-bold tracking-tight text-white">Ignus</span>
                <span className="text-[10px] text-white/40">your 3D render models</span>
              </div>
              <div className="flex flex-col gap-2">
                {['InvokeAI', 'ComfyUI'].map(name => (
                  <div key={name} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    <span className="flex-1 text-xs font-medium text-white">{name}</span>
                    <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-400">running</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stage shots */}
          <div>
            <SectionLabel>All states</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {IGNUS_STAGES.map(({ src, label, desc }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <div className="overflow-hidden rounded-lg border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    <Img src={src} alt={desc} className="w-full block" />
                  </div>
                  <p className="text-[10px] font-semibold text-white/70">{label}</p>
                  <p className="text-[9px] leading-snug text-white/35">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 text-sm leading-relaxed text-white/70">
          <div>
            <SectionLabel>Why it exists</SectionLabel>
            <p>Running InvokeAI and ComfyUI locally means terminal commands, port management, and waiting to confirm services started. That friction breaks flow before you've generated a single image. Ignus collapses it to one button.</p>
          </div>
          <div>
            <SectionLabel>Design decisions</SectionLabel>
            <ul className="space-y-1.5">
              {[
                'Service status at a glance — running/stopped with port number, no terminal needed',
                'Single Launch button handles sequencing so order-of-operations errors disappear',
                'launchd integration so InvokeAI survives restarts without babysitting',
                'Flame-mesh identity: wireframe overlay on real fire — the collision between structure and generation',
              ].map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Electron', 'launchd', 'InvokeAI', 'ComfyUI', 'Local AI'].map(t => <Tag key={t}>{t}</Tag>)}
          </div>
          <GitHubLink href="https://github.com/n3rdenvy/Ignus" />
        </div>
      </div>
    </div>
  );
}

// ─── Kallisti ─────────────────────────────────────────────────────────────────

function KallistiCard() {
  return (
    <div className="glass-hub-sheet p-6 md:p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Kallisti</p>
          <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
            A job pipeline that surfaces high-fit roles and lets Eris brief you on each one.
          </h3>
        </div>
        <div className="shrink-0"><AiBadge models={['claude', 'cursor']} /></div>
      </div>

      {/* Screenshots + why */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0 lg:w-[340px]">
          <div className="grid grid-cols-2 gap-2">
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <Img src="/devtools/kallisti.png" alt="Kallisti Today view showing high-fit job listings" className="w-full block" />
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <Img src="/devtools/kallisti_detail.png" alt="Kallisti role detail with Eris 10/10 fit score" className="w-full block" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 text-sm leading-relaxed text-white/70">
          <div>
            <SectionLabel>Why it exists</SectionLabel>
            <p>Job searching while working full-time means roles slip through or get stale. I needed something that ran in the background, scored fits against my actual profile, and let me loop Eris in on any role in one click — without switching context to a browser tab.</p>
          </div>
          <div>
            <SectionLabel>Design decisions</SectionLabel>
            <ul className="space-y-1.5">
              {[
                'Eris integration built in — one click opens a briefing chat with full role context pre-loaded',
                'Drift scoring surfaces roles that match your trajectory, not just your keywords',
                'Menu bar only, no dock icon — present when you need it, invisible when you don\'t',
                'File-watcher architecture so the radar runs in background and the UI updates live when new roles land',
              ].map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Electron', 'React', 'Menu Bar', 'Job Search', 'AI Integration'].map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevTools() {
  return (
    <PageShell width="wide">
      <style>{`
        @keyframes ignus-flame {
          0%, 100% { opacity: 0.85; transform: scale(1.02); }
          50% { opacity: 0.55; transform: scale(1); }
        }
        @keyframes ignus-mesh {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.65; }
        }
      `}</style>

      <ReturnToPortfolioButton />

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
          <NitrousTokenCard />
          <IgnusCard />
          <KallistiCard />
        </div>
      </div>
    </PageShell>
  );
}
