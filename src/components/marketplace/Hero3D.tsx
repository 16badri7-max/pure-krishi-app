import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ── Floating Organic Sphere (Tomato / Fruit) ──────────────────────────────────
function OrganicFruit({ position, color, speed = 1, scale = 1 }: {
  position: [number, number, number];
  color: string;
  speed?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.4;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
  });
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          distort={0.25}
          speed={1.8}
          roughness={0.15}
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </Sphere>
    </Float>
  );
}

// ── Floating Leaf / Hexagon ───────────────────────────────────────────────────
function FloatingLeaf({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.3;
  });
  return (
    <Float speed={2} floatIntensity={1.5}>
      <Torus ref={meshRef} args={[0.6, 0.15, 16, 100]} position={position}>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </Torus>
    </Float>
  );
}

// ── Rotating DNA Helix / Agricultural Particle Ring ───────────────────────────
function ParticleRing() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 4;
      const radius = 3.5 + Math.sin(i * 0.3) * 0.3;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(i * 0.15) * 0.8,
        Math.sin(angle) * radius
      ));
    }
    return pts;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#4ade80" size={0.04} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ── Central Glowing Core ──────────────────────────────────────────────────────
function GlowCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    ref.current.scale.set(s, s, s);
  });
  return (
    <Sphere ref={ref} args={[1.2, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#176B45"
        distort={0.4}
        speed={2}
        roughness={0.05}
        metalness={0.6}
        envMapIntensity={1.2}
        emissive="#104D35"
        emissiveIntensity={0.4}
      />
    </Sphere>
  );
}

// ── Floating Cube (Grain/Box) ─────────────────────────────────────────────────
function FloatingBox({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.6;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={1.8} floatIntensity={1}>
      <Box ref={ref} args={[0.5, 0.5, 0.5]} position={position}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </Box>
    </Float>
  );
}

// ── Main 3D Scene ─────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-6, -4, 6]} intensity={0.8} color="#4ade80" />
      <pointLight position={[0, 0, -6]} intensity={0.5} color="#fbbf24" />

      <Stars radius={60} depth={40} count={800} factor={3} fade />
      <Environment preset="forest" />

      {/* Central glowing organic sphere */}
      <GlowCore />

      {/* Particle orbit ring */}
      <ParticleRing />

      {/* Floating fruits/vegetables */}
      <OrganicFruit position={[3.2, 0.8, -1]} color="#ef4444" speed={0.8} scale={0.7} /> {/* Tomato */}
      <OrganicFruit position={[-3, 0.5, -0.5]} color="#f97316" speed={1.1} scale={0.6} /> {/* Orange */}
      <OrganicFruit position={[2.5, -1.5, 0.5]} color="#facc15" speed={0.9} scale={0.5} /> {/* Lemon */}
      <OrganicFruit position={[-2.8, -1, 0.8]} color="#84cc16" speed={1.2} scale={0.55} /> {/* Lime */}
      <OrganicFruit position={[0.5, 2.8, -1]} color="#a855f7" speed={0.7} scale={0.5} /> {/* Plum */}

      {/* Floating rings */}
      <FloatingLeaf position={[4, 2, -1]} color="#4ade80" />
      <FloatingLeaf position={[-4, -2, 0]} color="#34d399" />
      <FloatingLeaf position={[1, -3, -0.5]} color="#86efac" />

      {/* Floating boxes (grain/spice) */}
      <FloatingBox position={[-1.5, 3, 0]} color="#fbbf24" />
      <FloatingBox position={[4.5, -1.5, -0.5]} color="#fb923c" />
    </>
  );
}

// ── Fallback for 3D not supported ─────────────────────────────────────────────
function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-600/20 blur-3xl animate-pulse" />
    </div>
  );
}

// ── Exported Hero 3D Component ────────────────────────────────────────────────
export const Hero3D: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className ?? 'w-full h-full'}`}>
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [0, 0, 9], fov: 55 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Hero3D;
