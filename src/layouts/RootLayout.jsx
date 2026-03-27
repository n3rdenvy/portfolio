import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import CustomCursor from '../components/CustomCursor';
import FluidBlob from '../components/FluidBlob';
import SpatialAnimatedOutlet from '../components/SpatialAnimatedOutlet';

export default function RootLayout() {
  const [finePointer, setFinePointer] = useState(false);

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

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-[#0D0D0D] font-satoshi text-white ${finePointer ? 'cursor-none' : ''}`}
    >
      <div className="absolute inset-0 bg-[#0D0D0D]">
        <Canvas className="h-full w-full" gl={{ alpha: true, antialias: true }}>
          <color attach="background" args={['#0D0D0D']} />
          <ambientLight intensity={0.1} />
          <directionalLight position={[9, 5, 4]} intensity={2.4} color="#f4f6fa" />
          <directionalLight position={[-11, -3, 6]} intensity={1.15} color="#cfd6e6" />
          <directionalLight position={[2, -8, -5]} intensity={0.55} color="#9aa3b5" />
          <FluidBlob />
        </Canvas>
      </div>
      <div className="absolute isolate z-10 overflow-hidden rounded-[2.5rem] border border-white/[0.14] bg-gradient-to-b from-black/35 via-black/25 to-black/30 text-white shadow-[0_28px_90px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.16),inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-[80px] backdrop-saturate-150 left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] bottom-[max(1rem,env(safe-area-inset-bottom,0px))] h-auto w-auto max-w-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[85vh] md:w-[90vw] md:max-w-7xl md:-translate-x-1/2 md:-translate-y-1/2">
        {/* Diagonal specular shine (physical glass panel read) */}
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
