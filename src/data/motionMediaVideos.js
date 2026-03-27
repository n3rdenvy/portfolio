/**
 * YouTube: 11-char video id from watch or youtu.be URL.
 * Set design carousel can mix YouTube + files under `public/` (see SET_DESIGN_MEDIA_ITEMS).
 *
 * Deploy note: anything under `public/` must be committed and pushed. Untracked or
 * OneDrive-only files work on your machine but 404 for everyone else (Vercel ships the git tree).
 */
export const INTERIOR_EXPERT_TIPS_VIDEO_IDS = [
  'gCj8BIxM1oY',
  'xbQm7dsJPC4',
  'jItrW70_GDk',
  'VUVQVxyrPto',
  'xVLZG0U0qWE',
  'pXml6qHlvWc',
];

/** Set design + anime web series (YouTube) + local file in `public/Set Design/`. */
export const SET_DESIGN_MEDIA_ITEMS = [
  { type: 'youtube', id: 'xdgmSSptkds' },
  { type: 'youtube', id: 'bbcthYJuGQQ' },
  { type: 'youtube', id: 'K-0tp514DMw' },
  { type: 'youtube', id: 'i9GwRqywinQ' },
  { type: 'youtube', id: 'wx7WopX_95Q' },
  {
    type: 'file',
    src: '/Set%20Design/IKEA_GNC_3016_V7b_ALTEND_20June2024_1080.mp4',
    title: 'IKEA — set design (local)',
  },
];
