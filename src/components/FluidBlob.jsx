import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/** Below Tailwind `lg` (1024px): no cursor-led motion on phones/tablets — use slow drift instead. */
const DRIFT_VIEWPORT_MQ = '(max-width: 1023px)';

function useMicroRoughnessMap() {
  const map = useMemo(() => {
    const w = 256;
    const h = 256;
    const n = w * h;
    const data = new Uint8Array(n * 4);
    let seed = 0x1a1c23;
    for (let i = 0; i < n; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const v = 85 + (seed % 115);
      const o = i * 4;
      data[o] = v;
      data[o + 1] = v;
      data[o + 2] = v;
      data[o + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => map.dispose(), [map]);
  return map;
}

export default function FluidBlob() {
  const groupRef = useRef();
  const meshRef = useRef();
  const { viewport } = useThree();
  const mouseNdcRef = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3());
  const driftTimeRef = useRef(0);
  const roughnessMap = useMicroRoughnessMap();

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
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouseNdcRef.current = { x, y };
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (useDriftMotion) {
      driftTimeRef.current += delta;
      const t = driftTimeRef.current;
      // Slow Lissajous-style path — screensaver-like, stays mostly on-screen in NDC space.
      const ndcX =
        0.74 * Math.sin(t * 0.26) + 0.22 * Math.sin(t * 0.14 + 0.85) + 0.08 * Math.sin(t * 0.41);
      const ndcY =
        0.66 * Math.cos(t * 0.22) + 0.2 * Math.sin(t * 0.18 + 1.05) + 0.07 * Math.cos(t * 0.35);
      targetPosition.current.set(
        (ndcX * viewport.width) / 2,
        (ndcY * viewport.height) / 2,
        -2
      );
    } else {
      const { x: ndcX, y: ndcY } = mouseNdcRef.current;
      targetPosition.current.set(
        (ndcX * viewport.width) / 2,
        (ndcY * viewport.height) / 2,
        -2
      );
    }

    groupRef.current.position.lerp(targetPosition.current, Math.min(1, delta * 1.55));

    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.11;
  });

  return (
    <>
      <Environment preset="studio" environmentIntensity={0.28} />
      <group ref={groupRef}>
        <Sphere ref={meshRef} args={[1.83, 144, 144]}>
          <MeshDistortMaterial
            color="#1A1C23"
            roughnessMap={roughnessMap}
            roughness={0.34}
            metalness={0.91}
            envMapIntensity={1.05}
            ior={1.65}
            specularIntensity={1.35}
            specularColor="#e8ecf5"
            clearcoat={0.48}
            clearcoatRoughness={0.58}
            sheen={0.75}
            sheenColor="#b9c4d6"
            sheenRoughness={0.42}
            distort={0.92}
            speed={0.72}
          />
        </Sphere>
      </group>
    </>
  );
}
