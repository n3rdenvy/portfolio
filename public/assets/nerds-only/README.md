# Nerds Only — runtime assets (intentionally empty)

Drop zone for character media. Nothing ships until files land here.

## Layout

```
public/assets/nerds-only/
  <char-id>/
    poster.webp        # shared start/end pose frame — paints instantly, doubles as reduced-motion view
    idle.mp4 / .webm   # default loop, starts+ends on the poster pose
    motion-1.mp4 ...   # 2-3 extra motions, ALL frame-matched to the same pose
```

## Rules (from the 2026-06-10 audit + video architecture decision)

- Source of generation: VEO (chosen over GLB rendering for style consistency).
- Clips should start and end NEAR a common pose per character. Exact frames are
  NOT required — the player crossfades 0.25s between clips and absorbs VEO
  drift. The closer the poses, the cleaner the fade; don't fight the model
  for pixel-perfect.
- Encode before committing: strip audio (`-an`), 1080p max, 5-8s loops,
  H.264 CRF ~23 + AV1/WebM sibling. Budget: 2-3MB per motion.
- Player is built and smoke-tested (CharacterMedia in NerdsOnly.jsx): idle
  loops, ambient timer plays a random motion every 9-13s, crossfades both
  ways, motions cache-warm on requestIdleCallback, reduced-motion gets
  poster only. Wiring a character = filling its `media` object in
  nerdsOnlyCharacters.js. Clip entries: src string or { webm, mp4 }.
- Posters: WebP, explicit width/height in markup, `loading="lazy"` below fold.
- GLB animation sources are NOT runtime assets. They live at
  `~/Documents/Karpathy_Archive/03_ASSETS/nerds_only_glb_staging/`.
  If live 3D ever replaces video, GLBs would load from this directory
  (runtime fetch via public/) — until then, do not commit them.
