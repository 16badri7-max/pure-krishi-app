import React from 'react';
import { ShoppingBag, Users, ShoppingCart, Eye, TrendingUp, Star, MessageSquare, Ban, CheckCircle } from 'lucide-react';

const customers = [
  { id: 'C001', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98200 11234', city: 'Mumbai', orders: 24, spent: '₹18,400', status: 'active', joined: '2024-02-10', type: 'Individual' },
  { id: 'C002', name: "Nature's Basket", email: 'procurement@nb.com', phone: '+91 22-4511-2300', city: 'Mumbai', orders: 184, spent: '₹4,20,000', status: 'active', joined: '2024-01-05', type: 'Supermarket' },
  { id: 'C003', name: 'Rahul Verma', email: 'rahul.v@gmail.com', phone: '+91 90000 55566', city: 'Delhi', orders: 8, spent: '₹6,200', status: 'active', joined: '2024-05-20', type: 'Individual' },
  { id: 'C004', name: 'Sunrise Hotel', email: 'chef@sunrisehotel.com', phone: '+91 44-6700-1234', city: 'Chennai', orders: 72, spent: '₹2,80,000', status: 'active', joined: '2024-03-01', type: 'Bulk/Hotel' },
  { id: 'C005', name: 'Amit Joshi', email: 'amit.j@hotmail.com', phone: '+91 76500 88123', city: 'Pune', orders: 2, spent: '₹1,100', status: 'pending', joined: '2024-11-18', type: 'Individual' },
  { id: 'C006', name: 'Fresh Mart', email: 'buy@freshmart.in', phone: '+91 80-1234-5678', city: 'Bangalore', orders: 96, spent: '₹3,60,000', status: 'suspended', joined: '2024-01-20', type: 'Retail Store' },
];

const recentComplaints = [
  { customer: 'Priya Sharma', issue: 'Tomatoes delivered unripe', order: 'ORD-5801', severity: 'medium', time: '3h ago' },
  { customer: 'Rahul Verma', issue: 'Wrong item delivered', order: 'ORD-5745', severity: 'high', time: '1d ago' },
  { customer: 'Amit Joshi', issue: 'Payment not refunded', order: 'ORD-5690', severity: 'high', time: '2d ago' },
];

const statusClr: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
};

const sevClr: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

export const CustomerAppMgmt: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center">
        <ShoppingBag className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-800">Customer Application Management</h2>
        <p className="text-slate-500 text-sm">Monitor and manage the Pure Krishi Customer Application</p>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'Total Customers', value: '8,420', icon: Users, c: 'bg-blue-500' },
        { label: 'Total Orders', value: '31,086', icon: ShoppingCart, c: 'bg-pink-500' },
        { label: 'Monthly Revenue', value: '₹24.8L', icon: TrendingUp, c: 'bg-emerald-500' },
        { label: 'Open Complaints', value: '14', icon: MessageSquare, c: 'bg-orange-500' },
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

    {/* Customer Table */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Registered Customers</h3>
        <input placeholder="Search customers..." className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 w-48" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3 text-left font-bold">Customer</th>
              <th className="px-4 py-3 text-left font-bold">Type</th>
              <th className="px-4 py-3 text-left font-bold">City</th>
              <th className="px-4 py-3 text-center font-bold">Orders</th>
              <th className="px-4 py-3 text-center font-bold">Total Spent</th>
              <th className="px-4 py-3 text-center font-bold">Status</th>
              <th className="px-4 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-sky-50/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center font-bold text-sky-700 text-xs shrink-0">{c.name[0]}</div>
                    <div>
                      <div className="font-bold text-slate-800">{c.name}</div>
                      <div className="text-slate-400 text-[10px]">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{c.type}</td>
                <td className="px-4 py-3.5 text-slate-600">{c.city}</td>
                <td className="px-4 py-3.5 text-center font-bold text-slate-700">{c.orders}</td>
                <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{c.spent}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClr[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    {c.status === 'active' ? (
                      <button className="px-2 py-0.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[10px] font-bold">Suspend</button>
                    ) : c.status === 'suspended' ? (
                      <button className="px-2 py-0.5 bg-green-50 text-green-600 hover:bg-green-100 rounded text-[10px] font-bold">Reactivate</button>
                    ) : (
                      <button className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold">Verify</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Complaints */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Open Customer Complaints</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {recentComplaints.map((c, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-800">{c.issue}</div>
              <div className="text-[11px] text-slate-500">{c.customer} · {c.order} · {c.time}</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sevClr[c.severity]}`}>{c.severity}</span>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors">Resolve</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
