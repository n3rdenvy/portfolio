import PageShell from '../components/PageShell';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';
import AiBadge from '../components/AiBadge';

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{children}</p>
  );
}

function PipelineStep({ step, label, detail }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-[10px] font-semibold text-amber-400/80">{step}</span>
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
      <p className="pl-8 text-xs leading-relaxed text-white/50">{detail}</p>
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

export default function Inhabit() {
  return (
    <PageShell width="wide">
      <ReturnToPortfolioButton />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-24 pt-4 max-md:pt-[3.85rem] md:pt-8">

        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="Inhabit"
              subtitle="Android AR app for placing IKEA furniture in your actual space at accurate scale."
            />
            <div className="mt-3 pl-1">
              <AiBadge models={['claude', 'cursor']} />
            </div>
          </div>
        </HubPageHeadingRow>

        <div className="mt-8 flex flex-col gap-6 md:mt-10">

          {/* Status */}
          <div className="glass-hub-sheet px-6 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-400/80 animate-pulse" />
              <p className="text-sm font-medium text-white/70">In development — demo footage and screenshots coming</p>
            </div>
          </div>

          {/* Problem + Insight */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <SectionLabel>The Problem</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Buying furniture from a catalog means committing to a purchase before you know how it actually sits in your room — the scale, the clearance, the way light hits it. Returns are expensive, mistakes are common, and the decision anxiety is real.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  Existing AR furniture apps treat placement as a novelty. They drop a generic 3D model into a phone screen and call it done. The spatial thinking that makes a room actually work — flow, proportion, how one piece relates to another — isn't there.
                </p>
              </div>
              <div className="space-y-3">
                <SectionLabel>The Insight</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Five years of designing retail floor settings and national campaign spaces at IKEA means I've thought more about how products occupy real rooms than most app developers ever will. The domain expertise isn't a backstory — it's the product differentiator.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  Inhabit is built on the same spatial intuition that drives set design and range direction, applied to the problem of helping someone decide whether a sofa fits before they buy it.
                </p>
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>The Pipeline</SectionLabel>
            <p className="mt-1 mb-6 text-sm text-white/50">Photo to placed 3D object in four steps.</p>
            <div className="flex flex-col gap-5">
              <PipelineStep
                step="1"
                label="Photo capture"
                detail="User photographs the IKEA product or a real-world object. Standard phone camera, no special hardware required."
              />
              <PipelineStep
                step="2"
                label="TripoSR mesh generation"
                detail="Single-image 3D reconstruction via TripoSR running locally on the Mac Mini. Generates a GLB mesh from one photo in seconds without cloud round-trip."
              />
              <PipelineStep
                step="3"
                label="GLB export and optimization"
                detail="Mesh is cleaned, scaled to real-world dimensions, and exported as a GLB file compatible with Unity's asset pipeline."
              />
              <PipelineStep
                step="4"
                label="ARCore placement via Unity AR Foundation"
                detail="The GLB is loaded into Unity AR Foundation and placed in the physical space using ARCore surface detection on Android. Users can reposition, rotate, and scale in real time."
              />
            </div>
          </div>

          {/* Stack */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Stack</SectionLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { layer: 'Device', items: 'Android (Pixel 8 Pro), ARCore' },
                { layer: 'Framework', items: 'Unity + AR Foundation' },
                { layer: '3D Pipeline', items: 'TripoSR (local), GLB export' },
                { layer: 'Model Library', items: 'IKEA 3D product catalog' },
              ].map(({ layer, items }) => (
                <div key={layer} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{layer}</p>
                  <p className="mt-2 text-sm text-white">{items}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Design Decisions */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Design Decisions</SectionLabel>
            <div className="mt-4">
              <DecisionRow
                decision="Local 3D generation over cloud API"
                why="TripoSR runs on the Mac Mini at port 8910, not a third-party API. No per-call cost, no data leaving the local network, and generation time is fast enough to not break the interaction flow."
              />
              <DecisionRow
                decision="Single-image reconstruction over photogrammetry"
                why="Asking a user to take 30 photos of a product before they can place it in AR is friction that kills the use case. One photo is the right trade-off — mesh quality is sufficient for spatial decision-making even if it's not render-perfect."
              />
              <DecisionRow
                decision="IKEA catalog as the starting point"
                why="The catalog solves the cold-start problem for 3D assets and connects the app to a realistic purchase decision. The domain expertise from IKEA set design means I know which products people actually struggle to visualize — beds, large sofas, storage systems."
              />
              <DecisionRow
                decision="Android-first"
                why="ARCore on Android is more open and developer-accessible than ARKit. The Pixel 8 Pro's lidar-adjacent depth sensing improves surface detection in low-light rooms — which is where furniture placement decisions usually happen."
              />
            </div>
          </div>

          {/* Placeholder for demo */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <SectionLabel>Demo</SectionLabel>
            <div className="mt-4 flex min-h-[12rem] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="text-center">
                <p className="text-sm font-medium text-white/40">Demo footage in progress</p>
                <p className="mt-1 text-xs text-white/25">Screenshots and video coming once the AR placement flow is complete</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 px-1">
            {[
              'Android', 'ARCore', 'Unity', 'AR Foundation', 'TripoSR',
              'GLB Pipeline', 'IKEA', 'Spatial Design', 'Local AI',
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
