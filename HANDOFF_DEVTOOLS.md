# Dev Tools Page + NitrousToken Overhaul — Handoff

**Last updated:** 2026-06-03 (Opus session, checkpointed for model switch)
**Resume on:** Sonnet is fine for all remaining work. The task list (TaskCreate, 12 items) persists across compaction — read it with TaskList first.

---

## The Goal

Two parallel tracks driven by Erik's feedback on the `/dev-tools` portfolio page:

1. **NitrousToken app changes** (`/Users/gay_villain/Projects/NitrousToken`) — needed before the embed.
2. **Portfolio page rewrite** (`/Users/gay_villain/Projects/portfolio/src/pages/DevTools.jsx`).

**KEY STRATEGIC DECISION (approved by Erik):** Instead of screenshots/GIFs for NitrousToken, build the NT renderer as a **standalone static web bundle** and embed it **live in an iframe** on the portfolio page. The app already runs in-browser via a mock (`window.api` fallback in `src/renderer/src/main.jsx`). This makes the gauges, motion styles, burn rate, personalization, and tooltips all LIVE and interactive instead of static media. Erik confirmed the data size is acceptable.

Once embedded, the portfolio page no longer needs: motion GIFs, gauge screenshots, burn rate PNG, settings PNGs. Those sections become "see it live below" pointing at the embed. Ignus (animation) and Kallisti (screenshots) still need static media since they aren't embedded.

---

## HARD RULES (from Erik, non-negotiable)

- **NO EM DASHES ANYWHERE.** Not in copy, not in comments that ship. Rewrite sentences so no reader could tell a dash was ever there. This is the #1 AI tell. Already scrubbed `themes.js` detail strings. Must audit all of `DevTools.jsx`.
- **Snake_Case** naming convention for new vars (Erik's style).
- Never spend money / hit paid APIs without clearance.
- Present options at real decision points, make the call on small ones and report.

---

## DONE so far this session

### NitrousToken (NOT a git repo — changes live on disk only)
- `src/renderer/src/themes.js` — COMPLETE and in clean state:
  - Added `Eris: '#C084FC'` (and per-theme variants) to all 6 themes' `colors` maps, each WCAG-verified in the comment.
  - Rewrote `SERVICE_META`: added `display` (user-facing label) and `kind` ('cloud' | 'local') to every entry. Added new `Eris` entry with `kind: 'local'`.
  - Display names now: Anthropic→**Claude**, OpenAI→**ChatGPT**, Google→**Gemini**, xAI→**Grok**, Meta→**Meta AI**. (Erik only asked for Gemini + ChatGPT; I did all of them for consistency. He may veto Claude/Grok/Meta AI — if so, set those `display` back to the key name.)
  - Added exported helper `service_label(key)` — returns display name, falls back to key.
  - Removed all em dashes from detail strings.

### Portfolio (git repo, origin: github.com/n3rdenvy/portfolio, branch main — NOT pushed)
- `src/components/ReturnToPortfolioButton.jsx` — now uses glass-hub-pill style + Home icon, text reads "Return to portfolio" (was wrongly "Home").
- `src/components/AiBadge.jsx` — Cursor icon replaced with the real Cursor SVG path (pulled from NT Meter.jsx).
- `src/components/PortfolioHubPanel.jsx` — removed aiTools badges from all hub cards (declutter).
- `src/pages/DevTools.jsx` — has Lightbox/Img components, NitrousToken/Ignus/Kallisti cards, NT bottle logo + Kallisti golden-apple logo in headers, Ignus 5-frame CSS crossfade, GitHub links on Ignus+Kallisti. **Still needs all the work in tasks #6-#12.**

### Kallisti (now a git repo, local only, NOT pushed, NO remote yet)
- Scrubbed secrets before any publish: removed hardcoded Letta agentId, OWUI API key (sk-...), "Erik Smith" fallbacks, "Erik's" in prompts. All set to empty-string defaults / generic wording in `src/main/index.js`.
- `git init` done, `.gitignore` added (node_modules/dist/out/release/.env), one clean commit of src only.
- Erik approved publishing Ignus AND Kallisti to GitHub. Ignus repo exists (github.com/n3rdenvy/Ignus). Kallisti needs a repo created + push. Portfolio Kallisti card links to `https://github.com/n3rdenvy/Kallisti` (create that repo).

### Assets copied to portfolio/public/devtools/
- `nitroustoken_logo.png` (NT bottle), `kallisti_logo.png` (golden apple) — from ~/Desktop/Logos/
- `ignus/` has the 5 REAL flame stages: `white_mesh_real.png`, `flame25.png`, `flame50.png`, `flame75.png`, `full_flame_real.png` (from ~/Desktop/Logos/Ignus/). These are the source for the smooth interpolated animation (task #10).
- Ignus stage screenshots: `ignus/stage_default.png`, `stage_selected.png`, `stage_running.png` (native puppeteer caps, retina).

---

## REMAINING WORK (task list, in suggested order)

### NitrousToken app (do before embed build)
- **#1 (in_progress)** Labels: themes.js done. STILL must update consumers to use `service_label()`:
  `Gauge.jsx`, `Meter.jsx`, `App.jsx` (burn rate legend + stats table + hamburger menu list). Search for `s.label`, `svc`, `{label}` usages that render to screen.
- **#2** Header restructure in `App.jsx` (~line 437-510):
  - Move hamburger button to FAR LEFT, before/left of the `<AnimatedTitle>`. Currently it's in the right-side button cluster.
  - Replace the theme badge (the grey box showing `theme_tag`/`ASPHALT`, ~line 447-452) with today's LOCAL token count. Format exactly: `3,237 local tokens used today`. Resets at midnight. Pull from Eris data (see #3). For the embed/mock, just hardcode a believable number.
  - Remove the inline `age_label` span (~line 467-472). Instead show it as the refresh button's hover tooltip: `Last refreshed: 5m ago` (set `title=` dynamically, or a custom tooltip).
  - Burn Rate button + Close button already have `title="Burn Rate"` / `title="Close (⌘W)"`. Verify they read well (Erik wants hover tooltips "burn rate" and "exit"). Consider changing Close title to just "Exit".
- **#3** Eris dashed line in burn rate chart (`BurnRateChart` in App.jsx ~line 112-177):
  - Eris is `kind: 'local'`. Render its line with `strokeDasharray="6 4"` vs solid for cloud.
  - Eris context: local Ollama gemma4-27B on Mac mini M4 Pro, came online ~2026-05-18 (Eris v2). Zero cloud cost. Heavy daily use since it's free. Agent ID etc in `memory/project_eris.md` (do NOT bake secrets into public bundle).
  - Add a legend marker explaining dashed = local tokens, solid = cloud.
- **#4** Browser mock data (`src/renderer/src/main.jsx` `window.api` fallback, the `MOCK_DATA` + `get_snapshots`):
  - 180-day snapshot dataset telling Erik's real usage arc: Gemini-heavy → +Cursor → Cursor+Claude peak → Claude solo → Gemini+Claude → all three → now Gemini+Claude+Eris. Lines should cross/compete for the lead across the timeline. All 4 range filters (7d/30d/90d/180d) must look great.
  - Eris ramps in the last ~2 weeks as a strong dashed line.
  - Distinct gauge fill % per service so the gauge grid has visual variety (e.g. Claude 65, ChatGPT 31, Cursor 72, Gemini 58, Mistral 44).
- **#5** Build standalone embed:
  - NT uses electron-vite. Need a plain `vite build` of just the renderer → static output. The renderer already works standalone (mock kicks in when `window.api` absent).
  - Output to `portfolio/public/nt-embed/` (or similar). Wire `<iframe src="/nt-embed/index.html">` into DevTools.jsx NitrousToken card.
  - Renderer entry: `src/renderer/index.html` + `src/renderer/src/main.jsx`. May need a dedicated vite config with correct `base` path for the iframe to resolve assets. Test the bundle loads + mock data shows before embedding.
  - Capture dev server pattern used this session: `cd src/renderer && npx vite --port 5175 --host localhost` (renderer-only).

### Portfolio page (DevTools.jsx + components)
- **#6** Lightbox: portal to `document.body` (use react-dom createPortal) so it covers the true viewport at current scroll. Currently appears below the fold because it renders inside a Framer-transformed scroll container. Larger logos in headers; click opens FULL-RES source (NT bottle, golden apple, etc.) centered in viewport.
- **#7** CardFooter component: merge AiBadge + GitHubLink into one footer row, placed logically (bottom of content col). Label the model icons section "Models used during creation". Hover each icon → tooltip with specific model: "Claude Sonnet 4.6", "Cursor". (Almost everything used latest Sonnet; update if that changes.)
- **#8** Copy + structure pass:
  - Full em dash audit of DevTools.jsx — rewrite, don't just delete.
  - Tech-stack tag row: give it a sensible `SectionLabel` header (e.g. "Built with" / "Stack") in a logical spot. NOTE this is separate from the "Models used during creation" footer.
  - WCAG: surface NT's baked-in contrast ratios (themes.js has them in comments) as a real accessibility design decision in the NT card copy. Erik confirmed he wants WCAG represented on the portfolio.
  - Status badge per card: "Active" / "In development" / "Personal use" chip.
  - Anchor IDs per card: `id="nitroustoken"`, `id="ignus"`, `id="kallisti"` for deep links.
- **#9** Motion tiles (only if NOT fully replaced by embed): square aspect, no grow until hover, hover expands a tooltip like the real app's pinned detail. Remove the separate "pinned detail view". Motion labels must be readable in BOTH light and dark themes (theme-aware label background pill). NOTE: if the live embed covers motion styles, this whole section may collapse into "interact with it live above" — use judgment.
- **#10** Ignus smooth animation: ffmpeg `minterpolate` between the 5 real stages (`white_mesh_real → flame25 → flame50 → flame75 → full_flame_real`) for clean tweened transition. Output WebM (+ MP4 fallback). Do NOT alter the art, only generate in-between frames. Replace the current CSS opacity crossfade with this.
- **#11** Kallisti screenshots: recapture at 3x, solid dark bg, NO desktop wallpaper showing (current ones show Erik's literal background and are low-res). Same quality bar as the others. App at `/Users/gay_villain/Projects/Kallisti`, runs via electron-vite; renderer can run standalone with a mock like NT if needed, or screenshot the packaged app.
- **#12** Personalization section redesign: fill the space with finesse. Options: animated CSS mockup cycling themes/colors, or (cleaner) just let the live embed's own settings demonstrate it. Erik open to a short video too. Use judgment once embed is in.

---

## KEY PATHS / COMMANDS

```
NT app:        /Users/gay_villain/Projects/NitrousToken   (NOT git)
  dev:         npm run dev   (RESTART after main/preload changes — HMR only covers renderer)
  renderer-only dev server:  cd src/renderer && npx vite --port 5175 --host localhost
  build:       npm run build   |   package: npm run package
  window sizes: panel 560x386 (5 svc), burn rate 560x480, meter compact 130x158,
                meter expanded 130x266, settings 340x560
  mock lives in: src/renderer/src/main.jsx  (window.api fallback when not in Electron)

Portfolio:     /Users/gay_villain/Projects/portfolio   (git, origin n3rdenvy/portfolio, main)
  dev:         npm run dev  (was running on :5174 this session)
  build:       npm run build
  page:        src/pages/DevTools.jsx
  assets:      public/devtools/  (+ public/devtools/ignus/)

Ignus:         /Users/gay_villain/Projects/Ignus   (git, origin n3rdenvy/Ignus)
Kallisti:      /Users/gay_villain/Projects/Kallisti (git local only, needs remote n3rdenvy/Kallisti)

Logos source:  ~/Desktop/Logos/{Ignus,Kallisti,NitrousToken,Portfolio}  (shell sandboxed out;
               Erik must `cp` them; already copied the ones needed)
```

## CAPTURE PIPELINE (this session's method, reusable)
- Puppeteer MCP drives a headless browser to the renderer dev server URL.
- For frame capture: inject html2canvas via CDN, loop snapshots, POST data-URLs to a tiny
  local python http server on :9998 that writes PNGs to /tmp/nt_capture/.
- Native puppeteer screenshots are cleaner than html2canvas for static shots (use those for Kallisti #11).
- ffmpeg for GIF/video: palettegen+paletteuse for GIFs; minterpolate for smooth tweening (#10).
- Serve /tmp/nt_capture on :9997 to eyeball results through puppeteer.

## DECISIONS LOG (for Erik's interview storytelling)
- Live embed over static media: portfolio shows the actual running app, not screenshots. Differentiator.
- Eris as dashed "local tokens" line: visualizes the local-vs-cloud cost story in one chart. Breakout idea Erik proposed.
- Product names over company names in NT labels (consistency).
- WCAG ratios were designed into NT's theme system from the start (not bolted on) — real AX evidence.
```
