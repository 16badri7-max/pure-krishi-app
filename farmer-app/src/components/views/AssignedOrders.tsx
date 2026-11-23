import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Truck, Package } from 'lucide-react';

const orders = [
  { id: 'PK-1045', customer: 'FreshMart Superstore', product: 'Organic Tomatoes', qty: '50 kg', by: '2024-11-24', status: 'pending', value: '₹2,500' },
  { id: 'PK-1038', customer: 'Hotel Srinivasa', product: 'Fresh Onions', qty: '30 kg', by: '2024-11-23', status: 'dispatched', value: '₹900' },
  { id: 'PK-1032', customer: 'Green Leaf Restaurant', product: 'Green Spinach', qty: '15 kg', by: '2024-11-22', status: 'delivered', value: '₹900' },
  { id: 'PK-1021', customer: 'Ramesh Nair', product: 'Sugarcane', qty: '100 kg', by: '2024-11-20', status: 'delivered', value: '₹2,000' },
];

const statusMeta: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Package, label: 'Pending Dispatch' },
  dispatched: { color: 'bg-blue-100 text-blue-700', icon: Truck, label: 'Dispatched' },
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
};

export default function AssignedOrders() {
  const [items, setItems] = useState(orders);
  const [filter, setFilter] = useState('all');

  const filtered = items.filter(o => filter === 'all' || o.status === filter);
  const dispatch = (id: string) => setItems(prev => prev.map(o => o.id === id ? { ...o, status: 'dispatched' } : o));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assigned Orders</h1>
        <p className="text-gray-500 text-sm">Orders assigned by admin for you to fulfil</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {['pending', 'dispatched', 'delivered'].map(s => {
          const meta = statusMeta[s];
          return (
            <div key={s} className={`${meta.color} rounded-xl p-4 flex items-center gap-3`}>
              <meta.icon size={22} />
              <div>
                <div className="text-xl font-bold">{items.filter(o => o.status === s).length}</div>
                <div className="text-xs font-medium">{meta.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'dispatched', 'delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.map(o => {
          const meta = statusMeta[o.status];
          return (
            <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>{meta.label}</span>
                  </div>
                  <div className="mt-1.5">
                    <div className="font-semibold text-gray-800">{o.customer}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {o.product} · {o.qty} · Value: <span className="font-medium text-green-700">{o.value}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Deliver by: {o.by}</div>
                  </div>
                </div>
                {o.status === 'pending' && (
                  <button onClick={() => dispatch(o.id)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    <Truck size={14} /> Mark Dispatched
                  </button>
                )}
                {o.status === 'delivered' && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle size={14} /> Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
