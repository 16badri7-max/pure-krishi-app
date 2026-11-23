import React, { useState } from 'react';
import { Plus, Leaf, Droplets, Sun, Thermometer } from 'lucide-react';

const crops = [
  { id: 1, name: 'Organic Tomatoes', variety: 'Hybrid F1', planted: '2024-09-01', harvest: '2024-11-20', area: '1.2 acres', stage: 'Ready to Harvest', health: 92, icon: '🍅' },
  { id: 2, name: 'Fresh Onions', variety: 'Red Nasik', planted: '2024-08-15', harvest: '2024-12-10', area: '0.8 acres', stage: 'Growing', health: 85, icon: '🧅' },
  { id: 3, name: 'Green Spinach', variety: 'All Green', planted: '2024-10-20', harvest: '2024-11-30', area: '0.5 acres', stage: 'Ready to Harvest', health: 78, icon: '🌿' },
  { id: 4, name: 'Sugarcane', variety: 'Co-86032', planted: '2024-01-10', harvest: '2025-01-10', area: '2.3 acres', stage: 'Growing', health: 95, icon: '🎋' },
];

const stageColors: Record<string, string> = {
  'Ready to Harvest': 'bg-green-100 text-green-700 border-green-300',
  'Growing': 'bg-blue-100 text-blue-700 border-blue-300',
  'Planted': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Harvested': 'bg-gray-100 text-gray-600 border-gray-300',
};

export default function CropManagement() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Crops & Harvest</h1>
          <p className="text-gray-500 text-sm">Manage your crops and track growth</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('grid')} className={`px-3 py-1.5 rounded-lg text-sm ${view === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm ${view === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>List</button>
          <button className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition">
            <Plus size={15} /> Add Crop
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Crops', value: crops.length, icon: Leaf, color: 'from-green-500 to-green-700' },
          { label: 'Ready to Harvest', value: crops.filter(c => c.stage === 'Ready to Harvest').length, icon: Sun, color: 'from-yellow-500 to-orange-600' },
          { label: 'Growing', value: crops.filter(c => c.stage === 'Growing').length, icon: Droplets, color: 'from-blue-500 to-blue-700' },
          { label: 'Avg Health', value: Math.round(crops.reduce((a, c) => a + c.health, 0) / crops.length) + '%', icon: Thermometer, color: 'from-purple-500 to-purple-700' },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-xl p-4`}>
            <s.icon size={20} className="mb-2 opacity-80" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Crop cards */}
      <div className={view === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
        {crops.map(crop => (
          <div key={crop.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">{crop.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-800">{crop.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${stageColors[crop.stage]}`}>{crop.stage}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{crop.variety} · {crop.area}</div>
                <div className="mt-2 text-xs text-gray-400">
                  Planted: {crop.planted} · Harvest: {crop.harvest}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Health Score</span>
                    <span className="text-xs font-semibold text-green-700">{crop.health}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${crop.health >= 90 ? 'bg-green-500' : crop.health >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${crop.health}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
