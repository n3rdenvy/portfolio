import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/60">
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{children}</p>
  );
}

function StackLayer({ label, items, accent = false }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${accent ? 'border-amber-400/25 bg-amber-400/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item.name} className="flex flex-col gap-0.5">
            <span className={`text-sm font-semibold ${accent ? 'text-amber-200' : 'text-white'}`}>{item.name}</span>
            {item.detail && <span className="text-[11px] text-white/40 leading-tight">{item.detail}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function CapabilityCard({ title, description, detail }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/55">{description}</p>
      {detail && <p className="mt-2 text-[11px] leading-relaxed text-white/35 italic">{detail}</p>}
    </div>
  );
}

function DecisionRow({ decision, why }) {
  return (
    <div className="flex gap-4 border-b border-white/[0.06] py-3 last:border-0">
      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/50 mt-1.5" />
      <div>
        <p className="text-sm text-white">{decision}</p>
        <p className="mt-0.5 text-xs text-white/45 leading-relaxed">{why}</p>
      </div>
    </div>
  );
}

export default function Eris() {
  return (
    <PageShell width="wide">
      <ReturnToHub mobileLayout="pill-end" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-24 pt-4 max-md:pt-[3.85rem] md:pt-8">

        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="Eris"
              subtitle="A fully local, always-on AI infrastructure system. Built from scratch on a Mac Mini M4 Pro."
            />
          </div>
        </HubPageHeadingRow>

        <div className="mt-8 flex flex-col gap-6 md:mt-10">

          {/* Context */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <SectionLabel>The Problem</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Running an AI-heavy workflow across 5–10 services means constant context-switching, expensive API tokens for routine tasks, and an AI that forgets everything the moment you close the tab. Every session starts from zero.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  I needed a permanent AI partner — one that lives locally, knows my projects, my habits, my voice, and is always running whether I'm at the machine or not.
                </p>
              </div>
              <div className="space-y-3">
                <SectionLabel>The Constraint That Shaped Everything</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Zero external tokens for daily operations. Claude Code is reserved exclusively for building and coding. Eris handles everything else — research, briefings, memory, autonomous tasks, creative work — without touching a metered API.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  This constraint forced every architectural decision to be intentional. If a component added latency or resource overhead without clear value, it was removed.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Architecture</SectionLabel>
            <p className="mt-1 mb-5 text-sm text-white/50">Daedalus — Mac Mini M4 Pro (64GB unified memory)</p>

            <div className="flex flex-col gap-3">
              <StackLayer
                label="Interface"
                accent
                items={[
                  { name: 'Open WebUI 0.9.4', detail: 'localhost:8080' },
                  { name: 'eris_pipe.py', detail: 'custom OWUI → Letta bridge' },
                  { name: 'Kokoro TTS', detail: 'custom voice blend, port 8880' },
                ]}
              />
              <div className="flex items-center justify-center text-white/20 text-xs">↕ pipe</div>
              <StackLayer
                label="Agent + Memory"
                accent
                items={[
                  { name: 'Letta 0.16.7', detail: 'persistent memory agent, port 8283' },
                  { name: 'PostgreSQL 17 + pgvector', detail: '165 archival entries, 23 memory files' },
                  { name: 'Karpathy Archive', detail: '6-directory structured memory store' },
                ]}
              />
              <div className="flex items-center justify-center text-white/20 text-xs">↕ OpenAI-compat API</div>
              <StackLayer
                label="Model Serving"
                items={[
                  { name: 'Ollama', detail: 'model server' },
                  { name: 'kallisti (Gemma4 27B Q4_K_M)', detail: 'vision + tools + thinking, ~47 tok/s' },
                  { name: 'mxbai-embed-large', detail: 'embedding model' },
                ]}
              />
              <div className="flex items-center justify-center text-white/20 text-xs">↕ tool calls</div>
              <StackLayer
                label="External Tools (10 live)"
                items={[
                  { name: 'Gmail' },
                  { name: 'Google Drive' },
                  { name: 'Google Calendar' },
                  { name: 'Browser (Puppeteer)', detail: 'port 8285' },
                  { name: 'Gemini 3.5 Flash', detail: 'routing tool' },
                  { name: 'InvokeAI', detail: 'image gen, port 9090' },
                  { name: 'ComfyUI', detail: 'port 8188' },
                ]}
              />
            </div>
          </div>

          {/* Capabilities */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Key Capabilities</SectionLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CapabilityCard
                title="Morning Brief"
                description="Daily 7:30am: Letta reads calendar, email, active projects, and burnout signals. Delivers a briefing as a macOS notification. Clicking it opens the chat directly."
                detail="Fires without any user input. Eris knows what day it is."
              />
              <CapabilityCard
                title="Ambient Awareness"
                description="Activity logger captures keystrokes (word-level) and app switches. Screenshot daemon fires on every context switch. Daily digest at 2am: prunes noise, captions meaningful sessions via vision, archives to permanent store."
                detail="17 LaunchAgents running at all times."
              />
              <CapabilityCard
                title="Long-Term Memory"
                description="Letta agent maintains persistent archival memory across sessions. Conversation index logs every exchange. Sync bridge routes new files and wiki entries into Letta automatically."
                detail="Memory survives restarts, reboots, and context limits."
              />
              <CapabilityCard
                title="Session Handoffs"
                description="When a session ends, the pipe detects goodbye phrases and writes a structured handoff file to disk. Claude Code picks these up on session start, reads them, and acknowledges before proceeding."
                detail="Cross-system context continuity without a shared session."
              />
              <CapabilityCard
                title="Autonomous Task Queue"
                description="Task runner fires every 30 minutes. Eris reads a structured task file, executes queued instructions, and emails results. Runs without supervision."
                detail="Tasks are written in plain language, not code."
              />
              <CapabilityCard
                title="Custom Voice"
                description="Kokoro TTS with a blended voice model: bm_fable (52%), bf_lily (13%), bm_lewis (25%), bm_george (4.5%), bm_daniel (5%) at 0.95 speed. Tuned over multiple sessions."
                detail="Runs fully local. No cloud TTS, no latency, no cost."
              />
            </div>
          </div>

          {/* Design decisions */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Design Decisions</SectionLabel>
            <div className="mt-4">
              <DecisionRow
                decision="Letta over a raw vector database"
                why="Persistent agent memory with a structured API meant I didn't have to build memory retrieval logic myself. Letta handles chunking, embedding, archival, and context injection. The cost was setup complexity; the gain was a system that actually remembers things correctly across months."
              />
              <DecisionRow
                decision="Kokoro TTS over cloud alternatives"
                why="Cloud TTS (ElevenLabs, OpenAI) would add latency and per-character cost to every Eris response. Kokoro runs locally at port 8880, starts with OWUI, and the custom voice blend means Eris sounds distinct — not like a generic assistant."
              />
              <DecisionRow
                decision="Removed MemPalace after discovering 10-second pipe latency"
                why="MemPalace was triggering on personal memory signals and adding 10 seconds to every response that matched the keywords. It was redundant with Letta archival. Removed it immediately. The lesson: measure before you add, and be willing to cut."
              />
              <DecisionRow
                decision="Removed Whisper STT for the same reason"
                why="Not being used in practice, adding startup overhead to every session. If a component doesn't earn its keep in the actual workflow, it gets cut regardless of how useful it seemed in planning."
              />
              <DecisionRow
                decision="Weekly synthesis over daily summarization"
                why="Daily summaries create noise. A weekly behavioral synthesis — running every Sunday at 2:30am — surfaces patterns across the week: what I was building, how long I spent on it, where attention drifted. That's the signal level that's actually useful."
              />
              <DecisionRow
                decision="Karpathy Archive directory structure"
                why="Named after Andrej Karpathy's approach to structured personal knowledge. Six directories (RAW, WIKI, REPORTS, MEMORY, SCREENSHOTS, plus others) with explicit routing rules. Sync bridge knows which directory each file type belongs in. Nothing is freeform."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 px-1">
            {[
              'Agentic Design', 'System Architecture', 'Letta', 'Open WebUI',
              'Ollama', 'Gemma4 27B', 'PostgreSQL + pgvector', 'Kokoro TTS',
              'LaunchAgents', 'Puppeteer', 'Ambient Computing', 'Local-First',
            ].map((t) => <Tag key={t}>{t}</Tag>)}
          </div>

        </div>
      </div>
    </PageShell>
  );
}
