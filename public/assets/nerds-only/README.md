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
- Every clip starts and ends on the same pose so any clip can chain into any
  other with a hard cut — no crossfades.
- Encode before committing: strip audio (`-an`), 1080p max, 5-8s loops,
  H.264 CRF ~23 + AV1/WebM sibling. Budget: 2-3MB per motion.
- Posters: WebP, explicit width/height in markup, `loading="lazy"` below fold.
- GLB animation sources are NOT runtime assets. They live at
  `~/Documents/Karpathy_Archive/03_ASSETS/nerds_only_glb_staging/`.
  If live 3D ever replaces video, GLBs would load from this directory
  (runtime fetch via public/) — until then, do not commit them.
