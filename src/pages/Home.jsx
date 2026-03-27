import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Armchair, Clapperboard, Download, LineChart } from 'lucide-react';
import InteriorCarousel from '../components/InteriorCarousel';

const HERO_COPY =
  'Trauma-Informed Design and systems architecture shape how products collect attention, surface state, and recover from error. Boundaries, interfaces, and observability are the levers—not decoration. Erik Smith works at that intersection: humane patterns inside rigorous technical frames.';

const BTN_NAV = 'btn-theme inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium no-underline';

const INTERIOR_CAROUSEL_IMAGES = [
  '/3D Vis Images/image 1.jpg',
  '/3D Vis Images/image 2.jpg',
  '/3D Vis Images/image 3.jpg',
  '/3D Vis Images/image 4.jpg',
  '/3D Vis Images/image 5.jpg',
  '/3D Vis Images/image 6.jpg',
];

const PORTALS = [
  {
    to: '/commercials',
    Icon: Clapperboard,
    title: 'Commercials',
    blurb: 'Speculative work and commissioned motion.',
  },
  {
    to: '/roi',
    Icon: LineChart,
    title: 'ROI',
    blurb: 'Economics of delivery. Models, not slogans.',
  },
  {
    to: '/interiors',
    Icon: Armchair,
    title: 'Interiors',
    blurb: 'Spatial studies and material logic.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slateBg text-white">
      <main className="mx-auto max-w-6xl space-y-14 px-4 py-12 text-left md:space-y-20 md:py-16">
        <section className="glass rounded-2xl p-8 md:grid md:grid-cols-2 md:gap-12 md:p-12">
          <div className="space-y-6">
            <h1 className="font-bold leading-tight tracking-tight text-white md:text-4xl">
              Erik Smith <span className="font-normal text-white">|</span>{' '}
              <span className="font-semibold text-white">Systems Architect</span>
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-white md:text-base">{HERO_COPY}</p>
          </div>
          <div className="mt-8 flex items-start justify-start md:mt-0 md:justify-end">
            <a
              href="/erik_smith_resume.pdf"
              download
              className="btn-theme inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-tight no-underline"
            >
              <Download className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Download Technical Resume
            </a>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-center">
            <Link to="/accessibility" className={BTN_NAV}>
              <ArrowUp className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Accessibility
            </Link>
          </div>

          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-start md:justify-center">
            <div className="glass mx-auto flex min-h-[min(52vh,28rem)] w-full max-w-3xl flex-1 flex-col rounded-2xl p-4 md:p-6">
              <div className="min-h-[min(40vh,22rem)] w-full flex-1">
                <img
                  src="/3D Vis Images/image 7.jpg"
                  className="w-full h-full object-cover rounded-2xl opacity-90"
                  alt="3D visualization render"
                />
              </div>
            </div>

            <Link
              to="/process"
              className={`${BTN_NAV} shrink-0 self-center justify-center md:self-start`}
            >
              <ArrowUpRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Process
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-tight text-white">Interior carousel</h2>
          <InteriorCarousel
            images={INTERIOR_CAROUSEL_IMAGES}
            linkTo="/3d-visualization"
          />
        </section>

        <section>
          <h2 className="mb-6 text-xs font-semibold tracking-tight text-white">Portals</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PORTALS.map((portal) => {
              const PortalIcon = portal.Icon;
              return (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className="btn-theme group flex flex-col gap-4 rounded-2xl p-8 no-underline"
                >
                  <PortalIcon
                    className="size-8 text-white group-hover:text-white"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold tracking-tight text-white">{portal.title}</span>
                  <span className="text-xs leading-relaxed text-white">{portal.blurb}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
