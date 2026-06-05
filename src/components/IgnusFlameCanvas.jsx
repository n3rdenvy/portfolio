import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── GLSL noise (value noise + FBM) ──────────────────────────────────────────

const NOISE_GLSL = /* glsl */`
float _hash(vec3 p) {
  p = fract(p * vec3(443.8975, 397.2973, 491.1871));
  p += dot(p.zxy, p.yxz + 19.19);
  return fract(p.x * p.y * p.z);
}
float _noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(_hash(i+vec3(0,0,0)),_hash(i+vec3(1,0,0)),u.x),
        mix(_hash(i+vec3(0,1,0)),_hash(i+vec3(1,1,0)),u.x),u.y),
    mix(mix(_hash(i+vec3(0,0,1)),_hash(i+vec3(1,0,1)),u.x),
        mix(_hash(i+vec3(0,1,1)),_hash(i+vec3(1,1,1)),u.x),u.y),
    u.z);
}
float fbm(vec3 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * _noise(p);
    p = p * 2.1 + vec3(31.41, 17.23, 53.61);
    a *= 0.5;
  }
  return v;
}
`;

// ─── Fire shader ──────────────────────────────────────────────────────────────

const fireVert = /* glsl */`
${NOISE_GLSL}
uniform float time;
uniform float intensity;
varying float vHeat;

void main() {
  vec3 pos = position;

  // Noise field flowing upward — fire rises
  float n  = fbm(pos * 1.8 + vec3(0.0, -time * 1.5, time * 0.4));
  float n2 = fbm(pos * 3.4 + vec3(time * 0.8, 0.0, -time * 0.3)) * 0.35;

  // More displacement at top (flames taper upward)
  float upBias = pow(clamp((pos.y + 1.0) / 2.0, 0.0, 1.0), 0.55);

  float disp = (n + n2) * intensity * upBias * 0.85;
  vHeat = clamp(disp / (intensity * 0.85 + 0.001), 0.0, 1.0);

  vec3 displaced = pos + normalize(pos) * disp * 0.65;
  displaced.y += disp * 1.0; // Flames rise upward
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const fireFrag = /* glsl */`
uniform float intensity;
varying float vHeat;

vec3 fireColor(float t) {
  // Dark red → orange → yellow-orange → near white
  vec3 c0 = vec3(0.65, 0.04, 0.0);
  vec3 c1 = vec3(1.0,  0.22, 0.0);
  vec3 c2 = vec3(1.0,  0.72, 0.04);
  vec3 c3 = vec3(1.0,  0.96, 0.62);
  if (t < 0.33) return mix(c0, c1, t / 0.33);
  if (t < 0.67) return mix(c1, c2, (t - 0.33) / 0.34);
  return mix(c2, c3, (t - 0.67) / 0.33);
}

void main() {
  float t = vHeat;
  float alpha = smoothstep(0.04, 0.22, t) * intensity;
  alpha *= 1.0 - smoothstep(0.82, 1.0, t) * 0.45; // wisp fade at tips
  vec3 col = fireColor(t) * 1.9; // bright — fire emits light
  gl_FragColor = vec4(col, alpha * 0.92);
}
`;

// ─── Ambient glow shader ──────────────────────────────────────────────────────

const glowVert = /* glsl */`
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const glowFrag = /* glsl */`
uniform float intensity;
void main() {
  gl_FragColor = vec4(1.0, 0.32, 0.02, intensity * 0.11);
}
`;

// ─── Animation phases ─────────────────────────────────────────────────────────

const PHASES = [
  { duration: 3.2, from: 0.07, to: 0.07 },  // idle
  { duration: 2.6, from: 0.07, to: 1.0  },  // ignite
  { duration: 4.0, from: 1.0,  to: 1.0  },  // burning
  { duration: 2.2, from: 1.0,  to: 0.07 },  // cool
];

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function IgnusMesh() {
  const fireRef = useRef();
  const glowRef = useRef();
  const wireRef = useRef();

  const phaseIdx = useRef(0);
  const phaseT   = useRef(0);

  const fireUniforms = useRef({ time: { value: 0 }, intensity: { value: 0.07 } });
  const glowUniforms = useRef({ intensity: { value: 0.07 } });

  const icoGeo  = useMemo(() => new THREE.IcosahedronGeometry(1.0, 1), []);
  const fireGeo = useMemo(() => new THREE.SphereGeometry(1.0, 52, 36), []);
  const glowGeo = useMemo(() => new THREE.SphereGeometry(1.6, 16, 12), []);
  const wireGeo = useMemo(() => new THREE.EdgesGeometry(icoGeo), [icoGeo]);

  useFrame((_, delta) => {
    phaseT.current += delta;
    const phase = PHASES[phaseIdx.current];

    if (phaseT.current >= phase.duration) {
      phaseT.current -= phase.duration;
      phaseIdx.current = (phaseIdx.current + 1) % PHASES.length;
    }

    const p = PHASES[phaseIdx.current];
    const intensity = p.from + (p.to - p.from) * easeInOut(Math.min(phaseT.current / p.duration, 1));

    fireUniforms.current.time.value += delta;
    fireUniforms.current.intensity.value = intensity;
    glowUniforms.current.intensity.value = intensity;

    const rotSpeed = delta * (0.14 + intensity * 0.10);
    if (wireRef.current) {
      wireRef.current.rotation.y += rotSpeed;
      wireRef.current.material.opacity = 0.62 - intensity * 0.38;
    }
    if (fireRef.current) fireRef.current.rotation.y += rotSpeed;
    if (glowRef.current) glowRef.current.rotation.y += rotSpeed;
  });

  return (
    <>
      {/* Ambient fire glow — large back-facing sphere */}
      <mesh ref={glowRef} geometry={glowGeo}>
        <shaderMaterial
          uniforms={glowUniforms.current}
          vertexShader={glowVert}
          fragmentShader={glowFrag}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Fire volume — high-res sphere with noise displacement */}
      <mesh ref={fireRef} geometry={fireGeo}>
        <shaderMaterial
          uniforms={fireUniforms.current}
          vertexShader={fireVert}
          fragmentShader={fireFrag}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Structural wireframe — cools as fire intensifies */}
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial
          color="#d8eeff"
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function IgnusFlameCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 3.3], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <IgnusMesh />
    </Canvas>
  );
}
