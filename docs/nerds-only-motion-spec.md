# Nerds Only: Motion + Render Spec (v1, 2026-06-11)

The single planning artifact for the character video pass. Everything gets dictated here
before any generation spend. Supersedes the Gemini research doc where they conflict.

**What this page is:** a portfolio piece demonstrating visual craft, accessibility thinking,
and a documented UX workflow. **What it is not:** a video game. Anything that only makes
sense in a real match (lobby timers, lock-in flows, multiplayer cursors, engine camera
math, runtime skin swapping) is out of scope, permanently.

---

## 1. Verdict on the Gemini research

| Finding | Verdict | Why |
|---|---|---|
| Single-letter strip cards force cognitive translation, duplicate letters (S, V) break scanning | **Correct, adopt** | Strip renders `char.name[0]`. Real finding, fix is §3.1 |
| Bio text legibility over detailed art | **Correct in principle** | Was fine over gradients; Aed's poster created the problem yesterday. Fix is a CSS scrim (§3.2), never baked into renders |
| "Red alignment text bleeds into red flowers" | **Wrong** | Alignment renders `text-white/70`. The colorblind concern is still worth a check pass over busy art, but the cited instance doesn't exist |
| Hide bio behind a "Read Bio" tab | **Rejected** | Full backstories on the page is an explicit owner decision (2026-06-10). The panel scrolls. A teaser-fade at panel bottom is acceptable; hiding is not |
| Lock In / Confirm CTA, lobby status, match countdown | **Cut** | There is no match. See §3.4 for the portfolio-correct version of "select does something" |
| Multiplayer focus states, controller support | **Cut** | Not a game. Keyboard navigation stays (already partly built, it's an AX story, not a gamepad story) |
| 3D camera FOV math, z-buffer, near/far planes | **Cut as engine advice, translated as prompt language** | Nothing is rendered live. GLBs left the repo 2026-06-10. The valid kernel (portrait lenses flatter faces, wide angles warp) becomes Veo lens vocabulary in §4.3 |
| Hover feedback 50-100ms, ease-out with slight overshoot | **Correct, adopt** | §3.3 |
| Entrance animation then idle loop | **Correct, adopt** | Maps onto the existing clip architecture as a third clip type (§4.5) |
| Runtime material/skin swapping | **Cut** | No skins. No engine |

---

## 2. What everyone missed (Erik + Gemini)

1. **Veo 3.1 changed the loop math.** The 2026-06-10 crossfade decision assumed Veo can't
   reproduce exact frames. Veo 3.1 supports **first-frame AND last-frame conditioning**:
   set both to the character's poster and prompt "a seamless loop" and the model
   interpolates back to the anchor. Plan A is now frame-matched loops; the 0.25s
   crossfade player stays as drift insurance, unchanged. Nothing to rebuild.
2. **Reference-image identity lock.** Veo 3.1 accepts up to 3 reference images per
   subject ("ingredients"). Every character already has art (Aed: poster + 4 seasonal
   stills; others: Drive art inventory). Renders should always carry references, never
   text-only identity.
3. **Autoplaying motion is a WCAG item, not just vibes.** WCAG 2.2.2: moving content
   that lasts >5s needs a pause/stop control. The idle loop autoplays indefinitely.
   A visible pause toggle is required (§3.5) and it is exactly the kind of AX-on-a-flashy-page
   detail the portfolio exists to show.
4. **Photosensitivity belongs in the prompts.** WCAG 2.3.1: nothing flashes more than
   3×/second. Goes in every negative prompt (§4.4). Aed's starlight ignition and Docket's
   sonic scream are the risk clips.
5. **Portraits can come from the posters.** The strip needs faces (§1, finding 1). Instead
   of a separate art run: crop each character's poster via CSS `object-position`. One
   art pipeline, guaranteed style consistency, zero extra spend. Separate portrait
   generation only if a poster's composition can't yield a readable headshot.
6. **Deep links.** `/nerds-only#aed` should select Aed on load. Costs ~10 lines, makes
   every character shareable in applications and posts.
7. **Performance budget.** Poster of the default character should be preloaded (it is
   the page's LCP element). All clips stay within the existing budget (2-3MB/motion,
   README). Page total target: <25MB fully warmed, <1.5MB before interaction.
   Vercel bandwidth holds for now; R2 migration stays parked behind a cost conversation.
8. **Social card.** The page has no og:image. One render (Aed poster or a roster
   collage) fixes how this page unfurls when shared. Worth doing the same day the
   first clean renders land.

---

## 3. UI work (do before or during the render pass)

### 3.1 Portrait strip
Replace the single letter with a headshot crop of the character's poster
(`background-image` or `<img>` + per-character `object-position`). Letter remains as
the no-art fallback. Data change: `portrait: { src, position }` replaces `portrait: null`.
Silhouette test: a portrait must stay identifiable in grayscale at 48px.

### 3.2 Scrim system (CSS, never baked into renders)
- Left edge: `linear-gradient(90deg, rgba(0,0,0,.62), transparent 42%)` behind the info panel.
- Bottom edge: `linear-gradient(0deg, rgba(0,0,0,.55), transparent 26%)` behind the strip.
- Layered between media and UI so every character gets identical treatment and
  renders stay clean for reuse (case study frames, og:image, print).
- After scrim: re-run the contrast pass over Aed's poster (worst case: moon + lilies).
  Target ≥4.5:1 for the backstory text, ≥3:1 for large display text.

### 3.3 Micro-interactions (numbers, so it's not vibes)
- Strip card hover/focus: scale 1.0 → 1.06, 90ms, ease-out, settle to 1.04 (the 3-5%
  overshoot Gemini suggested, implemented as a Framer spring: stiffness ~500, damping ~28).
- Selection commit: role-color ring snaps in ≤100ms; background crossfade 250ms (existing).
- Respect `prefers-reduced-motion`: hovers become opacity shifts, no scale.

### 3.4 "Select does something" (the portfolio CTA)
No Lock In button. Selection's payoff is the entrance clip (§4.5) plus the deep link
updating in the URL bar. That is the correct amount of game-feel for a portfolio page.

### 3.5 Pause control
One toggle, top-right of the stage: pauses/resumes idle + ambient playback, state in
localStorage, `aria-pressed`, visible focus. Reduced-motion users default to paused
(poster only, already built).

### 3.6 Keyboard map (formalize what exists)
←/→ move through the strip, Enter/Space selects, focus ring in character accent color
(built). Add Home/End to jump first/last. Document it with a small "keyboard" hint in
the footer; that hint is the honest version of Gemini's "gamepad prompts."

---

## 4. Render bible (Veo 3.1)

### 4.1 Canvas + delivery
- Generate 16:9 at 1080p. No vertical variants for v1.
- Clip length: idle 6-8s, ambient motions 5-8s, entrance ≤3s of action inside an 8s take
  (trim in post). 8s is the hard Veo ceiling per generation.
- Posters: the existing webp pipeline (cwebp q82). Clips: existing README encode rules
  (strip audio, H.264 CRF ~23 + WebM sibling, 2-3MB per motion).

### 4.2 Composition law (this is what makes renders "clean")
The UI owns the left third and the bottom fifth. Therefore, in every prompt:
- Subject anchored **right of center**, face in the **upper-right quadrant**, roughly
  full-length or 3/4 body, feet may crop.
- Left ~38% of frame: atmosphere only. Low detail, low contrast, no faces, no focal
  objects. The info panel sits there.
- Bottom ~22%: ground/fog/floor only. The strip sits there.
- Single subject. No crowds, no second characters (exception: named companions, which
  sit close to the subject, never frame-left: Pip, Mother).
- No on-screen text anywhere in frame. Veo garbles glyphs; all text is HTML.

### 4.3 Camera + light (fixed house style, paste into every prompt)
> Locked-off static camera, 85mm portrait lens, eye level, shallow depth of field,
> painterly dark-fantasy splash art, volumetric key light motivated by the scene,
> deep soft shadows, muted desaturated background, character carries the only
> saturated accent color, cinematic color grade, no camera movement.

- Idles and ambients: locked-off only. No handheld sway, no dolly. Movement belongs to
  the character, not the camera (this is also what keeps loops seamless).
- Entrances may use ONE move: a slow 10% dolly-in, nothing else.
- Per-character accent grade = their data `color` (e.g. Aed #A4B86A, Elara #E8834A).

### 4.4 Standing negative prompt (every generation)
> no text, no captions, no watermark, no logo, no UI elements, no extra limbs,
> no second character, no strobe, no rapid flashing, no camera shake,
> no morphing, no jelly motion

### 4.5 Clip set per character (4 generations minimum, budget 6-10 with retries)
1. **poster** (image, not video): the anchor frame. Already exists for Aed; for others,
   generate stills first and get them approved BEFORE any video spend. The poster is
   first frame + last frame of every subsequent clip.
2. **idle**: breathing-level motion only. Weight shift, cloth drift, particle ambience.
   "Subtle, calm" in prompt: this clip autoplays, so it must pass the
   doesn't-distract-while-reading test.
3. **entrance** (the selection payoff): one signature beat, high energy, ends back at
   the poster pose. Player order on select: entrance once → idle loop.
4. **ambient ×1-2**: personality beats for the 9-13s ambient timer. Smaller than the
   entrance.

### 4.6 Loop protocol (per clip)
- First frame = poster. Last frame = poster. Prompt includes "a seamless loop."
- Carry 2-3 reference images of the character in every generation.
- Reuse the identity block verbatim across all of a character's prompts (Veo identity
  drifts when descriptions drift). One paragraph per character, frozen after poster
  approval, stored in this file under §5.
- QA each clip before encode: loop seam check at 0.5× speed, flash check, left-third
  cleanliness check, face-position check against the strip/panel overlay (use a PNG
  overlay of the UI at 1920×1080 as a literal stencil during review).

### 4.7 Generation workflow (the case-study artifact)
Poster → approve → freeze identity block → idle → entrance → ambients → encode → wire.
One character fully through the pipe first (Aed: his poster and 4 seasonal references
already exist) to validate the protocol, THEN batch the other nine. Document
rejects/retries per character; that ratio is portfolio material, not waste.

---

## 5. Per-character render blocks

Frozen identity paragraphs get written here at poster-approval time. Planned beats:

| Char | Pose anchor (poster) | Idle | Entrance (signature) | Ambient ideas |
|---|---|---|---|---|
| Aed | standing in lily field, moon behind, right of center | catkin fibers drift, star pinpricks under skin pulse softly | Starry Form ignition: skin to cerulean night, Orion lines connect, bow of light drawn (slow, no strobe) | seasonal shift using the 4 season stills as references; weeping blossom bloom |
| Hop | weight on rapier, ship at distance | ear twitch, coat in sea wind | rabbit-hop landing into pose | flips an acid vial; checks spyglass |
| Tortuga | planted, shield up, river stone visible | slow heavy breath, water drips | warhammer + shield plant, faint radiant ring flare (Spirit Guardians) | touches shell, forge-light glow seam |
| Sable | aristocratic stance, half in shadow | tail sway, obsidian spots drink light | steps out of a shadow (Shadow Stepper), settles | eyes flicker ember red; claw flex |
| Valerius | parade rest with halberd, Capitol backdrop | medals glint, calibrated smirk holds | haft strike to floor, coat settles | leadership die flicked and caught; smile recalibrates |
| Silex | bow in hand, fog bank | fog drifts, feathers ruffle | Dread Ambusher: three arrows nocked in sequence (no release) | hood adjust; single feather falls |
| Vector | static, scanline ambience | near-still; one optic flicker every few seconds | none (NPC: selecting him plays idle only, the stillness IS the bit) | brief glitch displacement |
| Xin | rifle shouldered, Mother at shoulder height frame-right | Mother bobs gently, gold seams glint | adjusts rifle, Mother does one orbit and returns | Xin's gaze tracks Mother; reload check |
| Elara | dryad state per ElaraDryad.png, Pip orbiting | bark breathes, Pip pulses | fire-bloom: flowers ignite and heal back (RETIRED chip earns the elegiac tone) | Pip zips a figure-eight |
| Docket | clipboard up, ring finger raised | nail charms jingle micro-motion | pen click struggle, knuckle click, look up (the bit, verbatim from her sheet) | flips a page; silent judgment pan of the eyes |

---

## 6. Order of operations

1. UI: scrim (§3.2) + pause toggle (§3.5) + deep links (§2.6). Small, unblocks review.
2. Aed end-to-end through §4.7 (only character with approved art today).
3. Strip portraits from Aed's poster to prove §3.1, letter fallback for the rest.
4. Review Aed live, lock the protocol, then batch posters for the remaining nine.
5. Posters approved → batch video. og:image last, from whatever poster wins.

Generation costs money (Flow/Gemini credits). Per the standing rule: estimated volume
is ~6-10 generations × 10 characters; Erik green-lights spend per batch, starting with
the Aed pilot.

---

## 7. Responsive plan (flagged 2026-06-11, not a v1 blocker)

Masters stay 16:9. No vertical re-renders for v1.

- **Tablet/mobile = CSS crop of the same master.** `posterPosition` (shipped 2026-06-11)
  is the per-character focal point; it applies to the video element the same way when
  clips land. Set it once per character so the face survives the portrait crop.
- **Mobile UI gets blur-backed panels** (`backdrop-blur` + dark tint) instead of the
  desktop left-edge scrim, which is already `hidden md:block`. Bottom scrim stays at
  all sizes.
- **Bandwidth:** below `md`, serve poster-only by default and load the idle on tap, or
  encode a 720p sibling. Decide after the Aed pilot, when real file sizes exist.
- Veo 3.1 generates native 9:16 at all resolutions if a true vertical master is ever
  wanted (e.g. a Shorts cut of the page for promo). Out of scope for the page itself.

## 8. Generator: Veo 3.1 vs Adobe Firefly (researched 2026-06-11)

Both now support first+last-frame keyframing, so the loop protocol (§4.6) works on either.

**Veo 3.1 (+ 3.1 Lite, new this week):** best motion quality and prompt adherence for
stylized character work; up to 3 reference images per subject for identity lock; 1080p
native with 4K upscale; documented seamless-loop technique; Lite tier exists precisely
for cheap draft iteration. Costs per generation; audio is generated but we strip it.

**Firefly Video:** first/last keyframes + Generative Extend; trained on licensed stock,
so output is "commercially safe" by design; some paid plans have run unlimited-generation
windows; March 2026 added custom models (train on your own art) which is the strongest
possible identity lock but heavy for ten characters. Motion quality for painterly
fantasy characters generally trails Veo 3.x; weaker lightweight reference-image support.

**Decision: Veo 3.1 primary. Draft on 3.1 Lite, re-render approved takes on full 3.1.**
Firefly is the designated fallback: policy blocks, a clip Veo keeps failing, or
Generative Extend needs. If a Creative Cloud plan already carries Firefly credits,
it doubles as a free second opinion during the Aed pilot: run Aed's idle on both once
and let the result confirm the call. Both generators wait on the per-batch spend
green light.

## 9. Static asset inventory (what ships vs what stays CSS)

**Generated art (the only pipeline):**
- 10 posters. Done: Aed, Hop, Sable, Silex, Elara, Docket. Missing: Xin, Valerius,
  Tortuga, Vector.
- 1 og:image (1200×630), from the strongest poster or a roster collage.
- Per-character portrait crops ONLY where a poster can't yield a readable 48px headshot
  via `object-position`.
- Reference stills staged per character folder (not wired): Aed seasons ×4, Hop tavern,
  Sable sanguine, Elara and-Pip.

**Never generated, CSS/SVG owns them:** frame surrounds, card borders, parallelogram
masks, selection rings, scrims, vignette, role badges, NPC/RETIRED chips, pause icon,
keyboard hints. Reason: they must track role colors, themes, and AX contrast ratios,
and keeping chrome out of renders keeps every render reusable (case study, og:image,
print). A baked-in frame is a one-way door; a CSS frame is a variable.

---

## 10. Master prompt template (paste-ready, both tiers)

Same prompt verbatim on Lite drafts and full 3.1 finals. The ONLY thing that changes
between draft and final is the model toggle; if the prompt changes, the draft stopped
being a draft of anything. Bracketed slots are the only edits per clip.

```
Locked-off static camera, 85mm portrait lens, eye level, shallow depth of field.
No camera movement.

[IDENTITY BLOCK: frozen paragraph from §5, verbatim every time]

[ACTION: one beat. Idle = breathing-level. Entrance = the signature move,
finishing back in the starting pose.] The character returns exactly to the
starting pose by the end of the shot.

[SCENE: environment matching the poster.] The left third of the frame is quiet
atmosphere only: soft haze, low contrast, nothing of interest. The bottom of the
frame is ground and fog only.

Painterly dark-fantasy splash art, volumetric key light motivated by the scene,
deep soft shadows, muted desaturated background, the character carries the only
saturated accent color ([COLOR NAME, hex]), cinematic color grade.

A seamless loop. The first and last frames are identical. No dialogue, no speech,
quiet ambience.
```

UI settings alongside the prompt, every generation:
- First frame: the character's poster. Last frame: the same poster.
- Reference images: poster + up to 2 alternates (Aed: 2 seasonal stills).
- Negative prompt field: `text, captions, watermark, logo, UI elements, extra limbs,
  second character, strobe, rapid flashing, camera shake, morphing, jelly motion`
- 16:9, 1080p, 8s.

### Worked example: Aed idle (the pilot clip)

```
Locked-off static camera, 85mm portrait lens, eye level, shallow depth of field.
No camera movement.

A slender male Eladrin elf druid, 5'10" and lithe, pale moss-green skin with
fluorescent yellow freckles, hazel eyes, full-moon-yellow hair in ringlets, wearing
hide scale mail with a wooden shield slung on his back, standing right of center
among red spider lilies under a huge full moon.

He breathes slowly and shifts his weight almost imperceptibly. Tiny catkin fibers
drift down around him; faint pinpricks of starlight pulse softly under his skin.
The character returns exactly to the starting pose by the end of the shot.

A moonlit field of red spider lilies at night, distant treeline. The left third of
the frame is quiet atmosphere only: soft haze, low contrast, nothing of interest.
The bottom of the frame is ground and fog only.

Painterly dark-fantasy splash art, volumetric key light motivated by the moon,
deep soft shadows, muted desaturated background, the character carries the only
saturated accent colors (moss green and lily red), cinematic color grade.

A seamless loop. The first and last frames are identical. No dialogue, no speech,
quiet ambience.
```

(Aed's identity block above is provisional until checked against cosmic.png; freeze
it in §5 after the first draft confirms likeness.)

### Tier and length policy
- Every clip in this project fits inside a single 8-second take BY DESIGN. Scene
  Extension / "extended" generation is never used: each extension is a re-encode
  that drifts identity, and our loops must close on the poster frame.
- Lite = drafts (beat blocking, composition checks). Full 3.1 = finals only, after
  a draft is approved, because finals need the reference-image identity lock and
  1080p quality. If Lite's UI lacks first/last-frame or reference slots, draft with
  first-frame-only; the draft answers "is the motion right," not "is the loop sealed."
