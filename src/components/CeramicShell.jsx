import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const DRIFT_VIEWPORT_MQ = '(max-width: 1023px)';

export default function CeramicShell() {
  const meshRef = useRef();
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

  useFrame((_, delta) => {
    if (!meshRef.current) return;

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

    meshRef.current.position.lerp(targetPosition.current, Math.min(1, delta * 1.55));
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.11;
  });

  return (
    <>
      <ambientLight intensity={0.18} color="#f8d4a8" />
      <directionalLight position={[8, 7, 4]}   intensity={2.4} color="#f5e0c0" />
      <directionalLight position={[-9, -4, 5]} intensity={1.1} color="#d4854a" />
      <directionalLight position={[1, -7, -4]} intensity={0.5} color="#8b3a18" />

      <Sphere ref={meshRef} args={[1.83, 144, 144]}>
        <MeshDistortMaterial
          color="#8B3A18"
          emissive="#d05010"
          emissiveIntensity={0.55}
          roughness={0.68}
          metalness={0.04}
          envMapIntensity={0.30}
          specularIntensity={1.2}
          specularColor="#ffb870"
          clearcoat={0.10}
          clearcoatRoughness={0.85}
          sheen={0.90}
          sheenColor="#c87040"
          sheenRoughness={0.55}
          distort={0.92}
          speed={0.72}
        />
      </Sphere>
    </>
  );
}
