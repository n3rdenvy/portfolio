import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';
import HubPageHeading, { HubPageHeadingRow } from '../components/HubPageHeading';

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{children}</p>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/60">
      {children}
    </span>
  );
}

function CaseStudyImage({ src, alt, caption, wide = false }) {
  return (
    <figure className={wide ? 'col-span-full' : ''}>
      <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <img src={src} alt={alt} className="w-full object-cover" draggable={false} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-[11px] text-white/35 leading-snug">{caption}</figcaption>
      )}
    </figure>
  );
}

export default function IkeaWork() {
  return (
    <PageShell width="wide">
      <ReturnToHub mobileLayout="pill-end" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-24 pt-4 max-md:pt-[3.85rem] md:pt-8">

        {/* Header */}
        <HubPageHeadingRow>
          <div className="min-w-0 pl-6 sm:pl-7 md:pl-10 lg:pl-12">
            <HubPageHeading
              title="IKEA US Design Strategy"
              subtitle="Interior design strategy, set design, and content production — US market."
            />
          </div>
        </HubPageHeadingRow>

        <div className="mt-8 flex flex-col gap-10 md:mt-10">

          {/* Role strip */}
          <div className="glass-hub-sheet px-6 py-5 md:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: 'Role', value: 'Interior Design Strategist' },
                { label: 'Scope', value: 'US Market, Content Studio' },
                { label: 'Partners', value: 'Ogilvy, Production Companies' },
                { label: 'Output', value: 'Set Design, Range Direction, CAD Drawings' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <SectionLabel>{label}</SectionLabel>
                  <p className="mt-1.5 text-sm font-medium leading-snug text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study 1: The Giving Bag */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <div className="flex flex-col gap-6">

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <SectionLabel>Campaign — January 2023</SectionLabel>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    A Giving Bag
                  </h2>
                  <p className="mt-1 text-base text-white/60 italic">For every kind of everyday</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tag>Living Room</Tag>
                  <Tag>Dining Room</Tag>
                  <Tag>Hallway</Tag>
                  <Tag>Ogilvy</Tag>
                  <Tag>Set Design</Tag>
                </div>
              </div>

              {/* Cover image */}
              <CaseStudyImage
                src="/ikea/gb_cover.png"
                alt="A Giving Bag campaign — room design for every kind of everyday"
                wide
              />

              {/* Problem + Role */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <SectionLabel>The Brief</SectionLabel>
                  <p className="text-sm leading-relaxed text-white/70">
                    IKEA needed to produce campaign content for the US market that felt authentic to how Americans actually live — not translated from Swedish or European home contexts. The rooms needed to read as genuinely local, not aspirationally foreign.
                  </p>
                </div>
                <div className="space-y-2">
                  <SectionLabel>My Role</SectionLabel>
                  <p className="text-sm leading-relaxed text-white/70">
                    Responsible for US market architectural research, range style direction, and the complete set of production deliverables handed to Ogilvy and the production company — from visual identity through to dimensioned CAD wall drawings for set construction.
                  </p>
                </div>
              </div>

              {/* Research */}
              <div className="space-y-3">
                <SectionLabel>Research — US Architectural Context</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Conducted home visits across US dwelling types — urban brownstones, row houses, repurposed lofts, suburban ranch homes, bungalows, Cape Cods. Documented what is structurally real in American homes vs. what reads as foreign or inauthentic: hardwood floors and double-hung windows are universal; vaulted ceilings, ornate fireplaces, and tile floors are not.
                </p>
                <CaseStudyImage
                  src="/ikea/gb_arch_urban.png"
                  alt="Architectural research — US urban dwelling types documented from home visits"
                  caption="Home visit documentation: urban dwelling types across the US market"
                  wide
                />
              </div>

              {/* Style + Collage */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CaseStudyImage
                  src="/ikea/gb_set_design.png"
                  alt="Set design — Scandinavian Traditional style direction"
                  caption="Style direction: Scandinavian Traditional — humanistic red-browns, natural textures, welcoming light"
                />
                <CaseStudyImage
                  src="/ikea/gb_living_collage.png"
                  alt="Living room product collage — Traditional, Rustic, Crafted, Joyful direction"
                  caption="Product collage: living room range selection for the campaign"
                />
              </div>

              {/* Range Style Guide */}
              <div className="space-y-2">
                <SectionLabel>Range Style Guide — Delivered to Ogilvy + Production</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Produced the complete range style guide covering plants and finishes (glass, ceramics, natural fibres), home textiles (cotton, linen, hemp, jute — textural and crafted), and home décor and organization. This document became the on-set reference for the entire production team.
                </p>
              </div>

              {/* CAD Drawings */}
              <div className="space-y-3">
                <SectionLabel>Construction Documents — Dimensioned Set Drawings</SectionLabel>
                <p className="text-sm leading-relaxed text-white/70">
                  Produced full architectural drawings for set construction — wall elevations HB, HD, LA, and DA with precise dimensions, fireplace specs, window placement, stair configuration, and drapery hemming callouts. These went directly to the build team.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <CaseStudyImage
                    src="/ikea/install_wall_hb.png"
                    alt="Architectural drawing — wall HB with fireplace and circular mirror"
                    caption="Wall HB — fireplace elevation"
                  />
                  <CaseStudyImage
                    src="/ikea/install_wall_hd.png"
                    alt="Architectural drawing — wall HD staircase"
                    caption="Wall HD — staircase with LED strip placement"
                  />
                  <CaseStudyImage
                    src="/ikea/install_wall_la.png"
                    alt="Architectural drawing — wall LA windows and drapes"
                    caption={'Wall LA — windows, drapes hemmed to 86"'}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Case Study 2: Ready for College */}
          <div className="glass-hub-sheet p-6 md:p-8">
            <div className="flex flex-col gap-6">

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <SectionLabel>Campaign — FY26 Launch 1</SectionLabel>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Ready for College
                  </h2>
                  <p className="mt-1 text-base text-white/60 italic">IKEA US Content Studio · Conshohocken, PA</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tag>Gen-Z</Tag>
                  <Tag>Dorm</Tag>
                  <Tag>Content Studio</Tag>
                  <Tag>Space Planning</Tag>
                  <Tag>Product Strategy</Tag>
                </div>
              </div>

              {/* Overview */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <SectionLabel>The Brief</SectionLabel>
                  <p className="text-sm leading-relaxed text-white/70">
                    Design a US-authentic college dorm set for Gen-Z students in a shared living situation. A typical US college dorm is 100–200 sq ft, shared with a roommate — everything in the set had to solve for that constraint without feeling aspirational or unrealistic.
                  </p>
                </div>
                <div className="space-y-2">
                  <SectionLabel>Framework</SectionLabel>
                  <p className="text-sm leading-relaxed text-white/70">
                    Built an Activities → Needs → Solutions framework across five student behaviors: Store & Organize, Socializing, Sleep, Studying/Gaming, Getting Ready. Every product on set traces back to a documented need, not a style preference.
                  </p>
                </div>
              </div>

              {/* Activities needs solutions highlight */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <SectionLabel>Activities → Needs → Solutions (sample)</SectionLabel>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                  {[
                    {
                      activity: 'Store & Organize',
                      need: 'Storage for shoes, gaming supplies, laundry, snacks, out-of-season gear',
                      solution: 'Underbed storage for bulk items, JONAXEL shelving for vertical reach, open containers for grab-and-go access',
                    },
                    {
                      activity: 'Socializing',
                      need: 'Easily moved seating so each student can host when needed, store when not',
                      solution: 'Lightweight furniture on casters — moveable, stackable, disappears when the room needs to breathe',
                    },
                    {
                      activity: 'Studying / Gaming',
                      need: 'Gaming workspace that doubles as TV/study space',
                      solution: 'HUVUDSPELARE desk + student\'s own gaming setup already in hand — meet them where they are',
                    },
                  ].map(({ activity, need, solution }) => (
                    <div key={activity} className="space-y-2">
                      <p className="font-semibold text-white">{activity}</p>
                      <p className="text-white/50 text-xs leading-relaxed"><span className="text-white/30">Need: </span>{need}</p>
                      <p className="text-white/70 text-xs leading-relaxed"><span className="text-white/40">Solution: </span>{solution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual identity + 3D */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CaseStudyImage
                  src="/ikea/rfc_visual_identity.png"
                  alt="Ready for College visual identity — Gen-Z Scandinavian Modern color expression"
                  caption="Visual identity: Scandinavian Modern / Color — bold, expressive, Gen-Z coded"
                />
                <CaseStudyImage
                  src="/ikea/rfc_3d_sketch.png"
                  alt="3D room sketch for US Content Studio dorm set"
                  caption="FY24 L4 design sketch — 3D visualization of the set before production"
                />
              </div>

              {/* Product selection */}
              <div className="space-y-3">
                <SectionLabel>Product Selection — 15 Items Specified</SectionLabel>
                <CaseStudyImage
                  src="/ikea/rfc_products.png"
                  alt="Product selection grid — Ready for College campaign"
                  caption="Complete product specification: PILTANDVINGE duvet, LÖPARBANA gaming chair, HUVUDSPELARE desk, KALLAX shelving, VATTENSTEN LED strip, BRÄNNBOLL lounge chair, and 9 others"
                  wide
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
