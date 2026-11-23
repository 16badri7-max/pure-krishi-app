import React from 'react'; import { PageHeader, StatCard } from './shared';
const orders = [
  {id:'ORD-5892',customer:'Priya Sharma',items:'Tomatoes, Spinach',amount:'₹1,240',status:'Delivered',date:'Today 10:22'},
  {id:'ORD-5891',customer:'Rahul Verma',items:'Brown Rice, Dal',amount:'₹2,650',status:'Processing',date:'Today 09:45'},
  {id:'ORD-5890',customer:"Nature's Basket",items:'Bulk Veg 50kg',amount:'₹18,400',status:'Dispatched',date:'Today 08:00'},
  {id:'ORD-5889',customer:'Sunrise Hotel',items:'Mixed Veg 30kg',amount:'₹9,200',status:'Confirmed',date:'Yesterday'},
  {id:'ORD-5888',customer:'Meera Nair',items:'Mangoes, Oil',amount:'₹890',status:'Delivered',date:'Yesterday'},
];
const sc: Record<string,string> = {Delivered:'bg-green-100 text-green-700',Processing:'bg-blue-100 text-blue-700',Dispatched:'bg-purple-100 text-purple-700',Confirmed:'bg-amber-100 text-amber-700'};
export const OrderManagement: React.FC = () => (
  <div className="space-y-5">
    <PageHeader title="Order Management" subtitle="Monitor and manage all customer orders" icon="🛒" color="from-pink-500 to-rose-600" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Orders" value="31,086" /><StatCard label="Pending" value="184" sub="Needs attention" /><StatCard label="In Progress" value="342" /><StatCard label="Delivered" value="30,560" />
    </div>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-slate-800">Recent Orders</h3><select className="text-xs border border-slate-200 rounded-xl px-3 py-1.5"><option>All Status</option><option>Pending</option><option>Processing</option><option>Delivered</option></select></div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs"><thead><tr className="bg-slate-50 text-slate-500 uppercase text-[10px]"><th className="px-5 py-3 text-left font-bold">Order ID</th><th className="px-4 py-3 text-left font-bold">Customer</th><th className="px-4 py-3 text-left font-bold">Items</th><th className="px-4 py-3 text-center font-bold">Amount</th><th className="px-4 py-3 text-center font-bold">Status</th><th className="px-4 py-3 text-left font-bold">Date</th><th className="px-4 py-3 text-center font-bold">Actions</th></tr></thead>
        <tbody className="divide-y divide-slate-50">{orders.map((o,i)=>(<tr key={i} className="hover:bg-pink-50/40"><td className="px-5 py-3.5 font-bold text-slate-800">{o.id}</td><td className="px-4 py-3.5 text-slate-700">{o.customer}</td><td className="px-4 py-3.5 text-slate-500 max-w-32 truncate">{o.items}</td><td className="px-4 py-3.5 text-center font-bold text-emerald-700">{o.amount}</td><td className="px-4 py-3.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sc[o.status]}`}>{o.status}</span></td><td className="px-4 py-3.5 text-slate-500 text-[11px]">{o.date}</td><td className="px-4 py-3.5 text-center"><button className="text-blue-500 text-[10px] font-bold hover:underline">Manage</button></td></tr>))}</tbody></table>
      </div>
    </div>
  </div>
);
