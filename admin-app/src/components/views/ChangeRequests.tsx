import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';

const requests = [
  { id: 'CR001', from: 'Raju Patil', role: 'Farmer', type: 'Price Change', product: 'Organic Tomatoes', detail: 'Request to increase price from ₹45/kg to ₹55/kg due to high demand.', date: '2024-11-20', status: 'pending' },
  { id: 'CR002', from: 'FreshMart Superstore', role: 'Customer (B2B)', type: 'Bulk Discount', product: 'Basmati Rice', detail: 'Requesting 10% bulk discount for orders above 500 kg.', date: '2024-11-19', status: 'pending' },
  { id: 'CR003', from: 'Suresh Kumar', role: 'Farmer', type: 'Stock Update', product: 'Fresh Wheat', detail: 'Requesting stock increase from 200 kg to 500 kg for next month.', date: '2024-11-18', status: 'approved' },
  { id: 'CR004', from: 'Hotel Srinivasa', role: 'Customer (B2B)', type: 'Delivery Schedule', product: 'Mixed Vegetables', detail: 'Request for dedicated Tuesday/Friday delivery slots.', date: '2024-11-17', status: 'rejected' },
  { id: 'CR005', from: 'Priya Devi', role: 'Farmer', type: 'Category Change', product: 'Sugarcane Juice', detail: 'Request to relist sugarcane juice under processed beverages.', date: '2024-11-16', status: 'pending' },
];

export default function ChangeRequests() {
  const [items, setItems] = useState(requests);
  const [filter, setFilter] = useState('all');

  const filtered = items.filter(r => filter === 'all' || r.status === filter);

  const update = (id: string, status: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Change Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review and act on requests from farmers and customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: items.filter(r => r.status === 'pending').length, color: 'from-yellow-400 to-yellow-600', icon: Clock },
          { label: 'Approved', count: items.filter(r => r.status === 'approved').length, color: 'from-green-400 to-green-600', icon: CheckCircle },
          { label: 'Rejected', count: items.filter(r => r.status === 'rejected').length, color: 'from-red-400 to-red-600', icon: XCircle },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-xl p-4 flex items-center gap-4`}>
            <s.icon size={28} className="opacity-80" />
            <div>
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-xs opacity-80">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono text-gray-400">{r.id}</span>
                  <span className="text-sm font-semibold text-gray-800">{r.from}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.role}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{r.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700">Product: </span>
                  <span className="text-sm text-gray-600">{r.product}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">{r.detail}</div>
                <div className="mt-1 text-xs text-gray-400">{r.date}</div>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => update(r.id, 'approved')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => update(r.id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition">
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="p-1.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
                    <MessageSquare size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ChangeRequests };
