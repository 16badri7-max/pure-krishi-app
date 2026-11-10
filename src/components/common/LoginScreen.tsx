import React, { useState } from 'react';
import { ChevronRight, Sparkles, ArrowRight, ShieldCheck, Tractor, ShoppingBag } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { UserRole } from '../../types';
import logoImg from '../../assets/logo.jpg';

interface LoginScreenProps {
  onLogin: () => void;
}

const roles = [
  {
    role: 'super_admin' as UserRole,
    label: 'Admin / User',
    description: 'Full system control, finance & reporting',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-300',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    avatar: '👨‍💼',
  },
  {
    role: 'farmer' as UserRole,
    label: 'Farmer',
    description: 'Manage crops, harvests & earnings',
    icon: Tractor,
    gradient: 'from-amber-400 to-orange-500',
    ring: 'ring-amber-300',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    avatar: '🧑‍🌾',
  },
  {
    role: 'customer' as UserRole,
    label: 'Customer',
    description: 'Shop fresh farm-to-fork produce',
    icon: ShoppingBag,
    gradient: 'from-sky-400 to-blue-600',
    ring: 'ring-sky-300',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    avatar: '🛒',
  },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { store } = useStore();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (!selected) return;
    store.switchRole(selected);
    onLogin();
  };

  const selectedRole = roles.find(r => r.role === selected);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4 relative overflow-hidden">
      {/* Soft background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-amber-300/10 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-[380px] flex flex-col gap-5">

        {/* ── Brand ── */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img src={logoImg} alt="Pure Krishi" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Pure<span className="text-emerald-300">Krishi</span>
            </h1>
            <p className="text-emerald-200/80 text-sm mt-0.5">Pure Food. Healthy Lives.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="text-[11px] text-amber-200 font-semibold tracking-wider uppercase">AI-Powered Agritech</span>
          </div>
        </div>

        {/* ── Login Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-r from-[#104D35] to-[#1a7a4c] px-6 py-4">
            <h2 className="text-white font-bold text-base">Login / Sign Up</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Select your role to continue</p>
          </div>

          {/* Role cards */}
          <div className="p-4 flex flex-col gap-2.5">
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = selected === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setSelected(r.role)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    isActive
                      ? `border-transparent ring-2 ${r.ring} bg-gradient-to-r ${r.gradient} shadow-lg scale-[1.02]`
                      : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  {/* Emoji avatar */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
                    isActive ? 'bg-white/20' : 'bg-white border border-gray-100 shadow-sm'
                  }`}>
                    {r.avatar}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm leading-none ${isActive ? 'text-white' : 'text-gray-800'}`}>
                      {r.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 leading-snug ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {r.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-gray-300'
                  }`} />
                </button>
              );
            })}

            {/* Divider */}
            <div className="flex items-center gap-2 my-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-medium">or sign up below</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* CTA Button */}
            <button
              onClick={handleLogin}
              disabled={!selected}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                selected
                  ? `bg-gradient-to-r ${selectedRole?.gradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selected ? (
                <>
                  <span>Continue as {selectedRole?.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                'Select a role to continue'
              )}
            </button>

            <p className="text-center text-[11px] text-gray-400">
              Don't have an account?{' '}
              <button onClick={handleLogin} className="text-[#176B45] font-bold hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-emerald-300/50 text-[10px]">
          PURE KRISHI • Demand-First Agritech • Zero Chemical Residue
        </p>
      </div>
    </div>
  );
};
