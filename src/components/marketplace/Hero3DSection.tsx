import React, { lazy, Suspense, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Zap } from 'lucide-react';

// Lazy-load the 3D canvas so it doesn't block initial paint
const Hero3D = lazy(() => import('./Hero3D'));

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

const stats = [
  { label: 'Verified Farmers', value: '1,200+', icon: '🌾' },
  { label: 'Organic Products', value: '500+', icon: '🥦' },
  { label: 'Cities Served', value: '48', icon: '🏙️' },
  { label: 'Happy Customers', value: '85K+', icon: '😊' },
];

const badges = [
  { icon: ShieldCheck, label: 'Zero Chemicals', color: 'text-emerald-400' },
  { icon: Leaf, label: 'Certified Organic', color: 'text-green-400' },
  { icon: Zap, label: 'AI-Powered', color: 'text-amber-400' },
];

interface Hero3DSectionProps {
  onShopNow?: () => void;
  onMeetFarmers?: () => void;
}

export const Hero3DSection: React.FC<Hero3DSectionProps> = ({ onShopNow, onMeetFarmers }) => {
  const [supports3D] = useState<boolean>(detectSupports3D);

  return (
    <section
      className="relative overflow-hidden rounded-3xl mb-8 min-h-[480px] md:min-h-[540px]"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #0f4a2a 0%, #083020 50%, #030f07 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/8 rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-center min-h-[480px] md:min-h-[540px]">
        <div className="flex-1 p-8 md:p-12 z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-emerald-300 tracking-widest uppercase">
              AI-Powered Agritech Platform
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
            style={{ textShadow: '0 0 60px rgba(74,222,128,0.3)' }}
          >
            Farm-Fresh
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">
              Organic Food
            </span>
            <br />
            Delivered
          </h1>

          <p className="text-emerald-300/80 text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Direct from verified organic farms. Zero synthetic pesticides. Harvested fresh and admin-verified for quality.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {badges.map(b => (
              <div key={b.label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <b.icon className={`w-3.5 h-3.5 ${b.color}`} />
                <span className="text-white/80 text-xs font-semibold">{b.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onShopNow}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onMeetFarmers}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl transition-all hover:scale-105"
            >
              <span>Meet Our Farmers</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {stats.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-white font-black text-lg leading-none">{s.value}</div>
                <div className="text-emerald-400/70 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full md:w-auto h-72 md:h-[540px] relative">
          {supports3D ? (
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-600/10 blur-2xl animate-pulse" />
                </div>
              }
            >
              <Hero3D className="absolute inset-0 w-full h-full" />
            </Suspense>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-56 h-56 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                {['🥦', '🍅', '🥭', '🥕', '🍎', '🌽'].map((emoji, i) => (
                  <div
                    key={i}
                    className="absolute text-4xl animate-bounce"
                    style={{
                      top: `${Math.sin((i * 60 * Math.PI) / 180) * 85 + 90}px`,
                      left: `${Math.cos((i * 60 * Math.PI) / 180) * 85 + 90}px`,
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '2.4s',
                    }}
                  >
                    {emoji}
                  </div>
                ))}
                <div className="text-6xl">🌿</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero3DSection;
