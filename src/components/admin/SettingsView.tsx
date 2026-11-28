import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { centralBackendUrl, isSupabaseConfigured } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const { state } = useStore();
  const [form, setForm] = useState(state.platformSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    centralApi.adminUpdateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
          Platform Settings & Governance Controls
        </h1>
        <p className="text-xs text-[#66736A] mt-1">
          Configure delivery fee thresholds, inventory alert rules, approval gates, and inspect active database/backend connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5 text-xs">
          <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#176B45]" /> Marketplace & Inventory Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                min={0}
                value={form.deliveryFee}
                onChange={e => setForm({ ...form, deliveryFee: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                min={0}
                value={form.freeDeliveryAbove}
                onChange={e => setForm({ ...form, freeDeliveryAbove: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                min={1}
                value={form.lowStockThresholdKg}
                onChange={e => setForm({ ...form, lowStockThresholdKg: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#17231C] block">Require Admin Approval for Farmer Product Submissions</span>
                <span className="text-[11px] text-[#66736A]">Farmers cannot directly publish or alter customer-facing prices.</span>
              </div>
              <input
                type="checkbox"
                checked={form.requireAdminApprovalForProducts}
                onChange={e => setForm({ ...form, requireAdminApprovalForProducts: e.target.checked })}
                className="w-4 h-4 text-[#176B45]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#17231C] block">Require Admin Approval for Stock Updates</span>
                <span className="text-[11px] text-[#66736A]">Farmer harvest additions enter approval queue before updating live stock.</span>
              </div>
              <input
                type="checkbox"
                checked={form.requireAdminApprovalForStock}
                onChange={e => setForm({ ...form, requireAdminApprovalForStock: e.target.checked })}
                className="w-4 h-4 text-[#176B45]"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings saved & audited!
              </span>
            ) : (
              <span />
            )}
            <button type="submit" className="px-5 py-2.5 bg-[#176B45] hover:bg-[#104D35] text-white font-bold rounded-xl flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>

        <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#176B45]" /> System Architecture Status
          </h3>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-[#FAF8F0] flex justify-between">
              <span>Supabase PostgreSQL:</span>
              <strong className={isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                {isSupabaseConfigured ? 'CONNECTED' : 'OFFLINE-FIRST'}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F0] flex justify-between">
              <span>Central Backend API:</span>
              <strong className={centralBackendUrl ? 'text-emerald-700' : 'text-slate-600'}>
                {centralBackendUrl ? 'CONFIGURED' : 'DIRECT/LOCAL'}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F0] flex justify-between">
              <span>RLS & Role Guards:</span>
              <strong className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ENFORCED
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
