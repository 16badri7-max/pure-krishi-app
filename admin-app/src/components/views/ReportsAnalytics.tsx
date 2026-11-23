import React, { useState } from 'react';
import { TrendingUp, Download, BarChart2, Users, ShoppingCart, Wheat } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jun', revenue: 42000, orders: 180, farmers: 12 },
  { month: 'Jul', revenue: 58000, orders: 240, farmers: 15 },
  { month: 'Aug', revenue: 51000, orders: 210, farmers: 14 },
  { month: 'Sep', revenue: 73000, orders: 310, farmers: 18 },
  { month: 'Oct', revenue: 89000, orders: 380, farmers: 22 },
  { month: 'Nov', revenue: 1_02_000, orders: 440, farmers: 26 },
];

const topProducts = [
  { name: 'Organic Tomatoes', sales: 1240, revenue: '₹1,24,000', trend: '+12%' },
  { name: 'Fresh Onions', sales: 980, revenue: '₹78,400', trend: '+8%' },
  { name: 'Basmati Rice', sales: 740, revenue: '₹1,48,000', trend: '+22%' },
  { name: 'Green Spinach', sales: 620, revenue: '₹37,200', trend: '-3%' },
  { name: 'Alphonso Mangoes', sales: 510, revenue: '₹2,04,000', trend: '+45%' },
];

const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState('6months');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Business performance overview</p>
        </div>
        <div className="flex gap-2">
          {['1month', '3months', '6months', '1year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${period === p ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {p}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹4,15,000', change: '+18%', color: 'from-green-500 to-emerald-700', icon: TrendingUp },
          { label: 'Total Orders', value: '1,760', change: '+22%', color: 'from-blue-500 to-blue-700', icon: ShoppingCart },
          { label: 'Active Farmers', value: '26', change: '+4', color: 'from-orange-500 to-orange-700', icon: Wheat },
          { label: 'Active Customers', value: '342', change: '+56', color: 'from-purple-500 to-purple-700', icon: Users },
        ].map(k => (
          <div key={k.label} className={`bg-gradient-to-br ${k.color} text-white rounded-xl p-4`}>
            <k.icon size={22} className="mb-2 opacity-80" />
            <div className="text-2xl font-bold">{k.value}</div>
            <div className="text-xs opacity-80">{k.label}</div>
            <div className="text-xs mt-1 bg-white/20 inline-block px-2 py-0.5 rounded-full">{k.change}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-green-600" />
          <h2 className="font-semibold text-gray-800">Monthly Revenue</h2>
        </div>
        <div className="flex items-end gap-4 h-40">
          {monthlyRevenue.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-gray-500 font-medium">₹{(m.revenue / 1000).toFixed(0)}K</div>
              <div
                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md transition-all"
                style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
              />
              <div className="text-xs text-gray-500">{m.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products + Farmer Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-bold">{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.sales} units · {p.revenue}</div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.trend}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Orders Trend</h2>
          <div className="space-y-2">
            {monthlyRevenue.map(m => (
              <div key={m.month} className="flex items-center gap-3">
                <div className="w-8 text-xs text-gray-500">{m.month}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(m.orders / 500) * 100}%` }} />
                </div>
                <div className="text-xs text-gray-600 w-10 text-right">{m.orders}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ReportsAnalytics };
