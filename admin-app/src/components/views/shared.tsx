// Shared view template helper
import React from 'react';
export const PageHeader: React.FC<{ title: string; subtitle: string; icon: string; color: string }> = ({ title, subtitle, icon, color }) => (
  <div className={`flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}>
    <span className="text-3xl">{icon}</span>
    <div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="text-white/80 text-sm">{subtitle}</p>
    </div>
  </div>
);
export const StatCard: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
    <div className="text-2xl font-black text-slate-800">{value}</div>
    <div className="text-xs font-bold text-slate-500 mt-0.5">{label}</div>
    {sub && <div className="text-[11px] text-emerald-600 font-semibold mt-1">{sub}</div>}
  </div>
);
