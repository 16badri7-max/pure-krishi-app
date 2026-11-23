import React from 'react';
import { PageHeader, StatCard } from './shared';
import { CheckCircle2, XCircle, Eye, Clock } from 'lucide-react';

const submissions = [
  { id: 'SUB-001', farmer: 'Ramesh Patil', product: 'Organic Pomegranate', category: 'Fruits', qty: '800kg', price: '₹85/kg', desc: 'Premium organic pomegranates from Nashik farm. Zero chemicals.', submitted: '2h ago', type: 'New Product' },
  { id: 'SUB-002', farmer: 'Suresh Kumar', product: 'Desi Tomatoes', category: 'Vegetables', qty: '1200kg', price: '₹52/kg → ₹58/kg', desc: 'Price change request due to higher cultivation costs this season.', submitted: '5h ago', type: 'Price Change' },
  { id: 'SUB-003', farmer: 'Lakshmi Devi', product: 'Fresh Spinach', category: 'Vegetables', qty: '+400kg', price: '₹28/kg', desc: 'Stock update — additional 400kg from second harvest.', submitted: '1d ago', type: 'Stock Update' },
  { id: 'SUB-004', farmer: 'Dinesh Rao', product: 'Organic Groundnuts', category: 'Pulses', qty: '200kg', price: '₹120/kg', desc: 'First submission from new farm registration in Raichur.', submitted: '2d ago', type: 'New Product' },
];

const typeColor: Record<string, string> = {
  'New Product': 'bg-purple-100 text-purple-700',
  'Price Change': 'bg-orange-100 text-orange-700',
  'Stock Update': 'bg-blue-100 text-blue-700',
};

export const ProductApproval: React.FC = () => (
  <div className="space-y-5">
    <PageHeader title="Product Approval" subtitle="Review and approve farmer submissions before they go live" icon="✅" color="from-emerald-500 to-green-700" />

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Pending Review" value="12" sub="Requires action" />
      <StatCard label="Approved This Week" value="34" />
      <StatCard label="Rejected This Week" value="8" />
      <StatCard label="Auto-Approved" value="0" sub="Always manual" />
    </div>

    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
      <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <div className="font-bold text-amber-800 text-sm">Admin Approval Required</div>
        <div className="text-amber-700 text-xs mt-0.5">Only Admin can approve products for the live customer catalogue. Farmers submit — Admin reviews — approved products become visible to customers.</div>
      </div>
    </div>

    <div className="space-y-4">
      {submissions.map(s => (
        <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-start gap-4 p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 font-black text-emerald-700 text-sm">
              {s.farmer[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-800 text-sm">{s.product}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor[s.type]}`}>{s.type}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">by {s.farmer} · {s.submitted} · {s.id}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-700 text-sm">{s.price}</div>
                  <div className="text-slate-500 text-[11px]">{s.qty}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded-xl p-3 leading-relaxed">{s.desc}</p>
              <div className="flex items-center gap-2 mt-3">
                <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                </button>
                <button className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
