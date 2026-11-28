import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { RequireRole } from '../lib/guards';
import { useAuth } from '../lib/auth';
import { Header } from '../components/common/Header';
import { FarmerPortal } from '../components/farmer/FarmerPortal';
import { AIAssistantModal } from '../components/ai/AIAssistantModal';
import logoImg from '../assets/logo.jpg';

const FarmerAuthScreen: React.FC = () => {
  const { loginWithEmailPassword, registerPublicAccount, loginWithOtpDemoOrSupabase } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'phone'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [totalAcres, setTotalAcres] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmailPassword(email, password, 'farmer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerPublicAccount({
        name,
        email,
        password,
        phone,
        role: 'farmer',
        village,
        district,
        state: stateName,
        totalAcres,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP. Use 123456 in demo mode.');
      return;
    }
    setLoading(true);
    try {
      await loginWithOtpDemoOrSupabase({ phone, name: name || 'Partner Farmer', role: 'farmer' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#1a7a4c] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Pure Krishi" className="w-11 h-11 rounded-2xl object-cover border border-white/25" />
            <div>
              <h1 className="text-lg font-extrabold">Pure Krishi Farmer Portal</h1>
              <p className="text-[11px] text-amber-100">Grow • Submit Products • Earn Direct</p>
            </div>
          </div>
          <Link to="/" className="p-2 rounded-xl bg-white/15 hover:bg-white/25" title="Back">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold ${mode === 'login' ? 'bg-white shadow text-amber-700' : 'text-gray-600'}`}
            >
              Farmer Login
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold ${mode === 'register' ? 'bg-white shadow text-amber-700' : 'text-gray-600'}`}
            >
              Register Farm
            </button>
            <button
              onClick={() => { setMode('phone'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold ${mode === 'phone' ? 'bg-white shadow text-amber-700' : 'text-gray-600'}`}
            >
              Phone OTP
            </button>
          </div>

          {error && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold">{error}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Registered Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ramesh.patil@krishimail.in"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Password *</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{loading ? 'Signing in...' : 'Sign In as Farmer'}</span>
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Farmer Full Name *" className="rounded-xl border border-gray-200 px-3 py-2" />
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone *" className="rounded-xl border border-gray-200 px-3 py-2" />
              </div>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address *" className="w-full rounded-xl border border-gray-200 px-3 py-2" />
              <input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars) *" className="w-full rounded-xl border border-gray-200 px-3 py-2" />
              <div className="grid grid-cols-3 gap-2">
                <input required value={village} onChange={e => setVillage(e.target.value)} placeholder="Village *" className="rounded-xl border border-gray-200 px-3 py-2" />
                <input required value={district} onChange={e => setDistrict(e.target.value)} placeholder="District *" className="rounded-xl border border-gray-200 px-3 py-2" />
                <input type="number" min={0.5} step={0.5} value={totalAcres} onChange={e => setTotalAcres(Number(e.target.value))} placeholder="Acres" className="rounded-xl border border-gray-200 px-3 py-2" />
              </div>
              <input value={stateName} onChange={e => setStateName(e.target.value)} placeholder="State" className="w-full rounded-xl border border-gray-200 px-3 py-2" />
              <button disabled={loading} type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Registering...' : 'Register Farmer Account'}</span>
              </button>
            </form>
          )}

          {mode === 'phone' && (
            <form onSubmit={handleOtp} className="space-y-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full rounded-xl border border-gray-200 px-3 py-2.5" />
              <input
                required
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit Mobile Number"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              />
              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => {
                    if (phone.length < 10) setError('Enter 10 digits');
                    else { setError(''); setOtpSent(true); }
                  }}
                  className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Send OTP
                </button>
              ) : (
                <>
                  <input
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter OTP (Demo: 123456)"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-center font-mono tracking-widest"
                  />
                  <button disabled={loading} type="submit" className="w-full py-3 bg-[#176B45] text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Verify & Enter Farmer Portal
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FarmerApp: React.FC = () => {
  const { logout } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiCropContext, setAiCropContext] = useState<{ cropName: string; growthStage: string } | undefined>(undefined);

  return (
    <RequireRole
      allowedRoles={['farmer']}
      portalName="Farmer Portal"
      fallbackLogin={<FarmerAuthScreen />}
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-[#17231C] flex flex-col">
        <Header onLogout={() => void logout()} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <FarmerPortal
            onOpenAI={ctx => {
              setAiCropContext(ctx);
              setIsAIOpen(true);
            }}
          />
        </main>
        <AIAssistantModal
          isOpen={isAIOpen}
          onClose={() => { setIsAIOpen(false); setAiCropContext(undefined); }}
          initialContext={aiCropContext}
        />
      </div>
    </RequireRole>
  );
};
