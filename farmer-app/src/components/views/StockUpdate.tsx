import React, { useState } from 'react';
import { BarChart2, Save } from 'lucide-react';

const products = [
  { id: 1, name: 'Organic Tomatoes', icon: '🍅', current: 85, unit: 'kg', status: 'active' },
  { id: 2, name: 'Fresh Onions', icon: '🧅', current: 120, unit: 'kg', status: 'active' },
  { id: 3, name: 'Green Spinach', icon: '🌿', current: 8, unit: 'kg', status: 'low' },
  { id: 4, name: 'Sugarcane', icon: '🎋', current: 500, unit: 'kg', status: 'active' },
];

export default function StockUpdate() {
  const [updates, setUpdates] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState(false);

  const saveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Stock Updates</h1>
        <p className="text-gray-500 text-sm">Update your available product quantities</p>
      </div>

      <div className="space-y-4">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">{p.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  {p.status === 'low' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Low Stock</span>}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-sm text-gray-500">Current: <span className="font-semibold text-gray-800">{p.current} {p.unit}</span></div>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${p.status === 'low' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((p.current / 200) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">New Qty ({p.unit})</label>
                  <input type="number" min="0" value={updates[p.id] || ''}
                    onChange={e => setUpdates(prev => ({ ...prev, [p.id]: e.target.value }))}
                    placeholder={String(p.current)}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={saveAll}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${saved ? 'bg-green-500 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
        {saved ? <><BarChart2 size={18} /> Saved!</> : <><Save size={18} /> Submit Stock Update</>}
      </button>
    </div>
  );
}
