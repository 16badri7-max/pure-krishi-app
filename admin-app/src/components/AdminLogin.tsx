import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Leaf } from 'lucide-react';
import type { AdminUser } from '../App';

const ADMIN_CREDENTIALS = [
  { username: 'veerabhadrappa', password: '123456789', name: 'Veerabhadrappa', role: 'Super Admin' },
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Admin' },
];

interface Props { onLogin: (user: AdminUser) => void; }

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const match = ADMIN_CREDENTIALS.find(c => c.username === username && c.password === password);
    if (match) {
      onLogin({ username: match.username, name: match.name, role: match.role });
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-2xl shadow-emerald-900/50 mb-4">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Pure Krishi</h1>
          <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mt-1">Admin Control Centre</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-bold text-lg">Secure Admin Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/40 mt-2"
            >
              {loading ? '🔐 Authenticating...' : '🔐 Sign In to Admin'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-400 text-[11px] font-semibold text-center">Demo: veerabhadrappa / 123456789</p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Pure Krishi Admin Application • Authorized Access Only
        </p>
      </div>
    </div>
  );
};
