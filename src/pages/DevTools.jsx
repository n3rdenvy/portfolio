import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
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
    </div>,
    document.body
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

function StatusBadge({ status }) {
  const styles = {
    'Active':        'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    'Personal use':  'border-white/20 bg-white/5 text-white/50',
    'In development':'border-amber-500/40 bg-amber-500/10 text-amber-400',
  };
  const dot = {
    'Active':        'bg-emerald-400',
    'Personal use':  'bg-white/30',
    'In development':'bg-amber-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[status] || styles['Personal use']}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status] || dot['Personal use']}`} />
      {status}
    </span>
  );
}

function CardFooter({ models = [], github_href = null }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Models used during creation</p>
        <AiBadge models={models} />
      </div>
      {github_href && <GitHubLink href={github_href} />}
    </div>
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

function MotionTile({ gif, label, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex flex-col gap-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
        <img src={gif} alt={`${label} motion style`} draggable={false} className="h-full w-full object-cover" />
        {hovered && (
          <div className="absolute inset-0 rounded-xl bg-black/70 flex flex-col justify-end p-3 gap-1">
            <p className="text-[11px] font-semibold text-white leading-tight">{label}</p>
            <p className="text-[10px] leading-snug text-white/70">{desc}</p>
          </div>
        )}
      </div>
      <p className="mt-2 inline-flex self-start rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-sm">{label}</p>
    </div>
  );
}

function NitrousTokenCard() {
  return (
    <div id="nitroustoken" className="glass-hub-sheet p-6 md:p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/devtools/nitroustoken_logo.png" alt="NitrousToken logo" className="h-14 w-auto shrink-0 object-contain drop-shadow-lg cursor-zoom-in" />
          <div>
            <div className="mb-1 flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">NitrousToken</p>
              <StatusBadge status="Personal use" />
            </div>
            <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
              Real-time token quota gauges for every AI tool you run.
            </h3>
          </div>
        </div>
      </div>

      {/* Live embed + why */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0">
          <div
            className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            style={{ width: 560, height: 480 }}
          >
            <iframe
              src="/nt-embed/index.html"
              title="NitrousToken live demo"
              width="560"
              height="480"
              scrolling="no"
              style={{ display: 'block', border: 'none', borderRadius: '14px' }}
            />
          </div>
          <p className="mt-2 text-[10px] text-white/30 text-center">
            Live app. Click the chart icon to open burn rate.
          </p>
        </div>
        <div className="flex flex-col gap-5 text-sm leading-relaxed text-white/70">
          <div>
            <SectionLabel>Why it exists</SectionLabel>
            <p>When you're running 5 to 10 AI services daily, quota limits are invisible until you slam into them mid-task. I needed always-on visibility in the menu bar, not buried three settings pages deep.</p>
          </div>
          <div>
            <SectionLabel>Design decisions</SectionLabel>
            <ul className="space-y-1.5">
              {[
                '10 service integrations including Anthropic, OpenAI, Cursor, Gemini, Mistral, xAI, Perplexity, Meta, Cohere, and Copilot',
                '6 themes from Asphalt to Burnout, each verified at WCAG 2.1 AA contrast ratios so the gauge colors always read clearly',
                'Burn rate forecasting shows days remaining and projected exhaust date per service',
                'Cursor auth is zero-config. Reads local SQLite without an API key',
                'Google Gemini uses OAuth credentials already on disk from the Gemini CLI',
                'Local model tracked separately. Eris token usage appears as a dashed line so cloud cost is always visible against what runs free',
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

      {/* Always-on meter motion styles */}
      <div>
        <SectionLabel>Always-on gauge motion styles</SectionLabel>
        <p className="mb-4 text-xs leading-relaxed text-white/50">
          Each floating meter window gets a randomly assigned motion on open. Five meters open at once look like five different instruments.
          Hover any tile to see what it does.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {NT_MOTIONS.map((m) => <MotionTile key={m.label} {...m} />)}
        </div>
      </div>

      {/* Theme system */}
      <div>
        <SectionLabel>6 themes, all WCAG 2.1 AA verified</SectionLabel>
        <p className="mb-4 text-xs leading-relaxed text-white/50">
          Every gauge color in every theme was checked against its background at 4.5:1 minimum contrast. The palette was designed first, then verified — not the other way around.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: 'Asphalt',   bg: '#09090B', light: false, accents: ['#FFD700','#4AB8FF','#F58220','#34D399','#FB923C','#C084FC'] },
            { name: 'Carbon',    bg: '#000000', light: false, accents: ['#FF8C00','#4AB8FF','#F58220','#4ADE80','#FDA958','#C084FC'] },
            { name: 'NOS',       bg: '#0A192F', light: false, accents: ['#38BDF8','#34D399','#FB923C','#4ADE80','#FCA5A5','#D8B4FE'] },
            { name: 'Ghost',     bg: '#0A0A0A', light: false, accents: ['#FFFFFF','#AAAAAA','#888888','#BBBBBB','#CCCCCC','#D0D0D0'] },
            { name: 'Burnout',   bg: '#FFF0E5', light: true,  accents: ['#9E5800','#0070A8','#A34A00','#166534','#B45309','#7E22CE'] },
            { name: 'Track Day', bg: '#F8FAFC', light: true,  accents: ['#9A5C00','#005F8A','#B85000','#15803D','#C2410C','#7E22CE'] },
          ].map(({ name, bg, light, accents }) => (
            <div key={name} className="flex flex-col gap-2">
              <div
                className="rounded-xl border border-white/10 p-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                style={{ background: bg }}
              >
                <p className={`mb-2.5 text-[10px] font-semibold tracking-wide ${light ? 'text-black/50' : 'text-white/40'}`}>
                  {name.toUpperCase()}
                </p>
                <div className="flex flex-wrap gap-1">
                  {accents.map((c, i) => (
                    <span key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardFooter models={['claude', 'cursor']} />
    </div>
  );
}

// ─── Ignus ────────────────────────────────────────────────────────────────────

const IGNUS_STAGES = [
  { src: '/devtools/ignus/stage_default.png',  label: 'Ready',    desc: 'Both services off, nothing selected' },
  { src: '/devtools/ignus/stage_selected.png', label: 'Selected', desc: 'InvokeAI checked, ready to launch' },
  { src: '/devtools/ignus/stage_running.png',  label: 'Running',  desc: 'Both services live, stop controls active' },
];

function IgnusCard() {
  return (
    <div id="ignus" className="glass-hub-sheet p-6 md:p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/devtools/ignus/ignus_dark.png" alt="Ignus logo" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
          <div>
            <div className="mb-1 flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Ignus</p>
              <StatusBadge status="Personal use" />
            </div>
            <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
              One-click launcher for local AI image generation.
            </h3>
          </div>
        </div>
      </div>

      {/* Flame card + why */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col gap-4 lg:w-[340px]">

          {/* 5-stage flame identity: wireframe mesh morphs into full fire via xfade */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)] bg-black" style={{ aspectRatio: '1/1' }}>
            <video
              autoPlay loop muted playsInline
              className="h-full w-full object-cover"
              aria-hidden
            >
              <source src="/devtools/ignus/flame_anim.webm" type="video/webm" />
              <source src="/devtools/ignus/flame_anim.mp4" type="video/mp4" />
            </video>
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
                'Service status at a glance: running or stopped, with port number. No terminal needed.',
                'Single Launch button handles sequencing so order-of-operations errors disappear',
                'launchd integration so InvokeAI survives restarts without babysitting',
                'Flame-mesh identity: wireframe on real fire. Structural precision collides with raw generation.',
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
        </div>
      </div>

      <CardFooter models={['claude', 'cursor']} github_href="https://github.com/n3rdenvy/Ignus" />
    </div>
  );
}

// ─── Kallisti ─────────────────────────────────────────────────────────────────

function KallistiCard() {
  return (
    <div id="kallisti" className="glass-hub-sheet p-6 md:p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/devtools/kallisti_logo.png" alt="Kallisti logo" className="h-10 w-10 shrink-0 rounded-xl object-cover cursor-zoom-in" />
          <div>
            <div className="mb-1 flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Kallisti</p>
              <StatusBadge status="In development" />
            </div>
            <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
              A job pipeline that surfaces high-fit roles and lets Eris brief you on each one.
            </h3>
          </div>
        </div>
      </div>

      {/* Screenshots + why */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0 lg:w-[460px] flex flex-col gap-2">
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <Img src="/devtools/kallisti_pipeline.png" alt="Kallisti Pipeline view — all active roles with fit scores and status" className="w-full block" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <Img src="/devtools/kallisti.png" alt="Kallisti Today view — follow-up flags and new high-fit roles" className="w-full block" />
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <Img src="/devtools/kallisti_detail.png" alt="Kallisti role detail — Eris 10/10 fit score and briefing" className="w-full block" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 text-sm leading-relaxed text-white/70">
          <div>
            <SectionLabel>Why it exists</SectionLabel>
            <p>Job searching while working full-time means roles slip through or go stale. I needed something that ran in the background, scored fits against my actual profile, and let me pull Eris into any role briefing in one click. No browser tab context switch.</p>
          </div>
          <div>
            <SectionLabel>Design decisions</SectionLabel>
            <ul className="space-y-1.5">
              {[
                'Eris integration built in. One click opens a briefing chat with the full role context already loaded',
                'Drift scoring surfaces roles that match your trajectory, not just your keywords',
                'Menu bar only, no dock icon. Present when you need it, gone when you don\'t',
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

      <CardFooter models={['claude', 'cursor']} github_href="https://github.com/n3rdenvy/Kallisti" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevTools() {
  return (
    <PageShell width="wide">
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
