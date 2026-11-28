import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Sparkles, ArrowRight, ShieldCheck, Tractor, ShoppingBag, Eye, EyeOff, Phone, KeyRound, LogIn } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { UserRole } from '../../types';
import logoImg from '../../assets/logo.jpg';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

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
  const { authMode, hasProvisionedLocalAdmin, loginWithEmailPassword, provisionLocalAdminAccount, loginWithOtpDemoOrSupabase, switchDemoPortalRole } = useAuth();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<LoginMode>('role');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
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
    if (role === 'super_admin' || role === 'operations_admin') {
      setMode('admin_pass');
      return;
    }
    switchDemoPortalRole(role);
    onLogin(role);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);
    try {
      const profile =
        authMode === 'offline' && !hasProvisionedLocalAdmin
          ? await provisionLocalAdminAccount({ email: adminEmail, name: adminName, password: adminPass })
          : await loginWithEmailPassword(adminEmail, adminPass, 'admin');
      onLogin(profile.role);
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = () => {
    if (phone.length < 10) { setOtpError('Enter a valid 10-digit phone number'); return; }
    setOtpError('');
    setOtpCountdown(30);
    setMode('otp_verify');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === MOCK_OTP) {
      const targetRole: 'customer' | 'farmer' = selected === 'farmer' ? 'farmer' : 'customer';
      await loginWithOtpDemoOrSupabase({ phone, role: targetRole });
      onLogin(targetRole);
    } else {
      setOtpError(`Invalid OTP. (Demo OTP: ${MOCK_OTP})`);
    }
  };

  const selectedRole = roles.find(r => r.role === selected);
  const isFirstOfflineProvision = authMode === 'offline' && !hasProvisionedLocalAdmin;

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
                <h2 className="text-white font-bold text-sm">
                  {isFirstOfflineProvision ? 'Provision Authorized Admin' : 'Admin Login'}
                </h2>
                <p className="text-emerald-200 text-xs">Secure access — authorized account required</p>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="p-5 space-y-4">
              {isFirstOfflineProvision && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Administrator Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    placeholder="Full name"
                    className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={adminEmail}
                  onChange={e => { setAdminEmail(e.target.value); setAdminError(''); }}
                  placeholder="admin@purekrishi.org"
                  className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Passphrase</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={adminPass}
                    onChange={e => { setAdminPass(e.target.value); setAdminError(''); }}
                    placeholder={isFirstOfflineProvision ? 'Min 8 characters' : 'Admin passphrase'}
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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Authenticating...' : isFirstOfflineProvision ? 'Provision & Enter Admin' : 'Login as Admin'}
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
                <button type="button" onClick={() => { setMode('otp_phone'); setOtp(''); }}
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4 relative overflow-hidden">
      <Blobs />
      <div className="relative w-full max-w-[380px] flex flex-col gap-5">
        <BrandHeader />
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#104D35] to-[#1a7a4c] px-6 py-4">
            <h2 className="text-white font-bold text-base">Login / Sign Up</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Select your portal to continue</p>
          </div>

          <div className="p-4 flex flex-col gap-2.5">
            {roles.map(r => {
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

            {selected && selected !== 'super_admin' && (
              <button onClick={() => handleQuickLogin(selected)}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r ${selectedRole?.gradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}>
                <span>Continue as {selectedRole?.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2 my-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-medium">or login with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelected('customer'); handleQuickLogin('customer'); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-xs hover:shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#176B45]" />
                Shop as Customer
              </button>
              <button
                onClick={() => { setSelected('customer'); setMode('otp_phone'); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-xs hover:shadow-sm"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Phone / OTP
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-emerald-300/50 text-[10px]">
          PURE KRISHI • Demand-First Agritech • Zero Chemical Residue
        </p>
      </div>
    </div>
  );
};

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
