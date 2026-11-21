import React, { useEffect, useRef, useState } from 'react';
import logoImg from '../../assets/logo.jpg';

interface SplashScreenProps {
  onDone: () => void;
}

// ── Web Audio chime ────────────────────────────────────
function playOpeningSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playNote = (freq: number, startTime: number, duration: number, vol = 0.18) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Nature-inspired rising chime chord (G major pentatonic)
    const t = ctx.currentTime;
    playNote(392.0, t + 0.0,  1.4, 0.15); // G4
    playNote(493.9, t + 0.18, 1.3, 0.13); // B4
    playNote(587.3, t + 0.36, 1.2, 0.14); // D5
    playNote(784.0, t + 0.54, 1.5, 0.16); // G5
    playNote(1046.5,t + 0.72, 1.6, 0.11); // C6 shimmer
    // gentle pad underneath
    playNote(196.0, t + 0.0,  2.5, 0.08); // G3 pad
    playNote(261.6, t + 0.0,  2.5, 0.07); // C4 pad
  } catch (_) {}
}

const features = [
  {
    emoji: '🌱',
    title: 'Zero Synthetic Pesticides',
    desc: '100% certified organic, residue-tested every batch',
    color: 'from-emerald-400/20 to-emerald-600/10',
    border: 'border-emerald-400/30',
    delay: 0,
  },
  {
    emoji: '🤖',
    title: 'AI-Powered Agronomy',
    desc: 'Gemini AI guides farmers on crops, soil & yield',
    color: 'from-blue-400/20 to-blue-600/10',
    border: 'border-blue-400/30',
    delay: 180,
  },
  {
    emoji: '🚜',
    title: 'Farm to Fork Direct',
    desc: 'From verified farmers straight to your kitchen',
    color: 'from-amber-400/20 to-orange-500/10',
    border: 'border-amber-400/30',
    delay: 360,
  },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'logo' | 'features' | 'exit'>('logo');
  const [logoReady, setLogoReady] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>([false, false, false]);
  const [exitReady, setExitReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // ── Particle canvas ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const colors = ['#4ade80', '#86efac', '#fbbf24', '#34d399', '#a3e635', '#6ee7b7'];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        r: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.001;
        if (p.y < -10 || p.alpha <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.alpha = Math.random() * 0.5 + 0.2;
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Sequence ─────────────────────────────────────────
  useEffect(() => {
    playOpeningSound();

    // Phase 1: Logo appears
    const t1 = setTimeout(() => setLogoReady(true), 100);

    // Phase 2: Features appear one by one
    const t2 = setTimeout(() => setPhase('features'), 1400);
    const t3 = setTimeout(() => setVisibleFeatures([true, false, false]), 1600);
    const t4 = setTimeout(() => setVisibleFeatures([true, true, false]), 1900);
    const t5 = setTimeout(() => setVisibleFeatures([true, true, true]), 2200);

    // No auto-advance — user must click "Tap to continue"

    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, []);

  const handleContinue = () => {
    setPhase('exit');
    setTimeout(() => setExitReady(true), 100);
    setTimeout(() => onDone(), 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-500 ${
        exitReady ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #0f4a2a 0%, #083020 40%, #030f07 100%)' }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Grid lines background */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-green-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* ── LOGO block ── */}
      <div className={`relative flex flex-col items-center transition-all duration-700 ease-out ${
        logoReady ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8'
      } ${phase === 'features' ? '-translate-y-8' : ''}`}
        style={{ transformStyle: 'preserve-3d', perspective: '800px' }}>

        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-full blur-2xl bg-emerald-400/30 transition-all duration-1000 ${logoReady ? 'scale-150 opacity-60' : 'scale-100 opacity-0'}`} />

        {/* 3D rotating ring */}
        <div className="absolute w-44 h-44 rounded-full border border-emerald-400/20 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute w-52 h-52 rounded-full border border-emerald-300/10 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />

        {/* Logo */}
        <div className={`relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-emerald-400/40 shadow-2xl transition-all duration-1000 ${
          logoReady ? 'shadow-emerald-500/50' : ''
        }`}
          style={{ boxShadow: logoReady ? '0 0 60px rgba(74,222,128,0.4), 0 0 120px rgba(74,222,128,0.15)' : 'none' }}>
          <img src={logoImg} alt="Pure Krishi" className="w-full h-full object-cover" />
        </div>

        {/* Brand name */}
        <div className={`mt-5 text-center transition-all duration-700 delay-300 ${logoReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-5xl font-black text-white tracking-tight"
            style={{ textShadow: '0 0 40px rgba(74,222,128,0.6)' }}>
            Pure<span className="text-emerald-400">Krishi</span>
          </h1>
          <p className="text-emerald-300/70 text-sm mt-1 tracking-widest uppercase">Pure Food · Healthy Lives</p>

          {/* Animated underline */}
          <div className={`h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mt-3 mx-auto transition-all duration-1000 delay-500 ${
            logoReady ? 'w-48 opacity-80' : 'w-0 opacity-0'
          }`} />
        </div>
      </div>

      {/* ── THREE FEATURE CARDS ── */}
      <div className={`mt-10 px-6 w-full max-w-sm space-y-3 transition-all duration-500 ${
        phase === 'features' || phase === 'exit' ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {features.map((f, i) => (
          <div key={i}
            className={`relative flex items-center gap-4 px-5 py-3.5 rounded-2xl border backdrop-blur-sm bg-gradient-to-r transition-all duration-500 ${f.color} ${f.border} ${
              visibleFeatures[i] ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'
            }`}
            style={{
              transitionDelay: `${f.delay}ms`,
              boxShadow: visibleFeatures[i] ? '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
            }}>
            {/* Emoji */}
            <div className="text-3xl shrink-0 filter drop-shadow-lg"
              style={{ transform: visibleFeatures[i] ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)', transition: `transform 0.5s ease ${f.delay + 100}ms` }}>
              {f.emoji}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">{f.title}</p>
              <p className="text-white/60 text-[11px] mt-0.5 leading-snug">{f.desc}</p>
            </div>
            {/* Shimmer line */}
            <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ${visibleFeatures[i] ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        ))}
      </div>

      {/* Tap to continue — WAIT for user click */}
      <div className={`mt-8 transition-all duration-700 delay-500 ${
        visibleFeatures[2] && phase !== 'exit' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button onClick={handleContinue}
          className="flex flex-col items-center gap-2 group cursor-pointer">
          {/* Glowing pulse ring */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="absolute inset-1 rounded-full bg-emerald-500/10 animate-pulse" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
          <span className="text-emerald-300 text-xs font-bold tracking-widest uppercase group-hover:text-white transition-colors">
            Tap to Continue
          </span>
        </button>
      </div>

      {/* Bottom pure krishi stamp */}
      <div className="absolute bottom-6 text-center">
        <p className="text-emerald-900/50 text-[10px] tracking-widest uppercase">
          AI-Powered Agritech Platform
        </p>
      </div>
    </div>
  );
};
