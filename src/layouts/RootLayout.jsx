import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import CustomCursor from '../components/CustomCursor';
import CeramicShell from '../components/CeramicShell';
import SpatialAnimatedOutlet from '../components/SpatialAnimatedOutlet';

export default function RootLayout() {
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
    const root = document.documentElement;
    if (finePointer) {
      root.dataset.customCursor = 'on';
      return () => {
        delete root.dataset.customCursor;
      };
    }
    delete root.dataset.customCursor;
    return undefined;
  }, [finePointer]);

  // Glass refraction shift — cursor moves the warm specular highlight across the panel surface
  const handleGlassMouseMove = (e) => {
    const el = glassRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
  };

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-[#120B06] font-satoshi text-white ${finePointer ? 'cursor-none' : ''}`}
    >
      <div className="absolute inset-0 bg-[#120B06]">
        <Canvas className="h-full w-full" gl={{ alpha: true, antialias: true }}>
          <color attach="background" args={['#120B06']} />
          <CeramicShell />
        </Canvas>
      </div>
      <div
        ref={glassRef}
        onMouseMove={handleGlassMouseMove}
        style={{ '--gx': '20%', '--gy': '0%' }}
        className="absolute isolate z-10 overflow-hidden rounded-[2.5rem] border border-white/[0.12] bg-gradient-to-b from-black/35 via-black/25 to-black/30 text-white shadow-[0_28px_90px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,218,180,0.14),inset_0_0_0_1px_rgba(255,200,160,0.04)] backdrop-blur-[64.8px] left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] bottom-[max(1rem,env(safe-area-inset-bottom,0px))] h-auto w-auto max-w-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[85vh] md:w-[90vw] md:max-w-7xl md:-translate-x-1/2 md:-translate-y-1/2"
      >
        {/* Diagonal warm specular — fixed diagonal sweep */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] mix-blend-overlay"
          style={{ background: 'linear-gradient(125deg, rgba(255,210,170,0.18) 0%, rgba(255,190,140,0.06) 14%, rgba(255,170,110,0.02) 26%, transparent 46%)' }}
          aria-hidden
        />
        {/* Cursor-following warm specular — tracks mouse position via CSS custom props */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] mix-blend-soft-light"
          style={{ background: 'radial-gradient(120% 85% at var(--gx, 20%) var(--gy, 0%), rgba(255,200,150,0.14) 0%, rgba(255,180,120,0.04) 22%, transparent 55%)' }}
          aria-hidden
        />
        {/* Counter-corner warm rim */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-90 mix-blend-overlay"
          style={{ background: 'linear-gradient(305deg, transparent 62%, rgba(255,190,140,0.03) 82%, rgba(255,200,160,0.07) 100%)' }}
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
      {finePointer ? <CustomCursor /> : null}
    </div>
  );
}
