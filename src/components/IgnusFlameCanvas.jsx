import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── GLSL noise ───────────────────────────────────────────────────────────────

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

// ─── Fire vertex shader ───────────────────────────────────────────────────────
// Displaces the flame-shaped geometry outward + upward with noise.
// vHeat drives the color ramp in the fragment shader.

const fireVert = /* glsl */`
${NOISE_GLSL}
uniform float time;
uniform float intensity;
varying float vHeat;
varying float vY;

void main() {
  vec3 pos = position;

  float n  = fbm(pos * 1.6 + vec3(0.0, -time * 1.5, time * 0.4));
  float n2 = fbm(pos * 3.2 + vec3(time * 0.7, 0.0, -time * 0.35)) * 0.3;

  // Flames bias toward top — tip displacement > base
  float upBias = pow(clamp((pos.y + 1.3) / 3.1, 0.0, 1.0), 0.5);

  float disp = (n + n2) * intensity * upBias * 0.9;
  vHeat = clamp(disp / (intensity * 0.9 + 0.001), 0.0, 1.0);
  vY = pos.y; // raw height for color ramp

  vec3 displaced = pos + normalize(pos + vec3(0.0, 0.001, 0.0)) * disp * 0.6;
  displaced.y += disp * 1.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

// ─── Fire fragment shader ─────────────────────────────────────────────────────
// Color ramp matches the reference: blue base → orange body → yellow tip.

const fireFrag = /* glsl */`
uniform float intensity;
varying float vHeat;
varying float vY;

vec3 fireColor(float t, float y) {
  // Base glow: deep blue (real fire — hottest combustion at fuel source)
  vec3 blue   = vec3(0.05, 0.15, 0.90);
  // Low flame: rich orange
  vec3 orange = vec3(1.0,  0.28, 0.02);
  // Mid flame: bright orange-yellow
  vec3 yellow = vec3(1.0,  0.72, 0.04);
  // Tips: near white-yellow
  vec3 white  = vec3(1.0,  0.96, 0.60);

  // Blue lives at the very base regardless of heat
  float baseMix = smoothstep(-0.8, -0.2, y); // 0 at bottom, 1 by midpoint
  vec3 baseCol = mix(blue, orange, baseMix);

  // Then heat drives orange → yellow → white up the flame
  vec3 heatCol;
  if (t < 0.4) heatCol = mix(orange, yellow, t / 0.4);
  else          heatCol = mix(yellow, white,  (t - 0.4) / 0.6);

  return mix(baseCol, heatCol, baseMix);
}

void main() {
  float t = vHeat;
  float alpha = smoothstep(0.04, 0.20, t) * intensity;
  alpha *= 1.0 - smoothstep(0.80, 1.0, t) * 0.4;
  vec3 col = fireColor(t, vY) * 2.0;
  gl_FragColor = vec4(col, alpha * 0.90);
}
`;

// ─── Glow shaders ─────────────────────────────────────────────────────────────

const glowVert = /* glsl */`
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const glowFrag = /* glsl */`
uniform float intensity;
void main() {
  // Warm amber glow at full burn, subtle blue-white at idle
  vec3 col = mix(vec3(0.2, 0.2, 0.6), vec3(1.0, 0.35, 0.02), intensity);
  gl_FragColor = vec4(col, intensity * 0.10);
}
`;

// ─── Flame profile geometry ───────────────────────────────────────────────────
// LatheGeometry rotated profile approximating the Ignus flame silhouette:
// narrow tip at top, organic body, wider curved base.

function buildFlameGeo(radialSegs = 28, heightSegs = 18) {
  // Profile points: [x=radius, y=height] — matches the flame emoji silhouette
  const raw = [
    [0.00,  1.70],  // sharp tip
    [0.08,  1.50],
    [0.20,  1.22],
    [0.32,  0.92],
    [0.44,  0.60],  // upper body
    [0.52,  0.25],
    [0.56,  -0.05],
    [0.52,  -0.32], // slight narrowing at waist
    [0.60,  -0.58], // lower body swells
    [0.58,  -0.88],
    [0.38,  -1.12],
    [0.00,  -1.30], // base point
  ];

  // Run through CatmullRom-style smoothing by oversampling
  const curve = new THREE.CatmullRomCurve3(
    raw.map(([x, y]) => new THREE.Vector3(x, y, 0))
  );
  const pts = curve.getPoints(heightSegs).map(p => new THREE.Vector2(p.x, p.y));

  return new THREE.LatheGeometry(pts, radialSegs);
}

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

  const flameGeo = useMemo(() => buildFlameGeo(28, 20), []);
  const wireGeo  = useMemo(() => new THREE.WireframeGeometry(buildFlameGeo(14, 10)), []);
  const glowGeo  = useMemo(() => buildFlameGeo(16, 10), []);

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

    // Slow Y rotation — slightly faster as fire builds
    const rotSpeed = delta * (0.13 + intensity * 0.08);
    if (wireRef.current) {
      wireRef.current.rotation.y += rotSpeed;
      // Wireframe fades as fire overwhelms it (matches flame75 reference)
      wireRef.current.material.opacity = 0.65 - intensity * 0.42;
    }
    if (fireRef.current) fireRef.current.rotation.y += rotSpeed;
    if (glowRef.current) glowRef.current.rotation.y += rotSpeed;
  });

  return (
    <>
      {/* Ambient glow — larger flame shape behind everything */}
      <mesh ref={glowRef} geometry={glowGeo} scale={1.35}>
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

      {/* Fire volume — flame-shaped with noise displacement */}
      <mesh ref={fireRef} geometry={flameGeo}>
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

      {/* Structural wireframe — white-cool, fades as fire peaks */}
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial
          color="#ddeeff"
          transparent
          opacity={0.65}
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
      camera={{ position: [0, 0.2, 3.6], fov: 42 }}
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
