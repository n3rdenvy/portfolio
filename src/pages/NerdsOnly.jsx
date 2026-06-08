import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS, ROLES, ROLE_ORDER } from '../data/nerdsOnlyCharacters';

// ─── Character background: video when available, gradient placeholder ─────────
function CharacterBackground({ char }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={char.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        {char.video ? (
          <video
            src={char.video}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(ellipse 80% 90% at 60% 50%, ${char.color}28 0%, transparent 70%),
                           linear-gradient(160deg, #0a0604 0%, #120c06 50%, #0a0604 100%)`,
            }}
          />
        )}
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
function InfoPanel({ char }) {
  const role = ROLES[char.role];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={char.id}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-72 flex flex-col gap-5 pointer-events-none"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {/* Role badge */}
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-6 rounded-full"
            style={{ backgroundColor: role.color }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: role.color }}
          >
            {role.label}
          </span>
        </div>

        {/* Name */}
        <div>
          <h1 className="text-4xl font-black text-white leading-none tracking-tight">
            {char.name.split(' ')[0]}
          </h1>
          {char.name.split(' ').length > 1 && (
            <h1 className="text-4xl font-black leading-none tracking-tight" style={{ color: char.color }}>
              {char.name.split(' ').slice(1).join(' ')}
              {char.designation && (
                <span className="ml-2 text-xl font-medium text-white/30">{char.designation}</span>
              )}
            </h1>
          )}
          <p className="mt-2 text-sm text-white/45 font-medium">{char.race} · {char.class}</p>
          <p className="text-[11px] text-white/25 tracking-wide">{char.system}</p>
        </div>

        {/* Tagline */}
        <p className="text-sm leading-relaxed italic text-white/60 border-l-2 pl-3" style={{ borderColor: char.color + '60' }}>
          "{char.tagline}"
        </p>

        {/* Stats */}
        {(char.hp || char.ac) && (
          <div className="flex gap-6">
            {char.hp && (
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-white/30 mb-0.5">HP</span>
                <span className="text-2xl font-black text-white">{char.hp}</span>
              </div>
            )}
            {char.ac && (
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-white/30 mb-0.5">AC</span>
                <span className="text-2xl font-black text-white">{char.ac}</span>
              </div>
            )}
            {char.alignment && (
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Alignment</span>
                <span className="text-sm font-semibold text-white/65">{char.alignment}</span>
              </div>
            )}
          </div>
        )}

        {/* Backstory */}
        {char.backstory && (
          <p className="text-xs leading-relaxed text-white/50 max-w-[260px]">{char.backstory}</p>
        )}

        {/* Traits */}
        {char.traits?.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {char.traits.map(t => (
              <li key={t} className="flex items-start gap-2 text-xs text-white/50">
                <span className="mt-0.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: char.color }} />
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Companion */}
        {char.companion && (
          <div
            className="rounded-lg px-3 py-2 border text-xs text-white/55"
            style={{ borderColor: char.color + '30', backgroundColor: char.color + '0f' }}
          >
            <span className="block text-[9px] uppercase tracking-widest mb-0.5" style={{ color: char.color + 'aa' }}>
              Companion
            </span>
            {char.companion}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Parallelogram portrait ───────────────────────────────────────────────────
const SKEW = -12;

function ParallelogramPortrait({ char, isSelected, onClick }) {
  const role = ROLES[char.role];
  const available = true; // all shown, coming-soon chars just show placeholder

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={char.name}
      className="relative focus-visible:outline-none group"
      style={{ transform: `skewX(${SKEW}deg)` }}
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
          ringColor: isSelected ? char.color : undefined,
          boxShadow: isSelected ? `0 0 18px ${char.color}55` : undefined,
          background: `linear-gradient(160deg, ${char.color}25 0%, rgba(10,6,4,0.8) 100%)`,
        }}
      >
        {/* Role color bar — top */}
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
            <img src={char.portrait} alt={char.name} className="h-full w-full object-cover object-top" />
          ) : (
            <span
              className="text-2xl font-black select-none"
              style={{ color: char.color + 'cc' }}
            >
              {char.name[0]}
            </span>
          )}
        </div>

        {/* Name + class bar — bottom */}
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
        style={{ color: role.color + 'aa' }}
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
    <div
      className="absolute bottom-0 left-0 right-0 z-20"
      style={{
        background: 'linear-gradient(to top, rgba(4,2,1,0.92) 0%, rgba(4,2,1,0.6) 70%, transparent 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-end justify-center gap-8 px-8 pb-6 pt-10">
        {grouped.map(({ roleKey, chars }, i) => (
          <div key={roleKey} className="flex items-end gap-8">
            {i > 0 && (
              <div className="w-px self-stretch mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />
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
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NerdsOnly() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(CHARACTERS[0].id);
  const selected = CHARACTERS.find(c => c.id === selectedId);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#0a0604]"
      style={{ fontFamily: 'Satoshi, sans-serif' }}
    >
      {/* Character background */}
      <CharacterBackground char={selected} />

      {/* Back button */}
      <button
        onClick={() => navigate('/portfolio')}
        className="absolute top-6 left-8 z-30 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 hover:text-white/80 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Portfolio
      </button>

      {/* Page label top right */}
      <div className="absolute top-6 right-8 z-30 text-right">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25">
          Nerd's Only
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={selected.id}
            initial={{ y: 4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -4, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-bold text-white/60 mt-0.5"
          >
            {selected.name}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Character info — left */}
      <InfoPanel char={selected} />

      {/* Portrait strip — bottom */}
      <CharacterStrip selectedId={selectedId} onSelect={handleSelect} />
    </div>
  );
}
