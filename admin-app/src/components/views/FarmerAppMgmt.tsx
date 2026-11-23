import React from 'react';
import { Sprout, Eye, Users, MapPin, Wheat, Package, CheckCircle2, XCircle, AlertCircle, TrendingUp, Activity } from 'lucide-react';

const farmers = [
  { id: 'F001', name: 'Ramesh Patil', location: 'Nashik, MH', farms: 3, crops: 8, submissions: 12, approved: 10, revenue: '₹2.4L', status: 'active', joined: '2024-01-15' },
  { id: 'F002', name: 'Suresh Kumar', location: 'Hassan, KA', farms: 2, crops: 5, submissions: 7, approved: 6, revenue: '₹1.8L', status: 'active', joined: '2024-02-20' },
  { id: 'F003', name: 'Lakshmi Devi', location: 'Guntur, AP', farms: 4, crops: 12, submissions: 18, approved: 15, revenue: '₹3.1L', status: 'active', joined: '2024-01-08' },
  { id: 'F004', name: 'Dinesh Rao', location: 'Raichur, KA', farms: 1, crops: 3, submissions: 3, approved: 2, revenue: '₹0.6L', status: 'pending', joined: '2024-11-01' },
  { id: 'F005', name: 'Meena Nair', location: 'Thrissur, KL', farms: 2, crops: 6, submissions: 9, approved: 9, revenue: '₹1.4L', status: 'active', joined: '2024-03-12' },
  { id: 'F006', name: 'Govind Sharma', location: 'Jaipur, RJ', farms: 5, crops: 15, submissions: 22, approved: 18, revenue: '₹4.2L', status: 'suspended', joined: '2023-12-01' },
];

const recentSubmissions = [
  { farmer: 'Ramesh Patil', product: 'Organic Pomegranate', qty: '800kg', price: '₹85/kg', status: 'pending', date: '2h ago' },
  { farmer: 'Lakshmi Devi', product: 'Fresh Spinach', qty: '400kg', price: '₹28/kg', status: 'approved', date: '1d ago' },
  { farmer: 'Suresh Kumar', product: 'Desi Tomatoes', qty: '1200kg', price: '₹52/kg', status: 'pending', date: '5h ago' },
  { farmer: 'Meena Nair', product: 'Raw Coconut Oil', qty: '200L', price: '₹180/L', status: 'approved', date: '2d ago' },
];

const statusClr: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
  approved: 'bg-green-100 text-green-700',
};

export const FarmerAppMgmt: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center">
        <Sprout className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-800">Farmer Application Management</h2>
        <p className="text-slate-500 text-sm">Monitor and manage the Pure Krishi Farmer Application</p>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { label: 'Total Farmers', value: '1,247', icon: Users, c: 'bg-amber-500' },
        { label: 'Active Farms', value: '3,420', icon: MapPin, c: 'bg-green-500' },
        { label: 'Active Crops', value: '8,640', icon: Wheat, c: 'bg-lime-500' },
        { label: 'Submissions', value: '284', icon: Package, c: 'bg-blue-500' },
        { label: 'Pending Review', value: '12', icon: AlertCircle, c: 'bg-orange-500' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
          <div className={`w-9 h-9 ${s.c} rounded-xl flex items-center justify-center shrink-0`}>
            <s.icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-black text-slate-800 text-lg leading-none">{s.value}</div>
            <div className="text-slate-500 text-[11px] font-medium">{s.label}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Farmers Table */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Registered Farmers</h3>
        <input placeholder="Search farmers..." className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 w-48" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3 text-left font-bold">Farmer</th>
              <th className="px-5 py-3 text-left font-bold">Location</th>
              <th className="px-4 py-3 text-center font-bold">Farms</th>
              <th className="px-4 py-3 text-center font-bold">Submissions</th>
              <th className="px-4 py-3 text-center font-bold">Approved</th>
              <th className="px-4 py-3 text-center font-bold">Revenue</th>
              <th className="px-4 py-3 text-center font-bold">Status</th>
              <th className="px-4 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {farmers.map(f => (
              <tr key={f.id} className="hover:bg-amber-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-xs shrink-0">
                      {f.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{f.name}</div>
                      <div className="text-slate-400 text-[10px]">{f.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{f.location}</td>
                <td className="px-4 py-3.5 text-center font-bold text-slate-700">{f.farms}</td>
                <td className="px-4 py-3.5 text-center font-bold text-slate-700">{f.submissions}</td>
                <td className="px-4 py-3.5 text-center font-bold text-green-600">{f.approved}</td>
                <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{f.revenue}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClr[f.status]}`}>{f.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Eye className="w-3.5 h-3.5" /></button>
                    {f.status === 'active' ? (
                      <button className="px-2 py-0.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[10px] font-bold">Suspend</button>
                    ) : f.status === 'suspended' ? (
                      <button className="px-2 py-0.5 bg-green-50 text-green-600 hover:bg-green-100 rounded text-[10px] font-bold">Reactivate</button>
                    ) : (
                      <button className="px-2 py-0.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-[10px] font-bold">Approve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Recent Submissions */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Recent Farmer Submissions</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {recentSubmissions.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-800">{s.product}</div>
              <div className="text-[11px] text-slate-500">by {s.farmer} · {s.qty} @ {s.price} · {s.date}</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusClr[s.status]}`}>{s.status}</span>
            {s.status === 'pending' && (
              <div className="flex gap-1.5 shrink-0">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                  <CheckCircle2 className="w-3 h-3" /> Approve
                </button>
                <button className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                  <XCircle className="w-3 h-3" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
