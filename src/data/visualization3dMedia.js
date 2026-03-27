/**
 * 3D visualization gallery — static files in `public/3D Vis Images/`
 * (repo root: `public/3D Vis Images/...` → site path `/3D Vis Images/...`).
 */
const RENDER_IMAGE_BASE = '/3D Vis Images';

const RENDER_FILES = [
  'image 1.jpg',
  'image 2.jpg',
  'image 3.jpg',
  'image 4.jpg',
  'image 5.jpg',
  'image 6.jpg',
];

export const VISUALIZATION_3D_ITEMS = RENDER_FILES.map((file, i) => ({
  type: 'image',
  src: `${RENDER_IMAGE_BASE}/${file}`,
  alt: `3D visualization render ${i + 1}`,
}));
