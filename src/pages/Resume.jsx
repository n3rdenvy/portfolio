import * as Framer from 'framer-motion';
import { ChevronDown, Download, Home } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LinkedInLogo from '../components/LinkedInLogo';
import { resumeData } from '../data/resumeData';
import { hubEnterStateForPath, markPageLeavingToHub } from '../utils/pageTransitions';
import { HUB_NAV_EDGE_PULSE_TRANSITION, HUB_NAV_PULSE_Y } from '../utils/hubNavMotion';

const LINKEDIN_HREF = 'https://www.linkedin.com/in/n3rdenvy';

const glassCard =
  'rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white';

/** Shared chrome for mobile + overlap (tablet) resume nav pills. */
const resumeNavPillShell =
  'pointer-events-auto flex min-h-10 w-fit max-w-full min-w-0 shrink-0 items-center justify-center gap-4 rounded-full border border-white/15 bg-slateBg/92 px-3 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md min-[400px]:gap-6 min-[400px]:px-4';

/** Emphasis for primary nav words (Home, Resume, LinkedIn) — title case in markup, no all-caps. */
const navLinkEmphasis = 'font-semibold tracking-tight text-white';

const defaultIconProps = { strokeWidth: 2, 'aria-hidden': true };

function HubAmberLink({
  href,
  downloadName,
  children,
  icon: Icon,
  iconProps = defaultIconProps,
  external,
  compact,
  collapseLabelNarrow = false,
  className: classNameProp = '',
}) {
  const baseCompact =
    'nav-amber-wrap relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-2 text-left text-xs font-medium text-white no-underline max-md:py-1';
  const baseFull =
    'nav-amber-wrap relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-start gap-1.5 whitespace-nowrap pl-2 text-left text-xs font-medium text-white no-underline md:gap-2 md:pl-4 md:text-sm';

  const className = [compact ? baseCompact : baseFull, classNameProp].filter(Boolean).join(' ');

  const innerClass = `relative z-10 inline-flex items-center gap-2 ${navLinkEmphasis}`;

  const label =
    collapseLabelNarrow && children != null ? (
      <span className="max-[399px]:sr-only">{children}</span>
    ) : (
      children
    );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span className={innerClass}>
          {Icon ? <Icon className="size-4 shrink-0" {...iconProps} /> : null}
          {label}
        </span>
        <div className="nav-amber-glow-bar" aria-hidden />
      </a>
    );
  }

  return (
    <a href={href} download={downloadName} className={className}>
      <span className={innerClass}>
        {Icon ? <Icon className="size-4 shrink-0" {...iconProps} /> : null}
        {label}
      </span>
      <div className="nav-amber-glow-bar" aria-hidden />
    </a>
  );
}

const MD_BREAKPOINT = '(max-width: 767px)';
/** Left edge of main column must clear this (viewport px) before we leave top-bar overlap mode. */
const TOP_BAR_RELEASE_MIN_LEFT = 216;
const NAV_CONTENT_GAP = 10;

export default function Resume() {
  const { personal, education, skills, projects, experience } = resumeData;
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const scrollRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [isMaxMd, setIsMaxMd] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MD_BREAKPOINT).matches
  );
  const [forceOverlapTopBar, setForceOverlapTopBar] = useState(false);
  const forceOverlapRef = useRef(false);
  const reduceMotion = Framer.useReducedMotion();

  const topBarActive = isMaxMd || forceOverlapTopBar;
  /** Wide viewport but resume column overlapped corner nav — split toolbar + right nav cluster. */
  const desktopOverlapBar = forceOverlapTopBar;

  useEffect(() => {
    forceOverlapRef.current = forceOverlapTopBar;
  }, [forceOverlapTopBar]);

  const runLayoutCheck = useCallback(() => {
    const maxMd = window.matchMedia(MD_BREAKPOINT).matches;
    setIsMaxMd(maxMd);
    if (maxMd) {
      setForceOverlapTopBar(false);
      return;
    }

    const navEl = navRef.current;
    const contentEl = scrollRef.current;
    if (!navEl || !contentEl) return;

    const contentLeft = contentEl.getBoundingClientRect().left;

    if (forceOverlapRef.current) {
      if (contentLeft >= TOP_BAR_RELEASE_MIN_LEFT) {
        setForceOverlapTopBar(false);
      }
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    if (contentLeft < navRect.right + NAV_CONTENT_GAP) {
      setForceOverlapTopBar(true);
    }
  }, []);

  useLayoutEffect(() => {
    runLayoutCheck();
  }, [runLayoutCheck]);

  useEffect(() => {
    const mq = window.matchMedia(MD_BREAKPOINT);
    const onMq = () => runLayoutCheck();
    mq.addEventListener('change', onMq);
    window.addEventListener('resize', runLayoutCheck);

    const root = rootRef.current;
    const ro =
      root &&
      new ResizeObserver(() => {
        requestAnimationFrame(runLayoutCheck);
      });
    if (root && ro) ro.observe(root);

    return () => {
      mq.removeEventListener('change', onMq);
      window.removeEventListener('resize', runLayoutCheck);
      ro?.disconnect();
    };
  }, [runLayoutCheck]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateOverflow = () => {
      setHasOverflow(el.scrollHeight > el.clientHeight + 8);
    };

    const onResize = () => {
      updateOverflow();
      requestAnimationFrame(runLayoutCheck);
    };

    updateOverflow();
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    const onScroll = () => {
      if (el.scrollTop > 32) setHintDismissed(true);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, [runLayoutCheck]);

  const showScrollHint = hasOverflow && !hintDismissed;
  /** Phones only: scrolling is obvious; keep hint from md (tablet) up. */
  const showScrollHintUi = showScrollHint && !isMaxMd;

  return (
    <div
      ref={rootRef}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden font-satoshi text-white"
    >
      <nav
        ref={navRef}
        className={
          desktopOverlapBar
            ? 'z-[60] pointer-events-none flex flex-col items-end gap-1 border-0 bg-transparent px-4 pb-2 pt-[max(0.375rem,env(safe-area-inset-top,0px))] scrollbar-none sm:px-6 fixed inset-x-0 top-0'
            : topBarActive
              ? 'resume-mobile-nav-pill z-[60] pointer-events-none flex flex-col items-end gap-1 border-0 bg-transparent px-4 pb-2 pt-[max(0.375rem,env(safe-area-inset-top,0px))] sm:px-6 fixed inset-x-0 top-0'
              : 'z-[60] site-fixed-nav-tl flex flex-col items-start gap-4 overflow-visible border-0 bg-transparent px-0 py-0'
        }
        aria-label="Resume navigation and downloads"
      >
        {desktopOverlapBar ? (
          <>
            <div className={resumeNavPillShell}>
              <Link
                to="/"
                state={hubEnterStateForPath('/resume')}
                onClick={() => markPageLeavingToHub('/resume')}
                className={`btn-theme btn-theme-compact flex shrink-0 items-center gap-2 px-2.5 py-1 text-xs no-underline sm:px-3 sm:text-sm ${navLinkEmphasis}`}
              >
                <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                Home
              </Link>
              <HubAmberLink
                href="/erik_smith_resume.pdf"
                downloadName="erik_smith_resume.pdf"
                icon={Download}
                compact
                classNameProp="sm:text-sm"
              >
                Resume (PDF)
              </HubAmberLink>
              <HubAmberLink
                href={LINKEDIN_HREF}
                external
                icon={LinkedInLogo}
                iconProps={{ 'aria-hidden': true }}
                compact
                classNameProp="sm:text-sm"
              >
                LinkedIn
              </HubAmberLink>
            </div>
            {showScrollHintUi ? (
              <div
                className="pointer-events-none flex w-full flex-col items-center gap-0.5 pb-1.5 pt-1"
                aria-hidden
              >
                <Framer.motion.span
                  className="text-center text-[10px] font-semibold tracking-wide text-white/55"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Scroll
                </Framer.motion.span>
                <Framer.motion.span
                  className="flex justify-center text-white"
                  animate={reduceMotion ? { y: 0 } : { y: [0, HUB_NAV_PULSE_Y, 0] }}
                  transition={reduceMotion ? { duration: 0 } : HUB_NAV_EDGE_PULSE_TRANSITION}
                >
                  <ChevronDown className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
                </Framer.motion.span>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {topBarActive ? (
              <>
                <div className={resumeNavPillShell}>
                  <Link
                    to="/"
                    state={hubEnterStateForPath('/resume')}
                    onClick={() => markPageLeavingToHub('/resume')}
                    aria-label="Home"
                    className={`btn-theme btn-theme-compact flex shrink-0 items-center gap-2 text-xs no-underline max-md:px-2 max-md:py-1 ${navLinkEmphasis}`}
                  >
                    <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                    <span className="max-[399px]:sr-only">Home</span>
                  </Link>
                  <HubAmberLink
                    href="/erik_smith_resume.pdf"
                    downloadName="erik_smith_resume.pdf"
                    icon={Download}
                    compact
                    collapseLabelNarrow
                  >
                    Resume (PDF)
                  </HubAmberLink>
                  <HubAmberLink
                    href={LINKEDIN_HREF}
                    external
                    icon={LinkedInLogo}
                    iconProps={{ 'aria-hidden': true }}
                    compact
                    collapseLabelNarrow
                  >
                    LinkedIn
                  </HubAmberLink>
                </div>
                {showScrollHintUi ? (
                  <div
                    className="pointer-events-none flex w-full flex-col items-center gap-0.5 pb-0.5 pt-1"
                    aria-hidden
                  >
                    <Framer.motion.span
                      className="text-center text-[10px] font-semibold tracking-wide text-white/55"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Scroll
                    </Framer.motion.span>
                    <Framer.motion.span
                      className="flex justify-center text-white"
                      animate={reduceMotion ? { y: 0 } : { y: [0, HUB_NAV_PULSE_Y, 0] }}
                      transition={reduceMotion ? { duration: 0 } : HUB_NAV_EDGE_PULSE_TRANSITION}
                    >
                      <ChevronDown className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
                    </Framer.motion.span>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  state={hubEnterStateForPath('/resume')}
                  onClick={() => markPageLeavingToHub('/resume')}
                  className={`btn-theme btn-theme-compact flex shrink-0 items-center gap-2 px-3 py-2 text-xs no-underline md:px-4 md:py-2.5 md:text-sm ${navLinkEmphasis}`}
                >
                  <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                  Home
                </Link>
                <HubAmberLink
                  href="/erik_smith_resume.pdf"
                  downloadName="erik_smith_resume.pdf"
                  icon={Download}
                  compact={false}
                >
                  Resume (PDF)
                </HubAmberLink>
                <HubAmberLink
                  href={LINKEDIN_HREF}
                  external
                  icon={LinkedInLogo}
                  iconProps={{ 'aria-hidden': true }}
                  compact={false}
                >
                  LinkedIn
                </HubAmberLink>
                {showScrollHintUi ? (
                  <div className="pointer-events-none mt-0.5 flex w-fit shrink-0 flex-col items-center gap-0.5 md:mt-[4.75rem]" aria-hidden>
                    <Framer.motion.span
                      className="text-center text-[10px] font-semibold tracking-wide text-white/55"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Scroll
                    </Framer.motion.span>
                    <Framer.motion.span
                      className="flex justify-center text-white"
                      animate={reduceMotion ? { y: 0 } : { y: [0, HUB_NAV_PULSE_Y, 0] }}
                      transition={reduceMotion ? { duration: 0 } : HUB_NAV_EDGE_PULSE_TRANSITION}
                    >
                      <ChevronDown className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
                    </Framer.motion.span>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </nav>

      <div
        className={
          desktopOverlapBar
            ? showScrollHintUi
              ? 'relative flex h-full min-h-0 flex-1 justify-end px-4 pb-10 pt-[calc(7.1rem+max(0.5rem,env(safe-area-inset-top,0px)))] sm:px-6 sm:pt-[calc(7.35rem+max(0.5rem,env(safe-area-inset-top,0px)))]'
              : 'relative flex h-full min-h-0 flex-1 justify-end px-4 pb-10 pt-[calc(5.25rem+max(0.5rem,env(safe-area-inset-top,0px)))] sm:px-6 sm:pt-[calc(5.4rem+max(0.5rem,env(safe-area-inset-top,0px)))]'
            : topBarActive
              ? showScrollHintUi
                ? 'relative flex h-full min-h-0 flex-1 justify-center px-4 pb-10 pt-[calc(6.85rem+env(safe-area-inset-top,0px))]'
                : 'relative flex h-full min-h-0 flex-1 justify-center px-4 pb-10 pt-[calc(5.35rem+env(safe-area-inset-top,0px))]'
              : 'relative flex h-full min-h-0 flex-1 justify-center px-4 pb-10 md:px-10 md:pl-28 md:pt-20'
        }
      >
        <div
          ref={scrollRef}
          className={`scrollbar-none min-h-0 flex-1 overflow-y-auto pb-12 ${desktopOverlapBar ? 'w-full max-w-3xl pl-2 sm:pl-4' : 'w-full max-w-3xl'}`}
        >
          <header
            className={
              desktopOverlapBar
                ? 'mb-10 mt-5 sm:mt-6'
                : topBarActive
                  ? 'mb-10 mt-5'
                  : 'mb-10'
            }
          >
            {desktopOverlapBar ? (
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{personal.name}</h1>
                <ul className="mt-4 flex flex-col gap-1.5 text-sm text-white md:text-base">
                  <li>
                    <a
                      className="text-white underline-offset-2 hover:underline"
                      href={`mailto:${personal.email}`}
                    >
                      {personal.email}
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-white underline-offset-2 hover:underline"
                      href={`tel:+1${personal.phone}`}
                    >
                      {personal.phone}
                    </a>
                  </li>
                  <li className="text-white">{personal.linkedin}</li>
                </ul>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{personal.name}</h1>
                <ul className="mt-4 flex flex-col gap-1.5 text-sm text-white md:text-base">
                  <li>
                    <a className="text-white underline-offset-2 hover:underline" href={`mailto:${personal.email}`}>
                      {personal.email}
                    </a>
                  </li>
                  <li>
                    <a className="text-white underline-offset-2 hover:underline" href={`tel:+1${personal.phone}`}>
                      {personal.phone}
                    </a>
                  </li>
                  <li className="text-white">{personal.linkedin}</li>
                </ul>
              </>
            )}
          </header>

          <section className="mb-10" aria-labelledby="resume-education">
            <h2 id="resume-education" className="text-xs font-semibold tracking-tight text-white">
              Education
            </h2>
            {education.map((ed) => (
              <div key={`${ed.institution}-${ed.dates}`} className="mt-4">
                <p className="font-semibold text-white">{ed.degree}</p>
                <p className="mt-1 text-sm text-white">{ed.institution}</p>
                <p className="mt-1 text-sm text-white">{ed.details}</p>
                <p className="mt-2 text-sm text-white">
                  {ed.dates}
                  <span className="mx-2 text-white/40" aria-hidden>
                    ·
                  </span>
                  {ed.location}
                </p>
              </div>
            ))}
          </section>

          <section className="mb-10" aria-labelledby="resume-skills">
            <h2 id="resume-skills" className="text-xs font-semibold tracking-tight text-white">
              Skills
            </h2>
            <ul className="mt-4 flex flex-col gap-5">
              {skills.map((s) => (
                <li key={s.category}>
                  <p className="font-semibold text-white">{s.category}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white">{s.items}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10" aria-labelledby="resume-projects">
            <h2 id="resume-projects" className="text-xs font-semibold tracking-tight text-white">
              Projects
            </h2>
            <div className="mt-4 flex flex-col gap-5">
              {projects.map((p) => (
                <article key={p.name} className={glassCard}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                    <p className="text-sm text-white">{p.dates}</p>
                  </div>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white">
                    {p.bullets.map((b, i) => (
                      <li key={`${p.name}-b-${i}`}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-6" aria-labelledby="resume-experience">
            <h2 id="resume-experience" className="text-xs font-semibold tracking-tight text-white">
              Experience
            </h2>
            <div className="mt-4 flex flex-col gap-5">
              {experience.map((job) => (
                <article key={`${job.company}-${job.dates}`} className={glassCard}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <p className="mt-0.5 text-sm font-medium text-white">{job.company}</p>
                    </div>
                    <div className="text-sm text-white">
                      <p>{job.dates}</p>
                      <p className="text-white">{job.location}</p>
                    </div>
                  </div>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white">
                    {job.bullets.map((b, i) => (
                      <li key={`${job.company}-b-${i}`}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
