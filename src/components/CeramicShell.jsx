import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DRIFT_VIEWPORT_MQ = '(max-width: 1023px)';

const REACTIONS = [
  'squish', 'jiggle', 'heartbeat', 'spinBurst',
  'blush', 'leanToward', 'distortSpike', 'shimmy',
];

const BASE = {
  rotX: 0.06, rotY: 0.09,
  distort:  { outer: 0.50, mid: 0.54, core: 0.26 },
  emissive: { outer: 0.40, mid: 0.55, core: 1.40 },
  corePos:  new THREE.Vector3(0.10, -0.24, 0.12),
  midPos:   new THREE.Vector3(0.05, -0.07, 0.04),
};

const DURATION = {
  squish: 0.85, jiggle: 1.20, heartbeat: 0.70, spinBurst: 0.90,
  blush: 0.55, leanToward: 0.90, distortSpike: 0.90, shimmy: 0.75,
};

export default function CeramicShell() {
  // outerMeshRef / midMeshRef point to Groups (outer + inner wall surface each)
  // coreMeshRef points directly to the core Mesh
  const groupRef       = useRef();
  const outerGroupRef  = useRef();
  const midGroupRef    = useRef();
  const coreMeshRef    = useRef();
  const centerLightRef = useRef();

  const { viewport } = useThree();
  const mouseNdcRef    = useRef({ x: 0, y: 0 });
  const clickNdcRef    = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3());
  const leanOffset     = useRef(new THREE.Vector3());
  const corePosTarget  = useRef(BASE.corePos.clone());
  const midPosTarget   = useRef(BASE.midPos.clone());
  const driftTimeRef   = useRef(0);
  const reactionRef    = useRef(null);
  const rotSpeedRef    = useRef({ x: BASE.rotX, y: BASE.rotY });

  const [useDrift, setUseDrift] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DRIFT_VIEWPORT_MQ).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DRIFT_VIEWPORT_MQ);
    const sync = () => setUseDrift(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouseNdcRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      clickNdcRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
      const type = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      reactionRef.current = { type, startTime: null };
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const { x: ndcX, y: ndcY } = useDrift ? { x: 0, y: 0 } : mouseNdcRef.current;

    // --- Group position (outer shell carries the lag) ---
    if (useDrift) {
      driftTimeRef.current += delta;
      const d = driftTimeRef.current;
      const nx = 0.74 * Math.sin(d * 0.26) + 0.22 * Math.sin(d * 0.14 + 0.85) + 0.08 * Math.sin(d * 0.41);
      const ny = 0.66 * Math.cos(d * 0.22) + 0.20 * Math.sin(d * 0.18 + 1.05) + 0.07 * Math.cos(d * 0.35);
      targetPosition.current.set((nx * viewport.width) / 2, (ny * viewport.height) / 2, -2);
    } else {
      targetPosition.current.set((ndcX * viewport.width) / 2, (ndcY * viewport.height) / 2, -2);
    }
    groupRef.current.position.lerp(targetPosition.current, Math.min(1, delta * 1.55));
    groupRef.current.position.add(leanOffset.current);

    // --- Inner layers lead toward cursor (parallax depth) ---
    corePosTarget.current.set(
      BASE.corePos.x + ndcX * 0.24,
      BASE.corePos.y + ndcY * 0.20,
      BASE.corePos.z,
    );
    midPosTarget.current.set(
      BASE.midPos.x + ndcX * 0.11,
      BASE.midPos.y + ndcY * 0.09,
      BASE.midPos.z,
    );
    if (coreMeshRef.current) coreMeshRef.current.position.lerp(corePosTarget.current, Math.min(1, delta * 4.0));
    if (midGroupRef.current)  midGroupRef.current.position.lerp(midPosTarget.current,  Math.min(1, delta * 2.4));

    // --- Center light breathes — tight decay keeps crevices dark ---
    const breathe = Math.sin(t * 0.55) * 0.5 + 0.5;
    if (centerLightRef.current) centerLightRef.current.intensity = 3.5 + breathe * 5.5;

    // --- Group rotation: Lissajous-modulated ---
    const sm1 = 1 + 0.25 * Math.sin(t * 0.13);
    const sm2 = 1 + 0.20 * Math.sin(t * 0.17 + 0.9);
    groupRef.current.rotation.x += delta * rotSpeedRef.current.x * sm1;
    groupRef.current.rotation.y += delta * rotSpeedRef.current.y * sm2;

    // --- Per-layer counter-rotation (shifts apertures open and closed) ---
    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y += delta * 0.07;
      outerGroupRef.current.rotation.z += delta * 0.025;
    }
    if (midGroupRef.current) {
      midGroupRef.current.rotation.y -= delta * 0.11;
      midGroupRef.current.rotation.x += delta * 0.045;
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += delta * 0.16;
      coreMeshRef.current.rotation.x -= delta * 0.08;
    }

    // --- Per-layer organic shape breathing ---
    if (outerGroupRef.current) {
      const ob = 1 + Math.sin(t * 0.31 + 0.0) * 0.035;
      outerGroupRef.current.scale.set(ob, 1 + Math.cos(t * 0.27 + 1.1) * 0.025, ob);
    }
    if (midGroupRef.current) {
      const mb = 1 + Math.sin(t * 0.38 + 2.1) * 0.045;
      midGroupRef.current.scale.set(mb, 1 + Math.cos(t * 0.34 + 0.7) * 0.030, mb);
    }
    if (coreMeshRef.current) {
      const cb = 1 + Math.sin(t * 0.46 + 1.3) * 0.055;
      coreMeshRef.current.scale.set(1.0 * cb, 1.22 * cb, 0.94 * cb);
    }

    // --- Reaction ---
    if (reactionRef.current) {
      if (reactionRef.current.startTime === null) {
        reactionRef.current.startTime = t;
        groupRef.current.scale.setScalar(1);
        leanOffset.current.set(0, 0, 0);
        rotSpeedRef.current = { x: BASE.rotX, y: BASE.rotY };
      }

      const elapsed = t - reactionRef.current.startTime;
      const dur = DURATION[reactionRef.current.type];
      const tp  = Math.min(1, elapsed / dur);
      // Material access via group children
      const om = outerGroupRef.current?.children?.[0]?.material;
      const mm = midGroupRef.current?.children?.[0]?.material;
      const cm = coreMeshRef.current?.material;

      switch (reactionRef.current.type) {
        case 'squish': {
          const sy  = 1 - 0.28 * Math.exp(-4 * tp) * Math.cos(Math.PI * 2.6 * tp);
          const sxz = 1 / Math.sqrt(Math.max(0.4, sy));
          groupRef.current.scale.set(sxz, sy, sxz);
          break;
        }
        case 'jiggle': {
          const damp = Math.max(0, 1 - tp);
          groupRef.current.rotation.z += Math.sin(t * 40) * 0.006 * damp;
          groupRef.current.rotation.x += Math.sin(t * 33 + 1.1) * 0.004 * damp;
          break;
        }
        case 'heartbeat': {
          const beat = tp < 0.35 ? tp / 0.35 : tp < 0.55 ? 1 - (tp - 0.35) / 0.2 : 0;
          groupRef.current.scale.setScalar(1 + beat * 0.18);
          break;
        }
        case 'spinBurst': {
          const mul = 1 + 5 * Math.pow(1 - tp, 1.8);
          rotSpeedRef.current.x = BASE.rotX * mul;
          rotSpeedRef.current.y = BASE.rotY * mul;
          break;
        }
        case 'blush': {
          const spike = Math.sin(tp * Math.PI) * 1.6;
          if (om) om.emissiveIntensity = BASE.emissive.outer + spike;
          if (mm) mm.emissiveIntensity = BASE.emissive.mid   + spike * 0.9;
          if (centerLightRef.current) centerLightRef.current.intensity = (3.5 + breathe * 5.5) + spike * 4;
          break;
        }
        case 'leanToward': {
          const lean = Math.sin(tp * Math.PI) * 0.22;
          const { x: cx, y: cy } = clickNdcRef.current;
          leanOffset.current.set(
            cx * viewport.width  * 0.25 * lean,
            cy * viewport.height * 0.25 * lean,
            0,
          );
          break;
        }
        case 'distortSpike': {
          const spike = Math.sin(tp * Math.PI) * 0.58;
          if (om) om.distort = BASE.distort.outer + spike;
          if (mm) mm.distort = BASE.distort.mid   + spike * 0.85;
          if (cm) cm.distort = BASE.distort.core  + spike * 0.50;
          break;
        }
        case 'shimmy': {
          const damp = Math.max(0, 1 - tp);
          groupRef.current.rotation.y += Math.sin(t * 28) * 0.005 * damp;
          groupRef.current.rotation.z += Math.sin(t * 22 + 0.8) * 0.003 * damp;
          break;
        }
        default: break;
      }

      if (elapsed >= dur) {
        groupRef.current.scale.setScalar(1);
        leanOffset.current.set(0, 0, 0);
        rotSpeedRef.current = { x: BASE.rotX, y: BASE.rotY };
        if (om) { om.emissiveIntensity = BASE.emissive.outer; om.distort = BASE.distort.outer; }
        if (mm) { mm.emissiveIntensity = BASE.emissive.mid;   mm.distort = BASE.distort.mid;   }
        if (cm) { cm.distort = BASE.distort.core; }
        reactionRef.current = null;
      }
    }
  });

  return (
    <>
      {/* Low ambient — lets crevice shadows stay dark */}
      <ambientLight intensity={0.07} color="#f8d4a8" />
      <directionalLight position={[ 8,  7,  4]} intensity={1.2} color="#f5e0c0" />
      <directionalLight position={[-9, -4,  5]} intensity={0.5} color="#d4854a" />

      <group ref={groupRef}>
        {/*
          Center light — warm, tight decay so it lights nearby surfaces
          but doesn't flood into the deep crevice shadows.
        */}
        <pointLight
          ref={centerLightRef}
          position={[0.08, -0.18, 0.10]}
          color="#ffb060"
          distance={4.5}
          decay={2.8}
        />

        {/*
          OUTER SHELL — narrower phi (1.15π ≈ 207°) so inner layers are
          consistently visible through the gap. Two surfaces create wall mass:
          front face (FrontSide, radius 2.0) + inner wall (BackSide, radius 1.83,
          dark shadowed color).
        */}
        <group ref={outerGroupRef} rotation={[0.20, 0.40, -0.12]}>
          {/* Outer face */}
          <mesh>
            <sphereGeometry args={[2.0, 128, 128, 0, Math.PI * 1.15, 0.10, Math.PI * 0.82]} />
            <MeshDistortMaterial
              color="#7A2E0E"
              emissive="#C04010"
              emissiveIntensity={BASE.emissive.outer}
              roughness={0.50}
              metalness={0.03}
              distort={BASE.distort.outer}
              speed={0.46}
              side={THREE.FrontSide}
            />
          </mesh>
          {/* Inner wall face — dark, low distort, creates shadow depth */}
          <mesh>
            <sphereGeometry args={[1.83, 96, 96, 0, Math.PI * 1.15, 0.10, Math.PI * 0.82]} />
            <MeshDistortMaterial
              color="#2A0E04"
              emissive="#3A1008"
              emissiveIntensity={0.08}
              roughness={0.80}
              metalness={0.0}
              distort={0.18}
              speed={0.40}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/*
          MID SHELL — narrower phi (1.05π ≈ 189°), same double-wall approach.
          Counter-rotates against outer so apertures phase in and out of alignment.
        */}
        <group ref={midGroupRef} rotation={[-0.32, -0.72, 0.26]}>
          {/* Outer face */}
          <mesh>
            <sphereGeometry args={[1.40, 96, 96, 0.45, Math.PI * 1.05, 0.16, Math.PI * 0.75]} />
            <MeshDistortMaterial
              color="#C06040"
              emissive="#E07848"
              emissiveIntensity={BASE.emissive.mid}
              roughness={0.44}
              metalness={0.02}
              distort={BASE.distort.mid}
              speed={0.50}
              side={THREE.FrontSide}
            />
          </mesh>
          {/* Inner wall face */}
          <mesh>
            <sphereGeometry args={[1.26, 80, 80, 0.45, Math.PI * 1.05, 0.16, Math.PI * 0.75]} />
            <MeshDistortMaterial
              color="#5A2010"
              emissive="#3A1008"
              emissiveIntensity={0.10}
              roughness={0.75}
              metalness={0.0}
              distort={0.20}
              speed={0.44}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/* CORE — warm alabaster egg, glows from within, no inner wall needed */}
        <mesh ref={coreMeshRef}>
          <sphereGeometry args={[0.62, 64, 64]} />
          <MeshDistortMaterial
            color="#F5D8B0"
            emissive="#FFD090"
            emissiveIntensity={BASE.emissive.core}
            roughness={0.28}
            metalness={0.0}
            distort={BASE.distort.core}
            speed={0.28}
          />
        </mesh>
      </group>
    </>
  );
}
