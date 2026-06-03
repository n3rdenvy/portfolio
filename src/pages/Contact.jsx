import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Laugh, MapPin } from 'lucide-react';
import PageShell from '../components/PageShell';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';
import ReturnToHub from '../components/ReturnToHub';

/** Tighter desktop gutters than default hub pages; matches Contact body grid. */
const CONTACT_LG_TWO_COL = 'lg:grid lg:grid-cols-2 lg:gap-x-6 lg:items-stretch';

const LAUGH_VIDEO_URL =
  'https://youtu.be/Ygg0bXls8CA?si=Omfyd8lGAihIkPJF&t=19';

const INBOX_EMAIL = 'n3rdenvy@gmail.com';

const BONUS_SMALL_WIN_PLACEHOLDER =
  "I'll go first, someone took the time to look at my website. Thank you!";

/** Shared shell for bonus text fields and the “Make me laugh” row (full width, same footprint). */
const bonusFullWidthShell =
  'mt-2 w-full rounded-xl border border-white/10 bg-slateBg/90 px-3 py-2 text-sm';

const bonusTextInputClass = `${bonusFullWidthShell} text-white placeholder:text-white/45 focus:border-white/35 focus:outline-none focus:ring-1 focus:ring-white/25`;

const bonusLaughLinkClass = `bonus-laugh-link ${bonusFullWidthShell} flex items-center justify-center gap-2 font-medium text-white no-underline transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45`;

function formatIsoDateForMessage(iso) {
  if (!iso || typeof iso !== 'string') return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { dateStyle: 'long' });
}

function hasAnyFormContent(data) {
  return (
    data.name.trim() !== '' ||
    data.project.trim() !== '' ||
    data.outcome.trim() !== '' ||
    data.scopeStart.trim() !== '' ||
    data.scopeEnd.trim() !== '' ||
    data.deploymentDate.trim() !== '' ||
    data.bonusSlider !== 5 ||
    data.bonusSmallWin.trim() !== '' ||
    data.bonusAwesome.trim() !== ''
  );
}

/** Cohesive message body for live preview and mailto. */
function buildSubmissionMessage(data) {
  if (!hasAnyFormContent(data)) return '';

  const paragraphs = [];

  if (data.name.trim()) {
    paragraphs.push(`Hi Erik, I'm ${data.name.trim()}. Thanks for making it easy to reach out.`);
  } else {
    paragraphs.push('Hi Erik,');
  }

  if (data.project.trim()) {
    paragraphs.push(
      `Here's what I'd like us to build together: ${data.project.trim()}`
    );
  }

  const timingLines = [];
  if (data.scopeStart.trim() || data.scopeEnd.trim()) {
    const a = formatIsoDateForMessage(data.scopeStart.trim());
    const b = formatIsoDateForMessage(data.scopeEnd.trim());
    if (a && b) {
      timingLines.push(`Intended project scope: ${a} – ${b}`);
    } else if (a) {
      timingLines.push(`Intended project scope (start): ${a}`);
    } else if (b) {
      timingLines.push(`Intended project scope (end): ${b}`);
    }
  }
  if (data.deploymentDate.trim()) {
    timingLines.push(`Wished deployment date: ${formatIsoDateForMessage(data.deploymentDate.trim())}`);
  }
  if (timingLines.length) {
    paragraphs.push(timingLines.join('\n'));
  }

  if (data.outcome.trim()) {
    paragraphs.push(
      `Fast-forwarding to the finish line: this feels like a massive success when: ${data.outcome.trim()}`
    );
  }

  const n = Number(data.bonusSlider);
  const bonusActive =
    data.bonusSlider !== 5 ||
    data.bonusSmallWin.trim() !== '' ||
    data.bonusAwesome.trim() !== '';

  if (bonusActive) {
    let bonus = `Bonus round: my day's sitting at about ${n} out of 10.`;
    if (n <= 4) {
      bonus += ` It's been a little rough; I might tap your "Make me laugh" link for a reset.`;
    } else if (n <= 7) {
      if (data.bonusSmallWin.trim()) {
        bonus += ` A small win today: ${data.bonusSmallWin.trim()}`;
      } else {
        bonus += ` Steady day; nothing huge to report yet.`;
      }
    } else if (data.bonusAwesome.trim()) {
      bonus += ` Right now feels awesome because ${data.bonusAwesome.trim()}`;
    } else {
      bonus += ` Riding a high. Thanks for asking.`;
    }
    paragraphs.push(bonus);
  }

  paragraphs.push('Sent via your portfolio contact form');

  return paragraphs.join('\n\n');
}

const INITIAL_FORM = {
  name: '',
  project: '',
  outcome: '',
  scopeStart: '',
  scopeEnd: '',
  deploymentDate: '',
  bonusSlider: 5,
  bonusSmallWin: '',
  bonusAwesome: '',
};

const dateInputClass =
  'w-full rounded-xl border border-white/10 bg-slateBg/90 px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/35 focus:outline-none focus:ring-1 focus:ring-white/25';

/** Mobile: grows in column. lg+: fixed min height, grows downward with resize only (no flex steal from center). */
const submissionDraftTextareaClass =
  'w-full min-h-[10rem] flex-1 basis-0 resize-y rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white placeholder:text-white/45 focus:border-white/35 focus:outline-none focus:ring-1 focus:ring-white/25 sm:p-6 sm:text-base lg:max-h-[min(50vh,32rem)] lg:flex-none lg:basis-auto';

const ACCORDION_SECTIONS = [
  {
    id: 'name',
    title: 'Your name',
    subtitle: null,
    field: 'name',
    type: 'text',
    placeholder: 'Your name',
  },
  {
    id: 'project',
    title: 'What are we building together?',
    subtitle: '(Tell me a little about your project)',
    field: 'project',
    type: 'textarea',
    placeholder: 'Project context, goals, audience, or whatever helps.',
  },
  {
    id: 'timeline',
    title: 'Scope & deployment',
    subtitle: 'Pick a span for the build window and a target go-live date.',
    field: null,
    type: 'dates',
    placeholder: '',
  },
  {
    id: 'outcome',
    title: 'Fast forward to the end. What makes this a massive success?',
    subtitle: null,
    field: 'outcome',
    type: 'textarea',
    placeholder: 'Paint the picture of the win.',
  },
  {
    id: 'bonus',
    title: 'Bonus Points: How is your day going?',
    subtitle: null,
    field: null,
    type: 'bonus',
    placeholder: '',
  },
];

function TimelineDateFields({ scopeStart, scopeEnd, deploymentDate, updateField }) {
  return (
    <div className="space-y-5">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="block text-sm font-medium text-white">Intended project scope</legend>
        <p className="mt-1 text-xs text-white">Select start and end dates for the work window.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-white" htmlFor="field-scope-start">
              Start
            </label>
            <input
              id="field-scope-start"
              type="date"
              value={scopeStart}
              max={scopeEnd || undefined}
              onChange={(e) => updateField('scopeStart', e.target.value)}
              className={dateInputClass}
              aria-label="Intended project scope, start date"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white" htmlFor="field-scope-end">
              End
            </label>
            <input
              id="field-scope-end"
              type="date"
              value={scopeEnd}
              min={scopeStart || undefined}
              onChange={(e) => updateField('scopeEnd', e.target.value)}
              className={dateInputClass}
              aria-label="Intended project scope, end date"
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label className="block text-sm font-medium text-white" htmlFor="field-deployment-date">
          Wished deployment date
        </label>
        <p className="mt-1 text-xs text-white">Target date you&apos;d like this live.</p>
        <input
          id="field-deployment-date"
          type="date"
          value={deploymentDate}
          onChange={(e) => updateField('deploymentDate', e.target.value)}
          className={`${dateInputClass} mt-2`}
          aria-label="Wished deployment date"
        />
      </div>
    </div>
  );
}

function BonusPointsFields({ bonusSlider, bonusSmallWin, bonusAwesome, updateField }) {
  const n = Number(bonusSlider);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-white" htmlFor="bonus-slider">
          Day meter (1 = rough, 10 = stellar)
        </label>
        <input
          id="bonus-slider"
          type="range"
          min={1}
          max={10}
          step={1}
          value={n}
          onChange={(e) => updateField('bonusSlider', Number(e.target.value))}
          className="mt-3 h-2 w-full cursor-pointer accent-white"
        />
        <div className="mt-2 flex justify-between text-xs text-white">
          <span>1</span>
          <span className="font-medium text-white">{n}</span>
          <span>10</span>
        </div>
      </div>

      {n <= 4 ? (
        <a
          href={LAUGH_VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={bonusLaughLinkClass}
        >
          <Laugh className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
          Make me laugh
        </a>
      ) : null}

      {n >= 5 && n <= 7 ? (
        <div>
          <label className="block text-sm text-white" htmlFor="bonus-small-win">
            What is a small win you&apos;ve had today?
          </label>
          <input
            id="bonus-small-win"
            type="text"
            value={bonusSmallWin}
            onChange={(e) => updateField('bonusSmallWin', e.target.value)}
            className={bonusTextInputClass}
            placeholder={BONUS_SMALL_WIN_PLACEHOLDER}
          />
        </div>
      ) : null}

      {n >= 8 && n <= 10 ? (
        <div>
          <label className="block text-sm text-white" htmlFor="bonus-awesome">
            Hell yeah! What makes right now so awesome?
          </label>
          <input
            id="bonus-awesome"
            type="text"
            value={bonusAwesome}
            onChange={(e) => updateField('bonusAwesome', e.target.value)}
            className={bonusTextInputClass}
            placeholder="Share the good energy"
          />
        </div>
      ) : null}
    </div>
  );
}

function AccordionRow({ id, title, subtitle, isOpen, onToggle, children, panelId }) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <h2 className="m-0">
        <button
          type="button"
          id={`${panelId}-trigger`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(id)}
          className="btn-theme btn-theme-disclosure flex items-start gap-3 py-4 text-base font-medium text-white"
        >
          <ChevronDown
            className={`mt-0.5 size-5 shrink-0 text-white transition-transform duration-300 ease-out ${isOpen ? '-rotate-180' : ''}`}
            strokeWidth={2}
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="block">{title}</span>
            {subtitle ? (
              <span className="mt-1 block text-sm font-normal leading-snug text-white">{subtitle}</span>
            ) : null}
          </span>
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pt-1">
            <div className="glass p-4 sm:p-5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const accordionRevealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.42 } },
};

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [draftBody, setDraftBody] = useState('');
  /** After the visitor edits the draft textarea, stop overwriting from the accordion form. */
  const skipFormDraftSyncRef = useRef(false);

  const toggleAccordion = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (skipFormDraftSyncRef.current) return;
    setDraftBody(buildSubmissionMessage(formData));
  }, [formData]);

  const canSubmit = draftBody.trim().length > 0;

  const mailSubject = formData.name.trim()
    ? `Portfolio note from ${formData.name.trim()}`
    : 'Portfolio contact';

  const mailtoHref = canSubmit
    ? `mailto:${INBOX_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(draftBody.trim())}`
    : undefined;

  const contactDetails = (headingId) => (
    <section className="w-full shrink-0" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xs font-semibold tracking-tight text-white">
        Contact
      </h2>
      <ul className="mt-4 space-y-3 text-sm">
        <li>
          <a
            href={`mailto:${INBOX_EMAIL}`}
            className="group flex items-start gap-2 text-white underline-offset-4 transition-colors hover:text-white"
          >
            <ArrowUpRight
              className="mt-0.5 size-4 shrink-0 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
              aria-hidden
            />
            <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-white/50">
              {INBOX_EMAIL}
            </span>
            <span className="sr-only">(opens email)</span>
          </a>
        </li>
        <li className="flex items-start gap-2 text-white">
          <MapPin className="mt-0.5 size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
          <span>Philadelphia, PA</span>
        </li>
      </ul>
    </section>
  );

  return (
    <PageShell width="process">
      <ReturnToHub mobileLayout="pill-end" />

      {/*
        lg+: soft dissolve under fixed Home so scrolled copy never reads as colliding with the button.
        Below nav anchor (matches .site-fixed-nav-tl top offset).
      */}
      <div
        className="contact-scroll-mask pointer-events-none fixed inset-x-0 z-[58] hidden h-28 bg-gradient-to-b from-slateBg via-slateBg/85 to-transparent lg:block"
        style={{
          top: 'calc(2rem + env(safe-area-inset-top, 0px))',
        }}
        aria-hidden
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col pb-20 pt-4 max-md:pt-[3.85rem] md:pt-8 lg:mx-auto lg:min-h-0 lg:w-full lg:max-w-4xl">
        <HubPageHeadingRow gridClassName={CONTACT_LG_TWO_COL}>
          <HubPageHeading title="Let's chat" className="[&_h1]:mb-0" />
        </HubPageHeadingRow>

        {/*
          Mobile: intro → accordions → contact → submission (stacked).
          lg+: intro + contact (left, vertically centered) | accordions fill column (no dead flex gap).
          Submission is full-width along the bottom; extra input height grows downward.
        */}
        <div className="mt-3 flex min-h-0 flex-1 flex-col md:mt-4 lg:mt-1 lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col justify-start lg:min-h-0 lg:justify-center">
            <div className="grid grid-cols-1 gap-8 lg:min-h-0 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 lg:items-stretch">
              <div className="flex min-w-0 flex-col gap-6 lg:justify-center lg:gap-8">
                <p className="text-base leading-relaxed text-white lg:pr-6">
                  I&apos;m all ears (and eyes). Use the drop down menus below to dump your entire brain or just give me
                  the highlight reel. Shorter responses are allowed, but if you want to hit me with a beautiful wall of
                  text, I can take it. Don&apos;t hold back and let&apos;s see where we can take this!
                </p>
                <div className="hidden lg:block">{contactDetails('contact-heading-lg')}</div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-col lg:h-full lg:min-h-0">
                <section
                  className="min-w-0 shrink-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto scrollbar-none"
                  aria-labelledby="form-heading"
                >
                  <h2 id="form-heading" className="sr-only">
                    Project inquiry form
                  </h2>
                  <motion.div
                    className="lg:min-h-0 lg:flex-1"
                    initial={reduceMotion ? false : 'hidden'}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={reduceMotion ? {} : {
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.07 } },
                    }}
                  >
                    {ACCORDION_SECTIONS.map((section) => {
                        const panelId = `contact-panel-${section.id}`;
                        const isOpen = activeAccordion === section.id;

                        return (
                          <motion.div
                            key={section.id}
                            variants={reduceMotion ? {} : accordionRevealVariants}
                          >
                            <AccordionRow
                              id={section.id}
                              title={section.title}
                              subtitle={section.subtitle}
                              isOpen={isOpen}
                              onToggle={toggleAccordion}
                              panelId={panelId}
                            >
                              {section.type === 'bonus' ? (
                                <BonusPointsFields
                                  bonusSlider={formData.bonusSlider}
                                  bonusSmallWin={formData.bonusSmallWin}
                                  bonusAwesome={formData.bonusAwesome}
                                  updateField={updateField}
                                />
                              ) : section.type === 'dates' ? (
                                <TimelineDateFields
                                  scopeStart={formData.scopeStart}
                                  scopeEnd={formData.scopeEnd}
                                  deploymentDate={formData.deploymentDate}
                                  updateField={updateField}
                                />
                              ) : section.type === 'textarea' ? (
                                <textarea
                                  id={`field-${section.field}`}
                                  rows={4}
                                  value={formData[section.field]}
                                  onChange={(e) => updateField(section.field, e.target.value)}
                                  placeholder={section.placeholder}
                                  className="w-full resize-y rounded-xl border border-white/10 bg-slateBg/90 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:border-white/35 focus:outline-none focus:ring-1 focus:ring-white/25"
                                />
                              ) : (
                                <input
                                  id={`field-${section.field}`}
                                  type="text"
                                  value={formData[section.field]}
                                  onChange={(e) => updateField(section.field, e.target.value)}
                                  placeholder={section.placeholder}
                                  className="w-full rounded-xl border border-white/10 bg-slateBg/90 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:border-white/35 focus:outline-none focus:ring-1 focus:ring-white/25"
                                />
                              )}
                            </AccordionRow>
                          </motion.div>
                        );
                      })}
                  </motion.div>
                </section>
              </div>

              <div className="lg:hidden">{contactDetails('contact-heading-sm')}</div>
            </div>
          </div>

          <section
            className="mt-10 flex w-full shrink-0 flex-col gap-3 lg:mt-auto lg:flex-none lg:border-t lg:border-white/10 lg:pt-6 lg:gap-4"
            aria-labelledby="submission-preview-heading"
          >
            <h2
              id="submission-preview-heading"
              className="shrink-0 text-lg font-semibold tracking-tight text-white"
            >
              Your submission
            </h2>
            <p className="shrink-0 text-sm leading-relaxed text-white">
              Use the questions to build a draft, or paste and write freely here — send works whenever this box has
              something in it.
            </p>
            <label htmlFor="submission-draft" className="sr-only">
              Message draft. Edit before sending
            </label>
            <textarea
              id="submission-draft"
              value={draftBody}
              onChange={(e) => {
                skipFormDraftSyncRef.current = true;
                setDraftBody(e.target.value);
              }}
              placeholder="Fill the questions and this updates for you — or paste your own message and send anytime."
              className={submissionDraftTextareaClass}
            />

            <div className="w-full shrink-0 pt-1 lg:pt-0">
              {canSubmit ? (
                <a
                  href={mailtoHref}
                  className="btn-theme btn-theme-contact-send inline-flex w-full items-center justify-center px-6 py-4 text-center text-base font-semibold no-underline"
                >
                  Send straight to Erik&apos;s inbox
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="btn-theme btn-theme-contact-send inline-flex w-full cursor-not-allowed items-center justify-center px-6 py-4 text-center text-base font-semibold"
                  title="Add content to the form or type a message to enable send"
                >
                  Send straight to Erik&apos;s inbox
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
