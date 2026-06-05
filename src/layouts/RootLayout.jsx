import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import CustomCursor from '../components/CustomCursor';
import CeramicShell from '../components/CeramicShell';
import FluidBlob from '../components/FluidBlob';
import SpatialAnimatedOutlet from '../components/SpatialAnimatedOutlet';
import ThemeToggle from '../components/ThemeToggle';
import DyslexiaToggle from '../components/DyslexiaToggle';
import { useTheme } from '../context/ThemeContext';

const V1 = {
  bg: '#0D0D0D',
  border: 'border-white/[0.14]',
  shadow: '0 28px 90px -24px rgba(0,0,0,0.75), inset 0 1px 0 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.04)',
  glass: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.25), rgba(0,0,0,0.30))',
  spec1: 'linear-gradient(125deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 14%, rgba(255,255,255,0.02) 26%, transparent 46%)',
  spec2: 'rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 22%, transparent 55%',
  spec3: 'linear-gradient(305deg, transparent 62%, rgba(255,255,255,0.03) 82%, rgba(255,255,255,0.08) 100%)',
};

const V2 = {
  bg: '#EDE0D0',
  border: 'border-[rgba(180,130,70,0.20)]',
  shadow: '0 28px 90px -24px rgba(100,60,20,0.22), inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(200,150,80,0.08)',
  glass: 'linear-gradient(to bottom, rgba(255,250,243,0.42), rgba(255,247,237,0.34), rgba(255,248,239,0.38))',
  spec1: 'linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(255,248,235,0.30) 14%, rgba(255,240,220,0.10) 26%, transparent 46%)',
  spec2: 'rgba(255,255,255,0.45) 0%, rgba(255,248,235,0.12) 22%, transparent 55%',
  spec3: 'linear-gradient(305deg, transparent 62%, rgba(255,240,210,0.08) 82%, rgba(255,255,255,0.18) 100%)',
};

export default function RootLayout() {
  const { theme, dyslexia, setDyslexia } = useTheme();
  const isV2 = theme === 'v2';
  const T = isV2 ? V2 : V1;

  const [finePointer, setFinePointer] = useState(false);
  const glassRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      if (!glassRef.current) return;
      if (e.composedPath().includes(glassRef.current)) return;
      const scrollEl = document.getElementById('page-scroll-root');
      if (scrollEl) scrollEl.scrollTop += e.deltaY;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (finePointer) {
      root.dataset.customCursor = 'on';
      return () => { delete root.dataset.customCursor; };
    }
    delete root.dataset.customCursor;
    return undefined;
  }, [finePointer]);

  const handleGlassMouseMove = (e) => {
    const el = glassRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
  };

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden font-satoshi ${finePointer ? 'cursor-none' : ''}`}
      style={{ backgroundColor: T.bg }}
    >
      {/* Background canvas */}
      <div className="absolute inset-0" style={{ backgroundColor: T.bg }}>
        <Canvas className="h-full w-full" gl={{ alpha: true, antialias: true }}>
          <color attach="background" args={[T.bg]} />
          {isV2 ? <CeramicShell key="ceramic" /> : <FluidBlob key="blob" />}
        </Canvas>
      </div>

      {/* Glass panel */}
      <div
        ref={glassRef}
        onMouseMove={handleGlassMouseMove}
        style={{
          '--gx': '20%',
          '--gy': '0%',
          background: T.glass,
          boxShadow: T.shadow,
        }}
        className={[
          'absolute isolate z-10 overflow-hidden rounded-[2.5rem]',
          'border backdrop-blur-[52px]',
          'left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]',
          'top-[max(1rem,env(safe-area-inset-top,0px))] bottom-[max(1rem,env(safe-area-inset-bottom,0px))]',
          'h-auto w-auto max-w-none',
          'md:inset-auto md:left-1/2 md:top-1/2 md:h-[85vh] md:w-[90vw] md:max-w-7xl md:-translate-x-1/2 md:-translate-y-1/2',
          T.border,
        ].join(' ')}
      >
        {/* Diagonal specular */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] mix-blend-overlay"
          style={{ background: T.spec1 }}
          aria-hidden
        />
        {/* Cursor-following specular */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] mix-blend-soft-light"
          style={{ background: `radial-gradient(120% 85% at var(--gx, 20%) var(--gy, 0%), ${T.spec2})` }}
          aria-hidden
        />
        {/* Counter-corner rim */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-90 mix-blend-overlay"
          style={{ background: T.spec3 }}
          aria-hidden
        />

        <div className="relative z-[2] isolate h-full min-h-0">
          <SpatialAnimatedOutlet />
          <div
            id="erik-portfolio-fixed-nav-portal"
            className="pointer-events-none absolute inset-0 z-[70]"
          />
        </div>
      </div>

      <DyslexiaToggle dyslexia={dyslexia} setDyslexia={setDyslexia} />
      <ThemeToggle />
      {finePointer ? <CustomCursor /> : null}
    </div>
  );
}
