import DeviceClayPhoneFrame from '../components/DeviceClayPhoneFrame';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';

const HEMOTYPE_SRC = '/coming-soon/hemotype.svg';

export default function ComingSoon() {
  return (
    <div className="min-h-[100svh] px-4 pb-16 pt-4 text-white md:px-8 md:pb-20 md:pt-10">
      <ReturnToPortfolioButton />

      <div className="relative isolate mx-auto max-w-5xl overflow-hidden glass-hub-sheet glass-hub-sheet--no-backdrop p-6 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[linear-gradient(125deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.07)_14%,rgba(255,255,255,0.02)_26%,transparent_46%)] mix-blend-overlay"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[radial-gradient(120%_85%_at_0%_0%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_22%,transparent_55%)] mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[linear-gradient(305deg,transparent_62%,rgba(255,255,255,0.03)_82%,rgba(255,255,255,0.08)_100%)] opacity-90 mix-blend-overlay"
          aria-hidden
        />
        <div className="relative z-[2] isolate">
          <header className="mb-10 max-w-2xl md:mb-12">
            <p className="text-xs font-semibold tracking-tight text-white">Coming soon</p>
            <h1 className="page-heading-xl mt-2 text-white">In the lab</h1>
            <p className="mt-3 text-base leading-relaxed text-white md:mt-4">
              Two product surfaces in progress<span className="text-white/90"> · </span>
              framed as hardware mockups below. Replace assets as builds land.
            </p>
          </header>

          <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
            <div className="flex flex-col items-center gap-4">
              <DeviceClayPhoneFrame variant="android" label="Android phone showing HemoType app screen">
                <img
                  src={HEMOTYPE_SRC}
                  alt="HemoType — clinical typography app preview"
                  className="absolute inset-0 size-full object-cover object-top"
                  width={360}
                  height={780}
                  loading="lazy"
                  decoding="async"
                />
              </DeviceClayPhoneFrame>
              <p className="text-center text-sm font-medium text-white">HemoType</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <DeviceClayPhoneFrame variant="iphone" label="iPhone showing Leah PM app placeholder">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200/95 p-6 text-center">
                  <p className="text-xs font-semibold tracking-tight text-slate-600">Placeholder</p>
                  <p className="mt-3 text-lg font-semibold leading-snug text-slate-900 md:text-xl">
                    Leah&apos;s PM App
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Product management experience — screens and flows TBD.
                  </p>
                </div>
              </DeviceClayPhoneFrame>
              <p className="text-center text-sm font-medium text-white">Leah&apos;s PM App</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
