import React, { useState } from 'react';
import { ShoppingBag, Mail, Phone, Loader2, CheckCircle } from 'lucide-react';

interface CustomerLoginProps {
  onLogin: (name: string, email: string) => void;
}

export default function CustomerLogin({ onLogin }: CustomerLoginProps) {
  const [mode, setMode] = useState<'choice' | 'email' | 'phone' | 'otp'>('choice');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit number'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setMode('otp'); }, 1000);
  };

  const verifyOtp = () => {
    if (otp !== '123456') { setError('Invalid OTP. Use 123456 for demo.'); return; }
    onLogin(name || 'Customer', phone);
  };

  const emailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) { setError('Fill all fields'); return; }
    onLogin(name, email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4 shadow-xl">
            <ShoppingBag size={40} className="text-emerald-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Pure Krishi</h1>
          <p className="text-emerald-300 mt-1 text-sm">Customer Marketplace</p>
          <div className="mt-2 inline-block bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs px-3 py-1 rounded-full">
            🛒 Fresh Farm-to-Fork Produce
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          {mode === 'choice' && (
            <>
              <h2 className="text-white font-semibold text-lg mb-4">Login / Sign Up</h2>
              <div className="space-y-3">
                <button onClick={() => setMode('email')}
                  className="w-full flex items-center gap-3 bg-white/10 border border-white/20 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition text-sm font-medium">
                  <Mail size={18} className="text-emerald-300" /> Continue with Email
                </button>
                <button onClick={() => setMode('phone')}
                  className="w-full flex items-center gap-3 bg-white/10 border border-white/20 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition text-sm font-medium">
                  <Phone size={18} className="text-emerald-300" /> Continue with Phone / OTP
                </button>
                <button onClick={() => onLogin('Google User', 'google@gmail.com')}
                  className="w-full flex items-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-100 transition text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                  </svg>
                  Continue with Google
                </button>
                <p className="text-center text-emerald-300/60 text-xs mt-2">Don't have an account? <span className="underline cursor-pointer text-emerald-300">Sign Up Free</span></p>
              </div>
            </>
          )}

          {mode === 'email' && (
            <>
              <h2 className="text-white font-semibold mb-4">Email Login</h2>
              <form onSubmit={emailLogin} className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                {error && <p className="text-red-300 text-xs">{error}</p>}
                <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold">Continue →</button>
                <button type="button" onClick={() => setMode('choice')} className="w-full text-emerald-300 text-sm text-center">← Back</button>
              </form>
            </>
          )}

          {mode === 'phone' && (
            <>
              <h2 className="text-white font-semibold mb-4">Phone Login</h2>
              <div className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <div className="flex border border-white/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400">
                  <span className="px-3 py-2.5 bg-white/10 text-emerald-300 text-sm border-r border-white/20">+91</span>
                  <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="flex-1 bg-transparent text-white placeholder-white/40 px-3 py-2.5 text-sm focus:outline-none" />
                </div>
                {error && <p className="text-red-300 text-xs">{error}</p>}
                <button onClick={sendOtp} disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Phone size={18} />}
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <button onClick={() => setMode('choice')} className="w-full text-emerald-300 text-sm text-center">← Back</button>
              </div>
            </>
          )}

          {mode === 'otp' && (
            <>
              <h2 className="text-white font-semibold mb-4">Enter OTP</h2>
              <div className="space-y-3">
                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 px-4 py-3 text-xl text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <p className="text-emerald-400 text-xs text-center">Demo OTP: 123456</p>
                {error && <p className="text-red-300 text-xs">{error}</p>}
                <button onClick={verifyOtp}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Verify & Enter
                </button>
              </div>
            </>
          )}
        </div>
        <p className="text-center text-emerald-400/50 text-xs mt-6">PURE KRISHI · Zero Chemical Residue · Farm to Fork</p>
      </div>
    </div>
  );
}
