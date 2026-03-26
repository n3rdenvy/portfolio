/**
 * Hardware-style bezel: light `device-frame-clay` surface for contrast on shark slate page chrome.
 */
export default function DeviceClayPhoneFrame({ variant, label, children, className = '' }) {
  const isAndroid = variant === 'android';

  return (
    <figure className={`mx-auto w-full max-w-[min(100%,15.5rem)] sm:max-w-[17rem] ${className}`}>
      <figcaption className="sr-only">{label}</figcaption>
      <div
        className={
          isAndroid
            ? 'device-frame-clay rounded-[1.65rem] p-2.5 pb-3'
            : 'device-frame-clay rounded-[2.35rem] p-2.5 pb-3'
        }
      >
        {isAndroid ? (
          <div className="mb-2 flex justify-center" aria-hidden>
            <span className="size-2 rounded-full bg-slate-400/80 ring-1 ring-slate-900/10" />
          </div>
        ) : (
          <div
            className="mx-auto mb-2 flex h-7 w-[34%] min-w-[5.5rem] items-center justify-center rounded-full bg-slate-900/[0.06] ring-1 ring-slate-900/10"
            aria-hidden
          >
            <span className="h-1.5 w-11 rounded-full bg-slate-900/20" />
          </div>
        )}

        <div className="relative aspect-[9/19] w-full overflow-hidden rounded-xl bg-white ring-1 ring-slate-900/10">
          {children}
        </div>

        <div className="mt-2 flex justify-center" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-slate-900/15" />
        </div>
      </div>
    </figure>
  );
}
