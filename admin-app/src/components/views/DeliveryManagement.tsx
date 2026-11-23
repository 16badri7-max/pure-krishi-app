import React from 'react'; import { PageHeader, StatCard } from './shared';
const deliveries = [{id:'DEL-801',order:'ORD-5892',customer:'Priya Sharma',driver:'Ajay Kumar',vehicle:'MH-04-AB-1234',dest:'Bandra West, Mumbai',eta:'Today 2:30 PM',status:'Out for Delivery'},{id:'DEL-800',order:'ORD-5890',customer:"Nature's Basket",driver:'Ravi Sharma',vehicle:'MH-02-CD-5678',dest:'Turbhe, Navi Mumbai',eta:'Today 11:00 AM',status:'Delivered'},{id:'DEL-799',order:'ORD-5889',customer:'Sunrise Hotel',driver:'Mohan Das',vehicle:'TN-07-EF-9012',dest:'Adyar, Chennai',eta:'Yesterday',status:'Delivered'}];
const sc: Record<string,string> = {'Out for Delivery':'bg-blue-100 text-blue-700','Delivered':'bg-green-100 text-green-700','Pending':'bg-amber-100 text-amber-700'};
export const DeliveryManagement: React.FC = () => (
  <div className="space-y-5">
    <PageHeader title="Delivery Management" subtitle="Track and manage all deliveries and logistics" icon="🚛" color="from-cyan-500 to-sky-700" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><StatCard label="Active Deliveries" value="184" /><StatCard label="Delivery Partners" value="42" /><StatCard label="Avg Delivery Time" value="4.2h" /><StatCard label="On-Time Rate" value="94.8%" /></div>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800">Active Deliveries</h3></div>
      <div className="space-y-0 divide-y divide-slate-50">{deliveries.map((d,i)=>(<div key={i} className="px-5 py-4 hover:bg-cyan-50/40 transition-colors"><div className="flex items-start justify-between gap-3 flex-wrap"><div><div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-slate-800 text-xs">{d.id}</span><span className="text-slate-400 text-[10px]">→ {d.order}</span></div><div className="text-xs text-slate-700 mt-0.5">{d.customer}</div><div className="text-[11px] text-slate-500 mt-0.5">🚗 {d.driver} · {d.vehicle}</div><div className="text-[11px] text-slate-500">📍 {d.dest}</div></div><div className="text-right"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc[d.status]}`}>{d.status}</span><div className="text-[11px] text-slate-500 mt-1">ETA: {d.eta}</div></div></div></div>))}</div>
    </div>
  </div>
);
