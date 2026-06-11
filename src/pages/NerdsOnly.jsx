import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CHARACTERS, ROLES, ROLE_ORDER } from '../data/nerdsOnlyCharacters';

/* ─── Character background: VEO video player with crossfades ───────────────────
 *
 * Per character: `media: { poster, idle, motions: [] }` (null until clips land;
 * gradient placeholder renders meanwhile). Drop zone + encoding rules:
 * public/assets/nerds-only/README.md. Clips should START AND END NEAR a common
 * pose; the 0.25s crossfade absorbs generation drift, so VEO does not need to
 * reproduce an exact frame (decided 2026-06-10).
 *
 * Playback: idle loops; an ambient timer plays one motion through, then
 * crossfades back to idle. Clip entries are a src string or { webm, mp4 }.
 *
 * Loading strategy (do not regress this):
 *   - Only the selected character's media ever loads; switching characters
 *     mounts a fresh player. Char-colored gradient paints under everything,
 *     poster paints over it, video fades in on top.
 *   - The character's extra motions warm the HTTP cache via requestIdleCallback
 *     after mount. Never prefetch other characters.
 *   - useReducedMotion → poster only, no autoplay, no ambient timer.
 */
const CLIP_XFADE_S = 0.25;
const AMBIENT_DELAY_MS = () => 9000 + Math.random() * 4000;

function clipSources(clip) {
  if (!clip) return [];
  if (typeof clip === 'string') return [{ src: clip }];
  return [
    clip.webm && { src: clip.webm, type: 'video/webm' },
    clip.mp4 && { src: clip.mp4, type: 'video/mp4' },
  ].filter(Boolean);
}

const clipKey = (clip) => (typeof clip === 'string' ? clip : clip.webm || clip.mp4);

function CharacterMedia({ media, reduceMotion }) {
  const [clip, setClip] = useState(media.idle);
  const isIdle = clip === media.idle;

  // Ambient motion: while idling, occasionally play one motion clip through
  useEffect(() => {
    if (reduceMotion || !isIdle || !media.motions?.length) return;
    const t = setTimeout(() => {
      setClip(media.motions[Math.floor(Math.random() * media.motions.length)]);
    }, AMBIENT_DELAY_MS());
    return () => clearTimeout(t);
  }, [isIdle, media, reduceMotion]);

  // Warm the HTTP cache for this character's motions once the browser is idle
  useEffect(() => {
    if (reduceMotion || !media.motions?.length) return;
    const warm = () =>
      media.motions.flatMap(clipSources).forEach(({ src }) => fetch(src).catch(() => {}));
    const ric = window.requestIdleCallback;
    const id = ric ? ric(warm) : setTimeout(warm, 2500);
    return () => (ric ? cancelIdleCallback(id) : clearTimeout(id));
  }, [media, reduceMotion]);

  return (
    <>
      {media.poster && (
        <img
          src={media.poster}
          alt=""
          width="1920"
          height="1080"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {!reduceMotion && clip && (
        // No `mode`: outgoing clip keeps playing while the next fades in over it
        <AnimatePresence>
          <motion.video
            key={clipKey(clip)}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CLIP_XFADE_S, ease: 'linear' }}
            autoPlay
            muted
            playsInline
            loop={isIdle}
            preload="auto"
            onEnded={() => setClip(media.idle)}
          >
            {clipSources(clip).map((s) => (
              <source key={s.src} {...s} />
            ))}
          </motion.video>
        </AnimatePresence>
      )}
    </>
  );
}

function CharacterBackground({ char }) {
  const reduceMotion = useReducedMotion();
  return (
    // No `mode`: characters crossfade into each other instead of fading to black
    <AnimatePresence>
      <motion.div
        key={char.id}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        {/* Char-colored gradient always paints first, covers media loading gaps */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 90% at 60% 50%, ${char.color}28 0%, transparent 70%),
                         linear-gradient(160deg, #0a0604 0%, #120c06 50%, #0a0604 100%)`,
          }}
        />
        {(char.media?.idle || char.media?.poster) && <CharacterMedia media={char.media} reduceMotion={reduceMotion} />}
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(4,2,1,0.7) 100%)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Info panel (left side) ───────────────────────────────────────────────────
// Mobile (<md): pinned top, full-width minus gutters; backstory/traits/companion
// hidden so the panel never collides with the portrait strip. md+: original
// left-rail layout with the full dossier.
function InfoPanel({ char }) {
  const reduceMotion = useReducedMotion();
  const role = ROLES[char.role];
  // Positioning lives on this static wrapper: framer-motion owns `transform` on
  // the animated child, so a Tailwind -translate-y-1/2 there would be wiped on
  // every x-slide (the original "stats not visible" clipping bug).
  return (
    // md+: centered in the zone above the portrait strip (~11rem), not the viewport
    <div className="absolute left-4 right-4 top-[4.25rem] md:left-8 md:right-auto md:top-[calc(50%-4.5rem)] md:-translate-y-1/2 md:w-72 z-10">
    <AnimatePresence mode="wait">
      <motion.div
        key={char.id}
        initial={reduceMotion ? false : { x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={reduceMotion ? undefined : { x: -24, opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 md:gap-5 md:max-h-[calc(100vh-19rem)] md:overflow-y-auto scrollbar-none"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {/* Role badge */}
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-6 rounded-full"
            style={{ backgroundColor: role.color }}
            aria-hidden
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: role.labelColor || role.color }}
          >
            {role.label}
          </span>
          {(char.npc || char.retired) && (
            <span className="rounded-full border border-white/25 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {char.npc ? 'NPC' : 'Retired'}
            </span>
          )}
        </div>

        {/* Name */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-none tracking-tight">
            <span className="block text-white">{char.name.split(' ')[0]}</span>
            {char.name.split(' ').length > 1 && (
              <span className="block" style={{ color: char.color }}>
                {char.name.split(' ').slice(1).join(' ')}
                {char.designation && (
                  <span className="ml-2 text-xl font-medium text-white/50">{char.designation}</span>
                )}
              </span>
            )}
          </h1>
          <p className="mt-2 text-sm text-white/65 font-medium">{char.race} · {char.class}</p>
          <p className="text-[11px] text-white/50 tracking-wide">{char.system}</p>
        </div>

        {/* Tagline */}
        <p className="text-sm leading-relaxed italic text-white/70 border-l-2 pl-3" style={{ borderColor: char.color + '60' }}>
          "{char.tagline}"
        </p>

        {/* Stats */}
        {(char.hp || char.ac) && (
          <div className="flex gap-6">
            {char.hp && (
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-white/55 mb-0.5">HP</span>
                <span className="text-2xl font-black text-white">{char.hp}</span>
              </div>
            )}
            {char.ac && (
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-white/55 mb-0.5">AC</span>
                <span className="text-2xl font-black text-white">{char.ac}</span>
              </div>
            )}
            {char.alignment && (
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-white/55 mb-0.5">Alignment</span>
                <span className="text-sm font-semibold text-white/70">{char.alignment}</span>
              </div>
            )}
          </div>
        )}

        {/* Backstory */}
        {char.backstory && (
          <p className="hidden md:block whitespace-pre-line text-xs leading-relaxed text-white/65 max-w-[260px]">{char.backstory}</p>
        )}

        {/* Traits */}
        {char.traits?.length > 0 && (
          <ul className="hidden md:flex flex-col gap-1.5">
            {char.traits.map(t => (
              <li key={t} className="flex items-start gap-2 text-xs text-white/65">
                <span className="mt-0.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: char.color }} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Companion */}
        {char.companion && (
          <div
            className="hidden md:block rounded-lg px-3 py-2 border text-xs text-white/70"
            style={{ borderColor: char.color + '30', backgroundColor: char.color + '0f' }}
          >
            <span className="block text-[9px] uppercase tracking-widest mb-0.5" style={{ color: char.color }}>
              Companion
            </span>
            {char.companion}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
    </div>
  );
}

// ─── Parallelogram portrait ───────────────────────────────────────────────────
const SKEW = -12;

function ParallelogramPortrait({ char, isSelected, onClick }) {
  const role = ROLES[char.role];

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={char.name}
      className="relative group rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ transform: `skewX(${SKEW}deg)`, outlineColor: char.color }}
    >
      {/* Card */}
      <div
        className={[
          'relative h-[88px] w-[62px] rounded-lg overflow-hidden transition-all duration-200',
          isSelected
            ? 'ring-2 scale-110'
            : 'ring-1 ring-white/15 opacity-70 hover:opacity-100 hover:scale-105',
        ].join(' ')}
        style={{
          '--tw-ring-color': isSelected ? char.color : undefined,
          boxShadow: isSelected ? `0 0 18px ${char.color}55` : undefined,
          background: `linear-gradient(160deg, ${char.color}25 0%, rgba(10,6,4,0.8) 100%)`,
        }}
      >
        {/* Role color bar, top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ backgroundColor: role.color }}
        />

        {/* Portrait image or initial */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `skewX(${-SKEW}deg)` }}
        >
          {char.portrait ? (
            <img src={char.portrait} alt="" className="h-full w-full object-cover object-top" />
          ) : (
            <span
              className="text-2xl font-black select-none"
              style={{ color: char.color }}
              aria-hidden
            >
              {char.name[0]}
            </span>
          )}
        </div>

        {/* Name + class bar, bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 px-1.5 py-1 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(4,2,1,0.9) 0%, transparent 100%)',
            transform: `skewX(${-SKEW}deg)`,
          }}
        >
          <p className="text-[9px] font-bold text-white leading-none truncate tracking-wide">
            {char.name.split(' ')[0].toUpperCase()}
          </p>
        </div>

        {/* Selected glow overlay */}
        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${char.color}18, transparent)` }}
          />
        )}
      </div>
    </button>
  );
}

// ─── Role group ───────────────────────────────────────────────────────────────
function RoleGroup({ roleKey, chars, selectedId, onSelect }) {
  const role = ROLES[roleKey];
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-[8px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: role.labelColor || role.color }}
      >
        {role.label}
      </span>
      <div className="flex gap-2.5">
        {chars.map(char => (
          <ParallelogramPortrait
            key={char.id}
            char={char}
            isSelected={selectedId === char.id}
            onClick={() => onSelect(char.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Bottom HUD strip ─────────────────────────────────────────────────────────
function CharacterStrip({ selectedId, onSelect }) {
  const grouped = ROLE_ORDER
    .map(roleKey => ({
      roleKey,
      chars: CHARACTERS.filter(c => c.role === roleKey),
    }))
    .filter(g => g.chars.length > 0);

  return (
    <nav
      aria-label="Character select"
      className="absolute bottom-0 left-0 right-0 z-20"
      style={{
        background: 'linear-gradient(to top, rgba(4,2,1,0.92) 0%, rgba(4,2,1,0.6) 70%, transparent 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-end gap-8 px-8 pb-6 pt-10 overflow-x-auto scrollbar-none md:justify-center max-md:gap-5 max-md:px-4 max-md:pb-4 max-md:pt-6">
        {grouped.map(({ roleKey, chars }, i) => (
          <div key={roleKey} className="flex items-end gap-8 max-md:gap-5 shrink-0">
            {i > 0 && (
              <div className="w-px self-stretch mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} aria-hidden />
            )}
            <RoleGroup
              roleKey={roleKey}
              chars={chars}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// Warm-theme suppression for this hardcoded-dark route lives in ThemeContext
// (FORCED_DARK_ROUTES); title/meta live in RouteMeta.
export default function NerdsOnly() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState(CHARACTERS[0].id);
  const selected = CHARACTERS.find(c => c.id === selectedId);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <main
      className="relative h-screen w-screen overflow-hidden bg-[#0a0604]"
      style={{ fontFamily: 'Satoshi, sans-serif' }}
    >
      {/* Character background */}
      <CharacterBackground char={selected} />

      {/* Back button */}
      <button
        onClick={() => navigate('/portfolio')}
        className="absolute top-4 left-4 md:left-8 z-30 flex min-h-11 items-center gap-2 py-2 pr-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Portfolio
      </button>

      {/* Page label top right */}
      <div className="absolute top-6 right-4 md:right-8 z-30 text-right">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
          Nerd's Only
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={selected.id}
            initial={reduceMotion ? false : { y: 4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -4, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="text-sm font-bold text-white/70 mt-0.5"
          >
            {selected.name}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Character info, left */}
      <InfoPanel char={selected} />

      {/* Portrait strip, bottom */}
      <CharacterStrip selectedId={selectedId} onSelect={handleSelect} />
    </main>
  );
}
