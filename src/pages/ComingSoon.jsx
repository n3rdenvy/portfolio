import DeviceClayPhoneFrame from '../components/DeviceClayPhoneFrame';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';

const HEMOTYPE_SRC = '/coming-soon/hemotype.svg';

export default function ComingSoon() {
  return (
    <div className="min-h-[100svh] bg-slateBg text-white">
      <ReturnToPortfolioButton />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:px-8 md:pt-24">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold tracking-tight text-white">Coming soon</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
            In the lab
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white md:text-base">
            Two product surfaces in progress<span className="text-white/90"> · </span>
            framed as hardware mockups below. Replace assets as builds land.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-end gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
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
  );
}
