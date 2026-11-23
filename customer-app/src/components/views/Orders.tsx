import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';

const orders = [
  { id: 'PK-1045', date: '2024-11-22', items: 'Tomatoes 2kg, Onions 3kg', total: '₹206', status: 'delivered', icon: '🍅🧅' },
  { id: 'PK-1032', date: '2024-11-18', items: 'Basmati Rice 5kg', total: '₹425', status: 'in-transit', icon: '🍚' },
  { id: 'PK-1021', date: '2024-11-15', items: 'Mangoes 1kg, Spinach 1kg', total: '₹425', status: 'processing', icon: '🥭🥬' },
  { id: 'PK-1010', date: '2024-11-10', items: 'Turmeric 500g', total: '₹90', status: 'delivered', icon: '🌿' },
  { id: 'PK-0998', date: '2024-11-05', items: 'Coconuts x6, Garlic 1kg', total: '₹330', status: 'delivered', icon: '🥥🧄' },
];

const statusMeta: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
  'in-transit': { color: 'bg-blue-100 text-blue-700', icon: Truck, label: 'In Transit' },
  processing: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Processing' },
};

export default function Orders() {
  const [filter, setFilter] = useState('all');
  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      <div className="flex gap-2">
        {['all', 'delivered', 'in-transit', 'processing'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f === 'in-transit' ? 'In Transit' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(o => {
          const meta = statusMeta[o.status];
          return (
            <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{o.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">{o.id}</span>
                      <span className="text-gray-400 text-xs ml-2">{o.date}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{o.items}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-800">{o.total}</span>
                    <div className="flex gap-2">
                      <a href="/track" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Eye size={12} /> Track
                      </a>
                      {o.status === 'delivered' && (
                        <button className="text-xs text-green-600 hover:text-green-700">Reorder</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
