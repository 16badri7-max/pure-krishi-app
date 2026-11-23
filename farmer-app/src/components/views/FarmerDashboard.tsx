import React from 'react';
import { Sprout, Package, ShoppingCart, IndianRupee, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface FarmerDashboardProps {
  farmer: { name: string; phone: string } | null;
}

const stats = [
  { label: 'Active Crops', value: '4', sub: '2 ready to harvest', color: 'from-green-500 to-emerald-700', icon: Sprout },
  { label: 'Pending Submissions', value: '3', sub: 'Awaiting admin approval', color: 'from-yellow-500 to-orange-600', icon: Package },
  { label: 'Assigned Orders', value: '7', sub: '2 to dispatch today', color: 'from-blue-500 to-blue-700', icon: ShoppingCart },
  { label: 'This Month Earnings', value: '₹18,400', sub: '+12% from last month', color: 'from-purple-500 to-purple-700', icon: IndianRupee },
];

const recentActivity = [
  { type: 'approved', msg: 'Organic Tomatoes submission approved by admin', time: '2h ago', icon: CheckCircle, color: 'text-green-500' },
  { type: 'order', msg: 'New order #PK-1045 assigned: 50kg Onions', time: '4h ago', icon: ShoppingCart, color: 'text-blue-500' },
  { type: 'pending', msg: 'Fresh Wheat 200kg submission under review', time: '1d ago', icon: Clock, color: 'text-yellow-500' },
  { type: 'alert', msg: 'Low stock alert: Spinach < 10 kg remaining', time: '2d ago', icon: AlertCircle, color: 'text-red-500' },
];

export default function FarmerDashboard({ farmer }: FarmerDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🌾</div>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {farmer?.name || 'Farmer'}!</h1>
            <p className="text-green-200 text-sm mt-0.5">Here's your farm overview for today</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-xl p-4`}>
            <s.icon size={22} className="mb-2 opacity-80" />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium opacity-90">{s.label}</div>
            <div className="text-xs opacity-60 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Earnings chart */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-800">Monthly Earnings</h2>
          </div>
          <div className="flex items-end gap-2 h-28">
            {[8000, 12000, 9500, 15000, 11000, 18400].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t" style={{ height: `${(v / 20000) * 100}%` }} />
                <div className="text-xs text-gray-400">{['J', 'A', 'S', 'O', 'N', 'D'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <a.icon size={16} className={`${a.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Submit Product', icon: '📦', href: '/submit', color: 'bg-orange-50 border-orange-200 text-orange-700' },
            { label: 'Update Stock', icon: '📊', href: '/stock', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'View Orders', icon: '🛒', href: '/orders', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            { label: 'AI Assistant', icon: '🤖', href: '/ai', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
          ].map(a => (
            <a key={a.label} href={a.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${a.color} hover:shadow-md transition cursor-pointer`}>
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-medium">{a.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
