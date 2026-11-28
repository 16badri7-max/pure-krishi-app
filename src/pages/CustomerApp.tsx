import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CustomerMarketplace } from '../components/marketplace/CustomerMarketplace';
import { useAuth } from '../lib/auth';
import { centralApi } from '../lib/centralApi';
import { Modal } from '../components/common/Modal';
import { useStore } from '../services/useStore';
import logoImg from '../assets/logo.jpg';

export const CustomerApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithEmailPassword, registerPublicAccount, loginWithOtpDemoOrSupabase, logout } = useAuth();
  const { state, store } = useStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'phone'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync approved products from Central API / Supabase on load
  useEffect(() => {
    void centralApi.getApprovedCatalogue().catch(() => {});
  }, []);

  // Ensure Customer app operates strictly in customer scope when unauthenticated or browsing
  useEffect(() => {
    if (!isAuthenticated && state.currentUser.role !== 'customer') {
      store.switchRole('customer');
    }
  }, [isAuthenticated, state.currentUser.role, store]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmailPassword(email, password, 'customer');
      setAuthModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerPublicAccount({ name, email, password, phone, role: 'customer' });
      setAuthModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP. Use 123456 in demo mode.');
      return;
    }
    setLoading(true);
    try {
      await loginWithOtpDemoOrSupabase({ phone, name: name || 'Customer', role: 'customer' });
      setAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F0] text-[#17231C] flex flex-col">
      {/* Dedicated Customer Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#104D35] via-[#176B45] to-[#104D35] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20" title="Ecosystem Home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/30">
              <img src={logoImg} alt="Pure Krishi" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-extrabold text-base leading-none">PURE KRISHI</div>
              <div className="text-[10px] text-emerald-200 font-medium">Customer Organic Marketplace</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{cartCount} in cart</span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold hidden sm:inline">Hi, {user.name}</span>
                {(user.role === 'super_admin' || user.role === 'operations_admin') && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-2.5 py-1.5 bg-amber-400 text-stone-900 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </button>
                )}
                <button
                  onClick={() => void logout()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-white text-[#104D35] hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CustomerMarketplace />
      </main>

      <Modal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title="Customer Account Sign In / Registration"
        subtitle="Sign in to track orders, save delivery addresses, and checkout seamlessly."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold ${mode === 'login' ? 'bg-white shadow text-[#104D35]' : 'text-gray-600'}`}
            >
              Email Login
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold ${mode === 'register' ? 'bg-white shadow text-[#104D35]' : 'text-gray-600'}`}
            >
              Sign Up Free
            </button>
            <button
              onClick={() => { setMode('phone'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold ${mode === 'phone' ? 'bg-white shadow text-[#104D35]' : 'text-gray-600'}`}
            >
              Phone OTP
            </button>
          </div>

          {error && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold">{error}</div>}

          {mode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Customer Email"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              />
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              />
              <button disabled={loading} type="submit" className="w-full py-2.5 bg-[#176B45] text-white font-bold rounded-xl">
                {loading ? 'Signing in...' : 'Sign In as Customer'}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full rounded-xl border border-gray-200 px-3 py-2.5" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full rounded-xl border border-gray-200 px-3 py-2.5" />
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile Number" className="w-full rounded-xl border border-gray-200 px-3 py-2.5" />
              <input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create Password (min 6 chars)" className="w-full rounded-xl border border-gray-200 px-3 py-2.5" />
              <button disabled={loading} type="submit" className="w-full py-2.5 bg-[#176B45] text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Create Customer Account
              </button>
            </form>
          )}

          {mode === 'phone' && (
            <form onSubmit={handleOtpVerify} className="space-y-3">
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
                  className="w-full py-2.5 bg-[#176B45] text-white font-bold rounded-xl"
                >
                  Send OTP
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
                  <button disabled={loading} type="submit" className="w-full py-2.5 bg-[#176B45] text-white font-bold rounded-xl">
                    Verify & Continue
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
