import React from 'react'; import { PageHeader, StatCard } from './shared'; import { AlertTriangle } from 'lucide-react';
const items = [
  {name:'Organic Tomatoes',cat:'Vegetables',total:'2,400kg',avail:'1,200kg',reserved:'800kg',low:false},
  {name:'Fresh Spinach',cat:'Vegetables',total:'450kg',avail:'200kg',reserved:'150kg',low:true},
  {name:'Basmati Rice',cat:'Grains',total:'1,000kg',avail:'500kg',reserved:'200kg',low:false},
  {name:'Raw Honey',cat:'Specialty',total:'100kg',avail:'40kg',reserved:'30kg',low:true},
  {name:'Coconut Oil',cat:'Oils',total:'300L',avail:'200L',reserved:'80L',low:false},
];
export const InventoryManagement: React.FC = () => (
  <div className="space-y-5">
    <PageHeader title="Inventory Management" subtitle="Monitor all warehouse stock and availability" icon="📊" color="from-yellow-500 to-amber-600" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total SKUs" value="542" /><StatCard label="In Stock" value="498" /><StatCard label="Low Stock" value="28" sub="⚠️ Needs attention" /><StatCard label="Out of Stock" value="16" />
    </div>
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
      <div><div className="font-bold text-red-800 text-sm">28 products are running low on stock</div><div className="text-red-600 text-xs">Review and approve farmer stock submissions to replenish.</div></div>
    </div>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800">Stock Levels</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs"><thead><tr className="bg-slate-50 text-slate-500 uppercase text-[10px]"><th className="px-5 py-3 text-left font-bold">Product</th><th className="px-4 py-3 text-center font-bold">Total</th><th className="px-4 py-3 text-center font-bold">Available</th><th className="px-4 py-3 text-center font-bold">Reserved</th><th className="px-4 py-3 text-center font-bold">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-50">{items.map((p,i)=>(<tr key={i} className={`${p.low?'bg-red-50/50':''}`}><td className="px-5 py-3.5"><div className="font-bold text-slate-800">{p.name}</div><div className="text-slate-400 text-[10px]">{p.cat}</div></td><td className="px-4 py-3.5 text-center">{p.total}</td><td className="px-4 py-3.5 text-center font-bold text-emerald-700">{p.avail}</td><td className="px-4 py-3.5 text-center text-blue-600">{p.reserved}</td><td className="px-4 py-3.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.low?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{p.low?'Low Stock':'OK'}</span></td></tr>))}</tbody></table>
      </div>
    </div>
  </div>
);
