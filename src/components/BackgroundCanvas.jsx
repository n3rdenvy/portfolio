import { Canvas } from '@react-three/fiber';
import CeramicShell from './CeramicShell';
import FluidBlob from './FluidBlob';

/**
 * WebGL background, split out of RootLayout so three.js + fiber load as an
 * async chunk. The glass UI renders immediately on the theme's flat bg color;
 * the canvas fades in when the chunk lands.
 */
export default function BackgroundCanvas({ isV2 }) {
  return (
    <Canvas className="h-full w-full" gl={{ alpha: true, antialias: true }}>
      {isV2 ? <CeramicShell key="ceramic" /> : <FluidBlob key="blob" />}
    </Canvas>
  );
}
