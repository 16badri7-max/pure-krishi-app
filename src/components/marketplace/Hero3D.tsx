import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Tomato3D({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.45;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.35} floatIntensity={1.1}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh scale={[1, 0.86, 1]}>
          <sphereGeometry args={[0.72, 40, 40]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.18} clearcoat={0.7} clearcoatRoughness={0.15} />
        </mesh>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI * 2) / 5) * 0.16, 0.61, Math.sin((i * Math.PI * 2) / 5) * 0.16]}
            rotation={[0.45, (i * Math.PI * 2) / 5, 0]}
          >
            <coneGeometry args={[0.07, 0.24, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0.72, 0]} rotation={[0.15, 0, 0.1]}>
          <cylinderGeometry args={[0.035, 0.05, 0.22, 10]} />
          <meshStandardMaterial color="#166534" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function Carrot3D({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    groupRef.current.rotation.x = 0.25 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
  });
  return (
    <Float speed={2.1} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={groupRef} position={position} scale={scale} rotation={[0.2, 0, -0.35]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.28, 1.25, 24]} />
          <meshStandardMaterial color="#ea580c" roughness={0.38} />
        </mesh>
        {[-0.18, 0, 0.18].map((ang, idx) => (
          <mesh key={idx} position={[ang * 0.35, 0.76, 0]} rotation={[0, 0, ang]}>
            <cylinderGeometry args={[0.025, 0.05, 0.42, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Mango3D({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = -state.clock.elapsedTime * 0.38;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.0}>
      <group ref={groupRef} position={position} scale={scale} rotation={[0.15, 0.3, 0.2]}>
        <mesh scale={[0.85, 1.15, 0.78]}>
          <sphereGeometry args={[0.58, 36, 36]} />
          <meshPhysicalMaterial color="#f59e0b" roughness={0.22} clearcoat={0.45} emissive="#b45309" emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.16, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function Apple3D({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
  });
  return (
    <Float speed={1.7} rotationIntensity={0.3} floatIntensity={1.1}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh scale={[1, 0.94, 1]}>
          <sphereGeometry args={[0.56, 36, 36]} />
          <meshPhysicalMaterial color="#b91c1c" roughness={0.18} clearcoat={0.75} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.18, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.58, 0]} rotation={[0.2, 0, -0.6]} scale={[1.2, 0.25, 0.6]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#4ade80" roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function Broccoli3D({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.32;
  });
  const florets: [number, number, number][] = [
    [0, 0.35, 0],
    [0.24, 0.26, 0.15],
    [-0.24, 0.26, 0.14],
    [0.18, 0.26, -0.22],
    [-0.2, 0.26, -0.18],
  ];
  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.55, 14]} />
          <meshStandardMaterial color="#84cc16" roughness={0.55} />
        </mesh>
        {florets.map((pos, i) => (
          <mesh key={i} position={pos}>
            <dodecahedronGeometry args={[0.25, 1]} />
            <meshStandardMaterial color="#15803d" roughness={0.65} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function OrganicFarmCore() {
  const ref = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.08;
  });
  return (
    <group ref={ref} position={[0, -0.1, 0]}>
      <mesh>
        <sphereGeometry args={[1.15, 48, 48]} />
        <MeshDistortMaterial
          color="#176B45"
          distort={0.22}
          speed={1.4}
          roughness={0.2}
          metalness={0.35}
          emissive="#104D35"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Farm contour rings */}
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[1.85, 0.025, 16, 120]} />
        <meshStandardMaterial color="#4ade80" transparent opacity={0.45} emissive="#22c55e" emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2.5, -0.3, 0]}>
        <torusGeometry args={[2.35, 0.018, 16, 120]} />
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function FarmPollenParticles() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 180; i++) {
      const angle = (i / 180) * Math.PI * 6;
      const radius = 3.2 + Math.sin(i * 0.35) * 0.55;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(i * 0.22) * 1.4, Math.sin(angle) * radius));
    }
    return pts;
  }, []);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const ref = useRef<THREE.Points>(null);
  useFrame(state => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.09;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#86efac" size={0.045} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 8, 6]} intensity={1.8} color="#fffbeb" />
      <pointLight position={[-6, -3, 5]} intensity={1.1} color="#4ade80" />
      <pointLight position={[0, 4, -5]} intensity={0.8} color="#fbbf24" />

      <Stars radius={55} depth={35} count={600} factor={2.5} fade />
      <Environment preset="forest" />

      <OrganicFarmCore />
      <FarmPollenParticles />

      {/* Realistic 3D Fruits & Vegetables */}
      <Tomato3D position={[2.6, 1.1, 0.4]} scale={0.95} />
      <Carrot3D position={[-2.5, 0.9, 0.5]} scale={0.95} />
      <Mango3D position={[2.2, -1.5, 0.8]} scale={0.95} />
      <Apple3D position={[-2.3, -1.3, 0.9]} scale={0.95} />
      <Broccoli3D position={[0.2, 2.4, -0.4]} scale={1.0} />
    </>
  );
}

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-600/20 blur-3xl animate-pulse" />
    </div>
  );
}

export const Hero3D: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className ?? 'w-full h-full'}`}>
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [0, 0.2, 8.2], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Hero3D;
