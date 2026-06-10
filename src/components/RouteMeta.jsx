import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_DESC =
  'Erik Smith — AX/UX Designer. Portfolio covering accessible transit apps, AI infrastructure, AR furniture placement, and IKEA design strategy.';

const ROUTE_META = {
  '/': { title: 'Erik Smith — AX/UX Designer' },
  '/portfolio': {
    title: 'Portfolio hub — Erik Smith',
    desc: 'Project hub: Transit Pulse AX transit app, Eris local AI infrastructure, Inhabit AR furniture, dev tools, and IKEA design strategy.',
  },
  '/resume': { title: 'Resume — Erik Smith' },
  '/accessibility': { title: 'Accessibility strategy — Erik Smith' },
  '/process': { title: 'Process — Erik Smith' },
  '/roi': { title: 'National ROI framework — Erik Smith' },
  '/contact': { title: 'Contact — Erik Smith' },
  '/commercials': { title: 'Set design + motion — Erik Smith' },
  '/3d-visualization': { title: '3D visualization — Erik Smith' },
  '/transit-pulse-ax': {
    title: 'Transit Pulse AX — Erik Smith',
    desc: 'Real-time community transit app for Philadelphia. Built from user research up: WCAG-compliant design system, rider-verified conditions.',
  },
  '/coming-soon': { title: 'Coming soon — Erik Smith' },
  '/dev-tools': {
    title: 'Dev tools — Erik Smith',
    desc: 'Electron menu bar tools for the AI-heavy workflow: NitrousToken quota gauges, Ignus model lifecycle manager, Kallisti job pipeline.',
  },
  '/ikea': { title: 'IKEA design strategy — Erik Smith' },
  '/eris': {
    title: 'Eris AI infrastructure — Erik Smith',
    desc: 'Fully local, always-on AI infrastructure on a Mac Mini M4 Pro. Letta memory, Ollama, 17 autonomous agents. No cloud.',
  },
  '/inhabit': {
    title: 'Inhabit AR furniture — Erik Smith',
    desc: 'Android AR app for placing IKEA furniture in your space at accurate scale. TripoSR to GLB to ARCore pipeline.',
  },
  '/nerds-only': { title: "Nerd's Only — Erik Smith" },
};

/** Per-route <title> + meta description. Renders nothing. */
export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTE_META[pathname];
    document.title = meta?.title || 'Erik Smith — Portfolio';
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', meta?.desc || DEFAULT_DESC);
  }, [pathname]);

  return null;
}
