import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Sparkles, ArrowRight, ShieldCheck, Tractor, ShoppingBag, Eye, EyeOff, Phone, KeyRound, LogIn } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { UserRole } from '../../types';
import logoImg from '../../assets/logo.jpg';

interface LoginScreenProps {
  onLogin: () => void;
}

// ── Admin credentials ──────────────────────────────────
const ADMIN_USERNAME = 'veerabhadrappa';
const ADMIN_PASSWORD = '123456789';

// ── OTP mock ───────────────────────────────────────────
const MOCK_OTP = '123456';

const roles = [
  {
    role: 'super_admin' as UserRole,
    label: 'Admin',
    description: 'Full system control, finance & reporting',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-300',
    avatar: '👨‍💼',
    requiresPassword: true,
  },
  {
    role: 'farmer' as UserRole,
    label: 'Farmer',
    description: 'Manage crops, harvests & earnings',
    icon: Tractor,
    gradient: 'from-amber-400 to-orange-500',
    ring: 'ring-amber-300',
    avatar: '🧑‍🌾',
    requiresPassword: false,
  },
  {
    role: 'customer' as UserRole,
    label: 'Customer',
    description: 'Shop fresh farm-to-fork produce',
    icon: ShoppingBag,
    gradient: 'from-sky-400 to-blue-600',
    ring: 'ring-sky-300',
    avatar: '🛒',
    requiresPassword: false,
  },
];

type LoginMode = 'role' | 'admin_pass' | 'otp_phone' | 'otp_verify';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { store } = useStore();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<LoginMode>('role');

  // Admin password
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Phone / OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (otpCountdown > 0) {
      timerRef.current = setInterval(() => setOtpCountdown(c => c - 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [otpCountdown]);

  const handleRoleSelect = (role: UserRole) => {
    setSelected(role);
    if (role === 'super_admin') {
      setMode('admin_pass');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    store.switchRole(role);
    onLogin();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim().toLowerCase() === ADMIN_USERNAME && adminPass === ADMIN_PASSWORD) {
      store.switchRole('super_admin');
      onLogin();
    } else {
      setAdminError('Incorrect username or password. Try: veerabhadrappa / 123456789');
    }
  };

  const handleSendOTP = () => {
    if (phone.length < 10) { setOtpError('Enter a valid 10-digit phone number'); return; }
    setOtpError('');
    setOtpSent(true);
    setOtpCountdown(30);
    setMode('otp_verify');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === MOCK_OTP) {
      store.switchRole(selected || 'customer');
      onLogin();
    } else {
      setOtpError(`Invalid OTP. (Demo OTP: ${MOCK_OTP})`);
    }
  };

  const selectedRole = roles.find(r => r.role === selected);

  // ── Admin Password Screen ──────────────────────────────
  if (mode === 'admin_pass') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4 relative overflow-hidden">
        <Blobs />
        <div className="relative w-full max-w-[380px] flex flex-col gap-5">
          <BrandHeader />
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#104D35] to-[#1a7a4c] px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Admin Login</h2>
                <p className="text-emerald-200 text-xs">Secure access — credentials required</p>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  autoFocus
                  value={adminUser}
                  onChange={e => { setAdminUser(e.target.value); setAdminError(''); }}
                  placeholder="Admin username"
                  className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={e => { setAdminPass(e.target.value); setAdminError(''); }}
                    placeholder="Admin password"
                    className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {adminError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{adminError}</div>
              )}
              <div className="bg-[#FAF8F0] border border-[#176B45]/15 rounded-xl p-3 text-[11px] text-gray-500 space-y-0.5">
                <p className="font-semibold text-[#176B45]">Demo Admin Credentials:</p>
                <p>Username: <strong className="text-gray-700">veerabhadrappa</strong></p>
                <p>Password: <strong className="text-gray-700">123456789</strong></p>
              </div>
              <button type="submit"
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Login as Admin
              </button>
              <button type="button" onClick={() => { setMode('role'); setSelected(null); setAdminError(''); }}
                className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
                ← Back to role selection
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── OTP Verify Screen ─────────────────────────────────
  if (mode === 'otp_verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4 relative overflow-hidden">
        <Blobs />
        <div className="relative w-full max-w-[380px] flex flex-col gap-5">
          <BrandHeader />
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#104D35] to-[#1a7a4c] px-6 py-4">
              <h2 className="text-white font-bold text-sm">Verify OTP</h2>
              <p className="text-emerald-200 text-xs mt-0.5">OTP sent to +91 {phone}</p>
            </div>
            <form onSubmit={handleVerifyOTP} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Enter 6-digit OTP</label>
                <input type="text" inputMode="numeric" maxLength={6} autoFocus
                  value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                  placeholder="• • • • • •"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] rounded-xl border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#176B45]" />
              </div>
              {otpError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{otpError}</div>}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
                Demo OTP: <strong>123456</strong>
              </div>
              <button type="submit"
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4" /> Verify & Login
              </button>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <button type="button" onClick={() => { setMode('otp_phone'); setOtp(''); setOtpSent(false); }}
                  className="hover:text-gray-700">← Change number</button>
                {otpCountdown > 0
                  ? <span className="text-gray-400">Resend in {otpCountdown}s</span>
                  : <button type="button" onClick={handleSendOTP} className="text-[#176B45] font-bold hover:underline">Resend OTP</button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Phone OTP Entry Screen ────────────────────────────
  if (mode === 'otp_phone') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4 relative overflow-hidden">
        <Blobs />
        <div className="relative w-full max-w-[380px] flex flex-col gap-5">
          <BrandHeader />
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#104D35] to-[#1a7a4c] px-6 py-4">
              <h2 className="text-white font-bold text-sm">Login with Phone / OTP</h2>
              <p className="text-emerald-200 text-xs mt-0.5">We'll send a one-time password to your number</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">+91</span>
                  <input type="tel" inputMode="numeric" maxLength={10}
                    value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                    placeholder="98765 43210" autoFocus
                    className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B45]" />
                </div>
                {otpError && <p className="text-xs text-red-600 mt-1">{otpError}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
                <div className="flex gap-2">
                  {roles.filter(r => r.role !== 'super_admin').map(r => (
                    <button key={r.role} type="button" onClick={() => setSelected(r.role)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selected === r.role ? 'bg-[#176B45] text-white border-[#176B45]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                      {r.avatar} {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSendOTP}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Send OTP
              </button>
              <button onClick={() => setMode('role')} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">← Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Role Selection Screen ────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4 relative overflow-hidden">
      <Blobs />
      <div className="relative w-full max-w-[380px] flex flex-col gap-5">
        <BrandHeader />

        {/* ── Login Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#104D35] to-[#1a7a4c] px-6 py-4">
            <h2 className="text-white font-bold text-base">Login / Sign Up</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Select your role to continue</p>
          </div>

          <div className="p-4 flex flex-col gap-2.5">
            {/* Role cards */}
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = selected === r.role;
              return (
                <button key={r.role} onClick={() => handleRoleSelect(r.role)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    isActive
                      ? `border-transparent ring-2 ${r.ring} bg-gradient-to-r ${r.gradient} shadow-lg scale-[1.02]`
                      : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm ${isActive ? 'bg-white/20' : 'bg-white border border-gray-100'}`}>
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm leading-none ${isActive ? 'text-white' : 'text-gray-800'}`}>{r.label}</p>
                    <p className={`text-[11px] mt-0.5 leading-snug ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{r.description}</p>
                  </div>
                  {r.requiresPassword && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                      🔒 SECURE
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                </button>
              );
            })}

            {/* Quick access for non-admin roles */}
            {selected && selected !== 'super_admin' && (
              <button onClick={() => handleQuickLogin(selected)}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r ${selectedRole?.gradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}>
                <span>Continue as {selectedRole?.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Divider */}
            <div className="flex items-center gap-2 my-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-medium">or login with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social / Alt logins */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelected('customer'); handleQuickLogin('customer'); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-xs hover:shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <button
                onClick={() => { setSelected('customer'); setMode('otp_phone'); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-xs hover:shadow-sm"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Phone / OTP
              </button>
            </div>

            <p className="text-center text-[11px] text-gray-400">
              Don't have an account?{' '}
              <button onClick={() => handleQuickLogin('customer')} className="text-[#176B45] font-bold hover:underline">
                Sign Up Free
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-emerald-300/50 text-[10px]">
          PURE KRISHI • Demand-First Agritech • Zero Chemical Residue
        </p>
      </div>
    </div>
  );
};

// ── Shared sub-components ───────────────────────────────
const Blobs = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-amber-300/10 rounded-full blur-2xl" />
  </div>
);

const BrandHeader = () => (
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
);
