import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';

const DRIFT_VIEWPORT_MQ = '(max-width: 1023px)';

/**
 * Seifert-surface-style nested bowl geometry.
 *
 * Parametric surface: a large outer bowl that curves inward at the top and
 * connects to a smaller nested inner bowl — single continuous surface.
 * This matches the reference ceramic sculpture: outer terracotta shell wrapping
 * around an inner cavity that glows warm amber.
 *
 * u ∈ [0, 2π]  — sweeps around the axis of revolution
 * v ∈ [0, 1]   — traces from outer-bowl rim down and back up into inner bowl
 */
function buildNestedBowlGeometry() {
  const uSegs = 220;
  const vSegs = 120;

  const positions = [];
  const normals   = [];
  const uvs       = [];
  const indices   = [];

  // Profile function: given v ∈ [0,1], return [r, y] in the bowl's cross-section.
  // v=0  : outer rim (large radius, high up)
  // v=0.5: the saddle — where outer bowl meets inner bowl at the fold
  // v=1  : inner bowl tip (small radius, centred)
  function profile(v) {
    // Outer bowl: wide, curving lip
    // Inner bowl: smaller, nested, tilted inward
    // The transition at v≈0.48 is the fold between the two shells.

    const t = v;

    // Outer shell radius decreases then the fold inverts into inner shell
    // This creates the characteristic "cup inside a cup" shape.
    let r, y, tilt;

    if (t < 0.5) {
      // Outer bowl — sweeps from wide open lip down to the fold
      const s = t / 0.5; // 0→1 over outer half
      r    = 1.55 - 0.55 * s;                  // outer rim → fold neck
      y    = 0.90 - 1.20 * s * s;              // lip level → fold bottom
      tilt = s * 0.35;                          // slight inward lean
    } else {
      // Inner bowl — sweeps from the fold back up and inward
      const s = (t - 0.5) / 0.5; // 0→1 over inner half
      r    = 1.00 - 0.70 * s;                  // fold neck → inner tip
      y    = -0.30 + 0.80 * s;                 // fold bottom → inner centrepoint
      tilt = 0.35 + 0.30 * s;                  // lean increases into interior
    }

    return { r, y, tilt };
  }

  // Build vertex grid
  for (let vi = 0; vi <= vSegs; vi++) {
    const v   = vi / vSegs;
    const { r, y, tilt } = profile(v);

    for (let ui = 0; ui <= uSegs; ui++) {
      const u   = (ui / uSegs) * Math.PI * 2;

      // Apply a gentle sinusoidal undulation around the rim to
      // give it the organic, hand-thrown ceramic feel — not perfectly round.
      const undulate = 1.0 + 0.04 * Math.sin(3 * u) + 0.025 * Math.sin(5 * u + 0.8);
      const rFinal   = r * undulate;

      // Small opening asymmetry — slightly opens to one side, matching the photo
      const openOffset = 0.18 * (1 - v) * Math.cos(u + 0.4);

      const x = rFinal * Math.cos(u) + openOffset * 0.3;
      const z = rFinal * Math.sin(u) * (1.0 - tilt * 0.15) + openOffset * 0.15;
      const yFinal = y + tilt * 0.12 * Math.cos(u);

      positions.push(x, yFinal, z);
      uvs.push(ui / uSegs, vi / vSegs);
      normals.push(0, 1, 0); // placeholder — computed below
    }
  }

  // Build index buffer (quad strips)
  const row = uSegs + 1;
  for (let vi = 0; vi < vSegs; vi++) {
    for (let ui = 0; ui < uSegs; ui++) {
      const a = vi * row + ui;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals(); // accurate normals from actual geometry

  return geo;
}

export default function CeramicShell() {
  const groupRef  = useRef();
  const meshRef   = useRef();
  const { viewport } = useThree();
  const mouseNdcRef    = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3());
  const driftTimeRef   = useRef(0);

  const [useDriftMotion, setUseDriftMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DRIFT_VIEWPORT_MQ).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DRIFT_VIEWPORT_MQ);
    const sync = () => setUseDriftMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseNdcRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const geometry = useMemo(() => buildNestedBowlGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (useDriftMotion) {
      driftTimeRef.current += delta;
      const t = driftTimeRef.current;
      const ndcX = 0.74 * Math.sin(t * 0.26) + 0.22 * Math.sin(t * 0.14 + 0.85) + 0.08 * Math.sin(t * 0.41);
      const ndcY = 0.66 * Math.cos(t * 0.22) + 0.2  * Math.sin(t * 0.18 + 1.05) + 0.07 * Math.cos(t * 0.35);
      targetPosition.current.set((ndcX * viewport.width) / 2, (ndcY * viewport.height) / 2, -2);
    } else {
      const { x, y } = mouseNdcRef.current;
      targetPosition.current.set((x * viewport.width) / 2, (y * viewport.height) / 2, -2);
    }

    groupRef.current.position.lerp(targetPosition.current, Math.min(1, delta * 1.55));

    // Slow, weighty rotation — like a ceramic piece on a lazy Susan
    groupRef.current.rotation.y += delta * 0.022;
    groupRef.current.rotation.x += delta * 0.008;
  });

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.12} color="#f8d4a8" />
      {/* Main key: warm off-white upper right — illuminates the exterior terracotta */}
      <directionalLight position={[8, 7, 4]}   intensity={2.0} color="#f5e0c0" />
      {/* Fill: warm sienna lower left */}
      <directionalLight position={[-9, -4, 5]} intensity={0.9} color="#d4854a" />
      {/* Rim: deep terracotta from behind */}
      <directionalLight position={[1, -7, -4]} intensity={0.4} color="#8b3a18" />

      <group ref={groupRef}>
        {/* Interior cavity glow — sits inside the nested bowl, radiates amber warmth outward */}
        <pointLight position={[0.15, -0.1, 0.1]} color="#ff8020" intensity={20} distance={4.5} decay={1.6} />
        <pointLight position={[-0.1, 0.2, -0.1]} color="#ffa040" intensity={10} distance={7}   decay={1.4} />

        {/* The nested bowl shell */}
        <mesh
          ref={meshRef}
          geometry={geometry}
          rotation={[Math.PI * 0.12, Math.PI * 0.25, Math.PI * 0.08]}
        >
          <meshPhysicalMaterial
            color="#8B3A18"
            emissive="#c04010"
            emissiveIntensity={0.35}
            transparent={true}
            opacity={0.88}
            roughness={0.78}
            metalness={0.02}
            side={THREE.DoubleSide}
            envMapIntensity={0.25}
          />
        </mesh>
      </group>
    </>
  );
}
