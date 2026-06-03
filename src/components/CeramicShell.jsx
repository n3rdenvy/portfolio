import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const DRIFT_VIEWPORT_MQ = '(max-width: 1023px)';

export default function CeramicShell() {
  const groupRef = useRef();
  const { viewport } = useThree();
  const mouseNdcRef = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3());
  const driftTimeRef = useRef(0);

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
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (useDriftMotion) {
      driftTimeRef.current += delta;
      const t = driftTimeRef.current;
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
      const { x, y } = mouseNdcRef.current;
      targetPosition.current.set(
        (x * viewport.width) / 2,
        (y * viewport.height) / 2,
        -2
      );
    }

    groupRef.current.position.lerp(targetPosition.current, Math.min(1, delta * 1.55));
    // Slow rotation — ceramic piece on display, no tilt response to cursor
    groupRef.current.rotation.x += delta * 0.055;
    groupRef.current.rotation.y += delta * 0.085;
  });

  return (
    <>
      {/* Warm clay ambient */}
      <ambientLight intensity={0.15} color="#f8d4a8" />
      {/* Key: warm off-white from upper right — main surface illumination */}
      <directionalLight position={[8, 7, 4]} intensity={2.2} color="#f5e0c0" />
      {/* Fill: warm sienna from lower left — wraps the form */}
      <directionalLight position={[-9, -4, 5]} intensity={1.0} color="#d4854a" />
      {/* Rim: deep terracotta from behind — separates form from background */}
      <directionalLight position={[1, -7, -4]} intensity={0.45} color="#8b3a18" />

      {/* Group keeps the inner point light co-located with the sphere at all times */}
      <group ref={groupRef}>
        {/* Stronger amber inner glow so the shell bleeds through the frosted warm glass */}
        <pointLight color="#f09030" intensity={14} distance={8} decay={1.8} />
        <Sphere args={[1.83, 144, 144]}>
          <MeshDistortMaterial
            color="#8B3A18"
            emissive="#e06820"
            emissiveIntensity={0.55}
            roughness={0.62}
            metalness={0.05}
            envMapIntensity={0.32}
            ior={1.45}
            specularIntensity={1.4}
            specularColor="#ffb870"
            clearcoat={0.12}
            clearcoatRoughness={0.80}
            sheen={0.92}
            sheenColor="#d08040"
            sheenRoughness={0.52}
            distort={0.88}
            speed={0.65}
            side={THREE.DoubleSide}
          />
        </Sphere>
      </group>
    </>
  );
}
