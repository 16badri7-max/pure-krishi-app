import React, { Suspense, useRef, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// ── Orbiting Product Spheres ──────────────────────────────────────────────────
const PRODUCTS = [
  { color: '#ef4444', label: '🍅', angle: 0 },
  { color: '#f97316', label: '🥕', angle: 60 },
  { color: '#facc15', label: '🌽', angle: 120 },
  { color: '#84cc16', label: '🥦', angle: 180 },
  { color: '#06b6d4', label: '🫛', angle: 240 },
  { color: '#a855f7', label: '🍆', angle: 300 },
];

function OrbitingSphere({ color, angle }: { color: string; angle: number }) {
  const ref = useRef<THREE.Group>(null);
  const startAngle = (angle * Math.PI) / 180;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.4 + startAngle;
    ref.current.position.x = Math.cos(t) * 2.8;
    ref.current.position.z = Math.sin(t) * 2.8;
    ref.current.position.y = Math.sin(t * 2) * 0.4;
  });

  return (
    <group ref={ref}>
      <Float speed={3} floatIntensity={0.3}>
        <Sphere args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            distort={0.2}
            speed={2}
            roughness={0.1}
            metalness={0.2}
            envMapIntensity={1}
          />
        </Sphere>
      </Float>
    </group>
  );
}

// ── Central rotating earth/farm sphere ───────────────────────────────────────
function FarmGlobe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <Sphere ref={ref} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#176B45"
        distort={0.15}
        speed={1.5}
        roughness={0.3}
        metalness={0.5}
        emissive="#104D35"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
}

// ── Connecting orbit trail ────────────────────────────────────────────────────
function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.8, 0.015, 16, 200]} />
      <meshStandardMaterial color="#4ade80" transparent opacity={0.3} />
    </mesh>
  );
}

function MidScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#4ade80" />
      <FarmGlobe />
      <OrbitRing />
      {PRODUCTS.map((p) => (
        <OrbitingSphere key={p.angle} color={p.color} angle={p.angle} />
      ))}
    </>
  );
}

// ── Exported mid-section 3D ───────────────────────────────────────────────────
export const MidSection3D: React.FC = () => {
  return (
    <div className="relative w-full h-64 md:h-80">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl animate-spin">🌿</div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 2, 7], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <MidScene />
        </Canvas>
      </Suspense>

      {/* Product emoji labels floating around (CSS layer) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {PRODUCTS.map((p, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-bounce"
            style={{
              animationDelay: `${i * 300}ms`,
              animationDuration: '3s',
              opacity: 0.0, // Hidden — 3D handles it; shown only as fallback
            }}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MidSection3D;
