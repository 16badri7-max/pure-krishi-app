import React from 'react';
import { IndianRupee, TrendingUp, Calendar, Download } from 'lucide-react';

const history = [
  { month: 'November 2024', products: 'Tomatoes, Onions', orders: 8, gross: '₹24,500', commission: '₹1,960', net: '₹22,540', status: 'paid' },
  { month: 'October 2024', products: 'Wheat, Spinach', orders: 6, gross: '₹18,200', commission: '₹1,456', net: '₹16,744', status: 'paid' },
  { month: 'September 2024', products: 'Tomatoes, Sugarcane', orders: 10, gross: '₹31,000', commission: '₹2,480', net: '₹28,520', status: 'paid' },
  { month: 'August 2024', products: 'Onions, Spinach', orders: 5, gross: '₹12,800', commission: '₹1,024', net: '₹11,776', status: 'pending' },
];

const monthlyEarnings = [22540, 16744, 28520, 11776];
const max = Math.max(...monthlyEarnings);

export default function Earnings() {
  const total = history.reduce((s, h) => s + parseInt(h.net.replace(/[^0-9]/g, '')), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
          <p className="text-gray-500 text-sm">Revenue breakdown and payment history</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
          <Download size={15} /> Export
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: `₹${total.toLocaleString()}`, sub: 'All time net', color: 'from-green-600 to-emerald-800', icon: IndianRupee },
          { label: 'This Month', value: '₹22,540', sub: '+18% vs last month', color: 'from-blue-500 to-blue-700', icon: TrendingUp },
          { label: 'Pending Payment', value: '₹11,776', sub: 'Processing...', color: 'from-orange-500 to-orange-700', icon: Calendar },
        ].map(k => (
          <div key={k.label} className={`bg-gradient-to-br ${k.color} text-white rounded-xl p-5`}>
            <k.icon size={22} className="mb-2 opacity-80" />
            <div className="text-2xl font-bold">{k.value}</div>
            <div className="text-xs font-medium opacity-90 mt-0.5">{k.label}</div>
            <div className="text-xs opacity-60">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Monthly Net Earnings</h2>
        <div className="flex items-end gap-4 h-32">
          {history.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-gray-500">₹{(monthlyEarnings[i] / 1000).toFixed(1)}K</div>
              <div className="w-full bg-gradient-to-t from-green-700 to-green-400 rounded-t"
                style={{ height: `${(monthlyEarnings[i] / max) * 100}%` }} />
              <div className="text-xs text-gray-400">{h.month.split(' ')[0].substring(0, 3)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Payment History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{['Period', 'Products', 'Orders', 'Gross', 'Commission (8%)', 'Net Earned', 'Status'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{h.month}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{h.products}</td>
                <td className="px-4 py-3 text-gray-600">{h.orders}</td>
                <td className="px-4 py-3 text-gray-600">{h.gross}</td>
                <td className="px-4 py-3 text-red-500 text-xs">-{h.commission}</td>
                <td className="px-4 py-3 font-bold text-green-700">{h.net}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{h.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
