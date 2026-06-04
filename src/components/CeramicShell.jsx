import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DRIFT_VIEWPORT_MQ = '(max-width: 1023px)';
const DEPTH_SCALE = 1.4;

const REACTIONS = [
  'squish', 'jiggle', 'heartbeat', 'spinBurst',
  'blush', 'leanToward', 'distortSpike', 'shimmy',
];

const BASE = {
  rotX: 0.06, rotY: 0.09,
  distort:  { outer: 0.78, mid: 0.74, core: 0.30 },
  emissive: { outer: 0.44, mid: 0.60, core: 1.40 },
  corePos:  new THREE.Vector3(0.10, -0.24, 0.12),
  midPos:   new THREE.Vector3(0.05, -0.07, 0.04),
};

const DURATION = {
  squish: 0.85, jiggle: 1.20, heartbeat: 0.70, spinBurst: 0.90,
  blush: 0.55, leanToward: 0.90, distortSpike: 0.90, shimmy: 0.75,
};

// Option B — Fresnel rim shader.
// Chains AFTER drei's own onBeforeCompile (which handles the distort vertex shader)
// so both distort and rim effects coexist on the same material.
function applyFresnel(mat, rimR, rimG, rimB, strength) {
  if (!mat) return;
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    if (prev) prev.call(mat, shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      `{
        vec3 _vd = normalize(-vViewPosition);
        float _rim = pow(1.0 - abs(dot(normalize(vNormal), _vd)), 1.9);
        outgoingLight += _rim * vec3(${rimR.toFixed(3)},${rimG.toFixed(3)},${rimB.toFixed(3)}) * ${strength.toFixed(2)};
      }
      #include <output_fragment>`,
    );
  };
  mat.needsUpdate = true;
}

export default function CeramicShell() {
  const groupRef       = useRef();
  const outerMeshRef   = useRef();
  const outerMatRef    = useRef();
  const midMeshRef     = useRef();
  const midMatRef      = useRef();
  const coreGroupRef   = useRef();
  const coreMatRef     = useRef();
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

  // Apply Fresnel rim glow after material creation
  useEffect(() => {
    applyFresnel(outerMatRef.current, 0.90, 0.40, 0.10, 2.8);
    applyFresnel(midMatRef.current,   0.98, 0.58, 0.18, 2.2);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const { x: ndcX, y: ndcY } = useDrift ? { x: 0, y: 0 } : mouseNdcRef.current;

    const W = viewport.width  * DEPTH_SCALE;
    const H = viewport.height * DEPTH_SCALE;

    if (useDrift) {
      driftTimeRef.current += delta;
      const d = driftTimeRef.current;
      const nx = 0.74 * Math.sin(d * 0.26) + 0.22 * Math.sin(d * 0.14 + 0.85) + 0.08 * Math.sin(d * 0.41);
      const ny = 0.66 * Math.cos(d * 0.22) + 0.20 * Math.sin(d * 0.18 + 1.05) + 0.07 * Math.cos(d * 0.35);
      targetPosition.current.set((nx * W) / 2, (ny * H) / 2, -2);
    } else {
      targetPosition.current.set((ndcX * W) / 2, (ndcY * H) / 2, -2);
    }
    groupRef.current.position.lerp(targetPosition.current, Math.min(1, delta * 1.8));
    groupRef.current.position.add(leanOffset.current);

    corePosTarget.current.set(
      BASE.corePos.x + ndcX * 0.08,
      BASE.corePos.y + ndcY * 0.06,
      BASE.corePos.z,
    );
    midPosTarget.current.set(
      BASE.midPos.x + ndcX * 0.04,
      BASE.midPos.y + ndcY * 0.03,
      BASE.midPos.z,
    );
    if (coreGroupRef.current) coreGroupRef.current.position.lerp(corePosTarget.current, Math.min(1, delta * 4.0));
    if (midMeshRef.current)   midMeshRef.current.position.lerp(midPosTarget.current,    Math.min(1, delta * 2.6));

    // Egg breathing
    const eggBreath   = Math.sin(t * 0.72 + 0.5);
    const eggScaleMul = 1 + eggBreath * 0.09;
    const eggEmissive = BASE.emissive.core * (1 + eggBreath * 0.28);
    if (coreGroupRef.current) {
      coreGroupRef.current.scale.set(1.0 * eggScaleMul, 1.22 * eggScaleMul, 0.94 * eggScaleMul);
    }
    if (coreMatRef.current) coreMatRef.current.emissiveIntensity = eggEmissive;

    const breatheNorm = eggBreath * 0.5 + 0.5;
    if (centerLightRef.current) centerLightRef.current.intensity = 3.0 + breatheNorm * 5.0;

    // Group rotation
    const sm1 = 1 + 0.25 * Math.sin(t * 0.13);
    const sm2 = 1 + 0.20 * Math.sin(t * 0.17 + 0.9);
    groupRef.current.rotation.x += delta * rotSpeedRef.current.x * sm1;
    groupRef.current.rotation.y += delta * rotSpeedRef.current.y * sm2;

    // Per-layer counter-rotation with variation — apertures shift organically
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += delta * (0.07 + 0.04 * Math.sin(t * 0.09));
      outerMeshRef.current.rotation.z += delta * (0.025 + 0.02 * Math.sin(t * 0.07 + 1.5));
      outerMeshRef.current.rotation.x += delta * 0.020 * Math.cos(t * 0.11 + 0.8);
    }
    if (midMeshRef.current) {
      midMeshRef.current.rotation.y -= delta * (0.11 + 0.05 * Math.sin(t * 0.13 + 0.4));
      midMeshRef.current.rotation.x += delta * (0.045 + 0.025 * Math.sin(t * 0.10 + 1.9));
      midMeshRef.current.rotation.z -= delta * 0.018 * Math.cos(t * 0.12 + 1.1);
    }
    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y += delta * 0.16;
      coreGroupRef.current.rotation.x -= delta * 0.08;
    }

    // Per-layer organic shape breathing
    if (outerMeshRef.current) {
      const ob = 1 + Math.sin(t * 0.31) * 0.035;
      outerMeshRef.current.scale.set(ob, 1 + Math.cos(t * 0.27 + 1.1) * 0.025, ob);
    }
    if (midMeshRef.current) {
      const mb = 1 + Math.sin(t * 0.38 + 2.1) * 0.045;
      midMeshRef.current.scale.set(mb, 1 + Math.cos(t * 0.34 + 0.7) * 0.03, mb);
    }

    // Reactions
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
      const om  = outerMatRef.current;
      const mm  = midMatRef.current;
      const cm  = coreMatRef.current;

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
          if (centerLightRef.current) centerLightRef.current.intensity = (3.0 + breatheNorm * 5.0) + spike * 4;
          break;
        }
        case 'leanToward': {
          const lean = Math.sin(tp * Math.PI) * 0.22;
          const { x: cx, y: cy } = clickNdcRef.current;
          leanOffset.current.set(cx * W * 0.25 * lean, cy * H * 0.25 * lean, 0);
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
      <ambientLight intensity={0.06} color="#f8d4a8" />
      <directionalLight position={[ 8,  7,  4]} intensity={1.1} color="#f5e0c0" />
      <directionalLight position={[-9, -4,  5]} intensity={0.45} color="#d4854a" />
      <pointLight position={[ 3.5,  2.0,  2.5]} color="#ffb870" intensity={2.0} distance={9} decay={2} />
      <pointLight position={[-2.5, -3.0,  2.0]} color="#d47030" intensity={1.4} distance={7} decay={2} />

      <group ref={groupRef}>
        <pointLight ref={centerLightRef} position={[0.08, -0.18, 0.10]} color="#ffb060" distance={4.2} decay={2.8} />

        {/*
          OUTER — single crescent arc (0.85π ≈ 153°), DoubleSide.
          Option B Fresnel applied via useEffect after mount.
          High distort (0.78) makes the cut edges organic not geometric.
        */}
        <mesh ref={outerMeshRef} rotation={[0.20, 0.40, -0.12]} renderOrder={1}>
          <sphereGeometry args={[1.80, 128, 128, 0, Math.PI * 0.85, 0.08, Math.PI * 0.84]} />
          <MeshDistortMaterial
            ref={outerMatRef}
            color="#7A2E0E"
            emissive="#C04010"
            emissiveIntensity={BASE.emissive.outer}
            roughness={0.50}
            metalness={0.03}
            distort={BASE.distort.outer}
            speed={0.44}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/*
          MID — nearly full sphere (1.75π ≈ 315°), DoubleSide.
          Stencil test: only renders within the outer sphere's projection.
          This is the containment — mid cannot bleed past the outer boundary.
          Counter-rotates against outer so apertures shift independently.
        */}
        <mesh ref={midMeshRef} rotation={[-0.32, -0.72, 0.26]} renderOrder={2}>
          <sphereGeometry args={[1.26, 96, 96, 0.20, Math.PI * 0.80, 0.14, Math.PI * 0.80]} />
          <MeshDistortMaterial
            ref={midMatRef}
            color="#C06040"
            emissive="#E07848"
            emissiveIntensity={BASE.emissive.mid}
            roughness={0.44}
            metalness={0.02}
            distort={BASE.distort.mid}
            speed={0.48}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/*
          CORE — literal edge outline (BackSide R=0.582, same distort as egg)
          breathes identically with egg. Egg on top.
        */}
        <group ref={coreGroupRef} renderOrder={3}>
          <mesh>
            <sphereGeometry args={[0.582, 48, 48]} />
            <MeshDistortMaterial
              color="#A04010"
              emissive="#C04808"
              emissiveIntensity={0.52}
              roughness={0.58}
              distort={BASE.distort.core}
              speed={0.28}
              side={THREE.BackSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.56, 64, 64]} />
            <MeshDistortMaterial
              ref={coreMatRef}
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
      </group>
    </>
  );
}
