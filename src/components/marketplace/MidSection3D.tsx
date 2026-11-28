import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const PRODUCE_SHOWCASE = [
  { id: 'tomato', color: '#dc2626', accent: '#15803d', label: 'Heirloom Tomatoes', origin: 'Nashik ZBNF', emoji: '🍅', angle: 0 },
  { id: 'carrot', color: '#ea580c', accent: '#22c55e', label: 'Rainbow Carrots', origin: 'Mandya Organic', emoji: '🥕', angle: 60 },
  { id: 'mango', color: '#f59e0b', accent: '#78350f', label: 'Ratnagiri Mango', origin: 'GI-Tagged Hapus', emoji: '🥭', angle: 120 },
  { id: 'broccoli', color: '#16a34a', accent: '#84cc16', label: 'Fresh Greens', origin: 'Polyhouse Fresh', emoji: '🥦', angle: 180 },
  { id: 'apple', color: '#b91c1c', accent: '#4ade80', label: 'Shimla Apples', origin: '7,500 ft Orchard', emoji: '🍎', angle: 240 },
  { id: 'brinjal', color: '#7e22ce', accent: '#15803d', label: 'Purple Brinjal', origin: 'Zero Residue', emoji: '🍆', angle: 300 },
];

function OrbitingProduce({
  item,
  isSelected,
  onSelect,
}: {
  item: (typeof PRODUCE_SHOWCASE)[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const startAngle = (item.angle * Math.PI) / 180;

  useFrame(state => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.35 + startAngle;
    ref.current.position.x = Math.cos(t) * 2.75;
    ref.current.position.z = Math.sin(t) * 2.75;
    ref.current.position.y = Math.sin(t * 2) * 0.35;
    const targetScale = isSelected ? 1.3 : 1.0;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group
      ref={ref}
      onClick={e => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
      <Float speed={2.5} floatIntensity={0.35}>
        <mesh>
          <sphereGeometry args={[0.38, 28, 28]} />
          <meshPhysicalMaterial
            color={item.color}
            roughness={0.2}
            clearcoat={0.6}
            emissive={isSelected ? item.color : '#000000'}
            emissiveIntensity={isSelected ? 0.35 : 0}
          />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <coneGeometry args={[0.08, 0.16, 6]} />
          <meshStandardMaterial color={item.accent} roughness={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

function FarmGlobe({ scrollRatio }: { scrollRatio: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.25 + scrollRatio * 1.4;
    ref.current.rotation.x = Math.sin(scrollRatio * Math.PI) * 0.18;
  });
  return (
    <SphereMesh refProp={ref} />
  );
}

function SphereMesh({ refProp }: { refProp: React.RefObject<THREE.Mesh | null> }) {
  return (
    <mesh ref={refProp}>
      <sphereGeometry args={[1.05, 48, 48]} />
      <MeshDistortMaterial
        color="#176B45"
        distort={0.14}
        speed={1.4}
        roughness={0.28}
        metalness={0.45}
        emissive="#104D35"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.75, 0.018, 16, 160]} />
      <meshStandardMaterial color="#4ade80" transparent opacity={0.35} />
    </mesh>
  );
}

function MidScene({
  selectedId,
  onSelect,
  scrollRatio,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  scrollRatio: number;
}) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.7} color="#ffffff" />
      <pointLight position={[-5, -3, 3]} intensity={1.1} color="#4ade80" />
      <FarmGlobe scrollRatio={scrollRatio} />
      <OrbitRing />
      {PRODUCE_SHOWCASE.map(item => (
        <OrbitingProduce
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function detectSupports3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export const MidSection3D: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('tomato');
  const [scrollRatio, setScrollRatio] = useState(0);
  const [supports3D] = useState<boolean>(detectSupports3D);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollRatio(Math.min(1, window.scrollY / maxScroll));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeItem = PRODUCE_SHOWCASE.find(p => p.id === selectedId) || PRODUCE_SHOWCASE[0];

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full h-56 md:h-64">
        {supports3D ? (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl animate-spin">🌿</div>
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 1.9, 6.8], fov: 48 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <MidScene selectedId={selectedId} onSelect={setSelectedId} scrollRatio={scrollRatio} />
            </Canvas>
          </Suspense>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gap-3 text-4xl">
            {PRODUCE_SHOWCASE.map(p => (
              <span key={p.id}>{p.emoji}</span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Produce Selector Pill Strip */}
      <div className="w-full px-4 pb-4 flex flex-col items-center gap-2 z-10">
        <div className="bg-black/30 backdrop-blur-md border border-emerald-400/25 rounded-xl px-3 py-1.5 text-center">
          <span className="text-xs font-bold text-white">
            {activeItem.emoji} {activeItem.label}
          </span>
          <span className="text-[11px] text-emerald-300 ml-2">• {activeItem.origin}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {PRODUCE_SHOWCASE.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`px-2 py-1 rounded-lg text-xs transition-all ${
                selectedId === p.id
                  ? 'bg-emerald-500 text-white shadow-sm scale-105'
                  : 'bg-white/10 text-emerald-200 hover:bg-white/20'
              }`}
              title={p.label}
            >
              {p.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MidSection3D;
