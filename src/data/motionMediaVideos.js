/**
 * YouTube: 11-char id from `watch?v=` or `youtu.be/` (not the full URL in code).
 *
 * Used on **Commercial / set design & motion** → `/commercials` only (Portfolio hub links there).
 *
 * Deploy note: files under `public/` must be committed and pushed or they 404 on Vercel.
 */

/** Second carousel — “Designer Videos w/ IKEA…” (full URLs you provided): */
export const INTERIOR_EXPERT_TIPS_VIDEO_IDS = [
  // https://www.youtube.com/watch?v=gCj8BIxM1oY
  'gCj8BIxM1oY',
  // https://www.youtube.com/watch?v=xbQm7dsJPC4
  'xbQm7dsJPC4',
  // https://www.youtube.com/watch?v=jItrW70_GDk
  'jItrW70_GDk',
  // https://www.youtube.com/watch?v=VUVQVxyrPto
  'VUVQVxyrPto',
  // https://www.youtube.com/watch?v=xVLZG0U0qWE
  'xVLZG0U0qWE',
  // https://www.youtube.com/watch?v=pXml6qHlvWc
  'pXml6qHlvWc',
];

/** First carousel — “Commercial Set Design” (YouTube + one local file): */
export const SET_DESIGN_MEDIA_ITEMS = [
  // https://www.youtube.com/watch?v=xdgmSSptkds
  { type: 'youtube', id: 'xdgmSSptkds' },
  // https://www.youtube.com/watch?v=bbcthYJuGQQ
  { type: 'youtube', id: 'bbcthYJuGQQ' },
  // https://www.youtube.com/watch?v=K-0tp514DMw
  { type: 'youtube', id: 'K-0tp514DMw' },
  // https://www.youtube.com/watch?v=i9GwRqywinQ
  { type: 'youtube', id: 'i9GwRqywinQ' },
  // https://www.youtube.com/watch?v=wx7WopX_95Q
  { type: 'youtube', id: 'wx7WopX_95Q' },
  {
    type: 'file',
    src: '/Set%20Design/IKEA_GNC_3016_V7b_ALTEND_20June2024_1080.mp4',
    title: 'IKEA — set design (local)',
  },
];
