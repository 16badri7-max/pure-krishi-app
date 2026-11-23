import React, { useState } from 'react';
import { Sprout, Phone, Loader2, CheckCircle } from 'lucide-react';

interface FarmerLoginProps {
  onLogin: (name: string, phone: string) => void;
}

export default function FarmerLogin({ onLogin }: FarmerLoginProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1200);
  };

  const verifyOtp = () => {
    if (otp !== '123456') { setError('Invalid OTP. Use 123456 for demo.'); return; }
    setError('');
    setStep('name');
  };

  const finish = () => {
    if (!name.trim()) { setError('Enter your name'); return; }
    onLogin(name.trim(), phone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
      {/* BG decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4 shadow-xl">
            <Sprout size={40} className="text-green-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Pure Krishi</h1>
          <p className="text-green-300 mt-1 text-sm">Farmer Portal</p>
          <div className="mt-2 inline-block bg-green-500/20 border border-green-500/30 text-green-300 text-xs px-3 py-1 rounded-full">
            🌾 Grow. Sell. Earn.
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          {step === 'phone' && (
            <>
              <h2 className="text-white font-semibold text-lg mb-4">Login with Phone</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-green-200 text-sm font-medium block mb-1.5">Mobile Number</label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-400">
                    <span className="px-3 text-green-300 text-sm border-r border-white/20 py-3">+91</span>
                    <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="flex-1 bg-transparent text-white placeholder-white/40 px-3 py-3 text-sm focus:outline-none" />
                  </div>
                </div>
                {error && <p className="text-red-300 text-xs">{error}</p>}
                <button onClick={sendOtp} disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-400 hover:to-emerald-500 transition flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Phone size={18} />}
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="text-white font-semibold text-lg mb-1">Enter OTP</h2>
              <p className="text-green-300 text-xs mb-4">OTP sent to +91 {phone} · <span className="underline cursor-pointer" onClick={() => setStep('phone')}>Change</span></p>
              <div className="space-y-4">
                <div>
                  <label className="text-green-200 text-sm font-medium block mb-1.5">6-Digit OTP</label>
                  <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-xl font-mono" />
                  <p className="text-green-400 text-xs mt-1">Demo OTP: 123456</p>
                </div>
                {error && <p className="text-red-300 text-xs">{error}</p>}
                <button onClick={verifyOtp}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-400 hover:to-emerald-500 transition flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Verify OTP
                </button>
              </div>
            </>
          )}

          {step === 'name' && (
            <>
              <h2 className="text-white font-semibold text-lg mb-4">Your Name</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-green-200 text-sm font-medium block mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Raju Patil"
                    className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                {error && <p className="text-red-300 text-xs">{error}</p>}
                <button onClick={finish}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-400 hover:to-emerald-500 transition">
                  Enter Farmer Portal →
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-green-400/60 text-xs mt-6">PURE KRISHI · Farmer-First Agriculture</p>
      </div>
    </div>
  );
}
