import React from 'react';
import { Users, Sprout, Package, ShoppingCart, TrendingUp, AlertTriangle, CheckCircle2, Clock, ArrowUpRight, Truck, CreditCard, Warehouse } from 'lucide-react';

const metrics = [
  { label: 'Total Customers', value: '8,420', delta: '+12%', icon: Users, color: 'bg-blue-500', light: 'bg-blue-50' },
  { label: 'Total Farmers', value: '1,247', delta: '+8%', icon: Sprout, color: 'bg-amber-500', light: 'bg-amber-50' },
  { label: 'Live Products', value: '542', delta: '+23', icon: Package, color: 'bg-purple-500', light: 'bg-purple-50' },
  { label: 'Total Orders', value: '31,086', delta: '+4%', icon: ShoppingCart, color: 'bg-pink-500', light: 'bg-pink-50' },
  { label: 'Revenue (Month)', value: '₹24.8L', delta: '+18%', icon: TrendingUp, color: 'bg-emerald-600', light: 'bg-emerald-50' },
  { label: 'Pending Orders', value: '184', delta: '-6', icon: Clock, color: 'bg-orange-500', light: 'bg-orange-50' },
  { label: 'Completed Orders', value: '30,902', delta: '+3%', icon: CheckCircle2, color: 'bg-green-500', light: 'bg-green-50' },
  { label: 'Low Stock Alerts', value: '28', delta: '+5', icon: AlertTriangle, color: 'bg-red-500', light: 'bg-red-50' },
];

const recentOrders = [
  { id: 'ORD-5892', customer: 'Priya Sharma', items: 'Organic Tomatoes, Spinach', amount: '₹1,240', status: 'Delivered', time: '2m ago' },
  { id: 'ORD-5891', customer: 'Rahul Verma', items: 'Brown Rice, Dal', amount: '₹2,650', status: 'Processing', time: '14m ago' },
  { id: 'ORD-5890', customer: "Nature's Basket", items: 'Bulk Vegetables 50kg', amount: '₹18,400', status: 'Dispatched', time: '1h ago' },
  { id: 'ORD-5889', customer: 'Meera Nair', items: 'Mangoes, Coconut Oil', amount: '₹890', status: 'Confirmed', time: '2h ago' },
  { id: 'ORD-5888', customer: 'Sunrise Hotel', items: 'Mixed Vegetables 30kg', amount: '₹9,200', status: 'Delivered', time: '3h ago' },
];

const pendingApprovals = [
  { farmer: 'Ramesh Patil', product: 'Organic Pomegranate', qty: '800kg', submitted: '2h ago', type: 'product' },
  { farmer: 'Suresh Kumar', product: 'Desi Tomatoes (Price Change)', qty: '₹45→₹52/kg', submitted: '5h ago', type: 'price' },
  { farmer: 'Lakshmi Devi', product: 'Fresh Spinach Stock Update', qty: '+400kg', submitted: '1d ago', type: 'stock' },
  { farmer: 'Dinesh Rao', product: 'New Farm Registration', qty: '5 acres', submitted: '1d ago', type: 'farm' },
];

const statusColor: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Dispatched: 'bg-purple-100 text-purple-700',
  Confirmed: 'bg-amber-100 text-amber-700',
};

export const Dashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-black text-slate-800">Admin Dashboard</h2>
      <p className="text-slate-500 text-sm mt-0.5">Pure Krishi Central Control — Real-time overview</p>
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(m => (
        <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-9 h-9 ${m.light} rounded-xl flex items-center justify-center`}>
              <m.icon className={`w-4.5 h-4.5 ${m.color.replace('bg-', 'text-')}`} style={{ width: 18, height: 18 }} />
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${m.delta.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {m.delta}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800">{m.value}</div>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">{m.label}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Orders */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-pink-500" /> Recent Orders
          </h3>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline">
            View all <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {recentOrders.map(o => (
            <div key={o.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
                {o.id.slice(-2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800">{o.id}</span>
                  <span className="text-slate-400 text-[10px]">•</span>
                  <span className="text-xs text-slate-600 truncate">{o.customer}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{o.items}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-xs text-slate-800">{o.amount}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Approvals
          </h3>
          <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">
            {pendingApprovals.length}
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {pendingApprovals.map((p, i) => (
            <div key={i} className="px-5 py-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{p.product}</div>
                  <div className="text-[11px] text-slate-500">by {p.farmer} · {p.submitted}</div>
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${
                  p.type === 'product' ? 'bg-purple-100 text-purple-700' :
                  p.type === 'price' ? 'bg-orange-100 text-orange-700' :
                  p.type === 'stock' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>{p.type}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors">✓ Approve</button>
                <button className="flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-[11px] font-bold py-1.5 rounded-lg transition-colors">✗ Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quick Links */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'Manage Farmers', icon: Sprout, to: '/farmers', color: 'from-amber-500 to-orange-500' },
        { label: 'Manage Customers', icon: Users, to: '/customers', color: 'from-blue-500 to-sky-600' },
        { label: 'Approve Products', icon: CheckCircle2, to: '/product-approval', color: 'from-emerald-500 to-green-600' },
        { label: 'View Deliveries', icon: Truck, to: '/delivery', color: 'from-purple-500 to-violet-600' },
      ].map(q => (
        <a key={q.label} href={q.to}
          className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${q.color} text-white shadow-sm hover:shadow-md hover:scale-105 transition-all`}>
          <q.icon className="w-5 h-5" />
          <span className="font-bold text-sm">{q.label}</span>
        </a>
      ))}
    </div>
  </div>
);
