import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tractor, ShieldCheck, ArrowRight, Sparkles, Lock, Leaf } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { useAuth } from '../lib/auth';

export const LandingPage: React.FC = () => {
  const { authMode } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b3524] via-[#104D35] to-[#176B45] text-white flex flex-col justify-between p-4 sm:p-8">
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/25 shadow-lg">
            <img src={logoImg} alt="Pure Krishi" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">PURE KRISHI</h1>
            <p className="text-[11px] text-emerald-200/80">Connected Agricultural Marketplace Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-white/10 border border-white/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            {authMode === 'supabase' ? 'Supabase Connected' : authMode === 'backend' ? 'Central API Live' : 'Offline-First Sync'}
          </span>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto my-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Three Independent Portals • One Central Database</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight">
            Farm-to-Fork Organic Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/80">
            Choose your Pure Krishi application portal. Each interface operates independently through our central backend and authorized PostgreSQL database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Application */}
          <Link
            to="/customer"
            className="group bg-white text-[#17231C] rounded-3xl p-6 shadow-2xl border border-emerald-200/40 hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#176B45] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B45]">Public Storefront</span>
                <h3 className="text-xl font-extrabold mt-0.5">Customer Application</h3>
              </div>
              <p className="text-xs text-[#66736A] leading-relaxed">
                Explore the 3D organic showcase, browse Admin-approved produce, trace farm batches, place orders, and track live delivery.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-bold text-[#176B45]">
              <span>Enter Customer Store (/customer)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Farmer Application */}
          <Link
            to="/farmer"
            className="group bg-white text-[#17231C] rounded-3xl p-6 shadow-2xl border border-amber-200/40 hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Grower Operations</span>
                <h3 className="text-xl font-extrabold mt-0.5">Farmer Application</h3>
              </div>
              <p className="text-xs text-[#66736A] leading-relaxed">
                Register farms, submit agricultural products & harvest stock for Admin approval, monitor fulfilment orders, earnings, and AI agronomy tools.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-bold text-amber-700">
              <span>Open Farmer Portal (/farmer)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Admin Application */}
          <Link
            to="/admin"
            className="group bg-[#082519] text-white rounded-3xl p-6 shadow-2xl border border-emerald-400/30 hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> RESTRICTED
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Central Authority</span>
                <h3 className="text-xl font-extrabold mt-0.5">Admin Application</h3>
              </div>
              <p className="text-xs text-emerald-100/75 leading-relaxed">
                Central governance over live product publishing, pricing, farmer approvals, inventory, customer orders, warehouses, analytics, and audit logs.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-emerald-300">
              <span>Admin Sign-In (/admin)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link
            to="/portal"
            className="inline-flex items-center gap-2 text-xs text-emerald-200/80 hover:text-white underline"
          >
            Access Internal B2B / Warehouse / Expert / Delivery Role Portal (/portal)
          </Link>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto text-center text-[11px] text-emerald-200/60">
        PURE KRISHI • Zero Chemical Residue Certified • Strict RBAC & Supabase Row Level Security
      </footer>
    </div>
  );
};
