import React, { useState } from 'react';
import { MapPin, Ruler, Droplets, Sun, Edit, Save } from 'lucide-react';

export default function MyFarm() {
  const [editing, setEditing] = useState(false);
  const [farm, setFarm] = useState({
    name: 'Patil Organic Farm',
    owner: 'Raju Patil',
    location: 'Dharwad, Karnataka',
    pincode: '580001',
    totalArea: '5.2',
    cultivatedArea: '4.8',
    soilType: 'Black Cotton Soil',
    waterSource: 'Borewell + Canal',
    irrigation: 'Drip Irrigation',
    farmingType: 'Organic',
    established: '2010',
  });

  const Field = ({ label, name }: { label: string; name: string }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{label}</label>
      {editing ? (
        <input value={(farm as Record<string, string>)[name]} onChange={e => setFarm(p => ({ ...p, [name]: e.target.value }))}
          className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
      ) : (
        <div className="text-sm text-gray-800 font-medium">{(farm as Record<string, string>)[name]}</div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Farm</h1>
          <p className="text-gray-500 text-sm">Farm profile and details</p>
        </div>
        <button onClick={() => setEditing(e => !e)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${editing ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          {editing ? <><Save size={15} /> Save</> : <><Edit size={15} /> Edit</>}
        </button>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-6 text-white">
        <div className="text-3xl mb-2">🌿</div>
        <h2 className="text-xl font-bold">{farm.name}</h2>
        <div className="flex items-center gap-1 text-green-200 text-sm mt-1"><MapPin size={14} />{farm.location}</div>
        <div className="mt-3 flex gap-4">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold">{farm.totalArea}</div>
            <div className="text-xs text-green-200">Total Acres</div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold">{farm.cultivatedArea}</div>
            <div className="text-xs text-green-200">Cultivated</div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold">4</div>
            <div className="text-xs text-green-200">Crops</div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Ruler size={16} className="text-green-600" /> Farm Details</h3>
          <Field label="Farm Name" name="name" />
          <Field label="Owner Name" name="owner" />
          <Field label="Location" name="location" />
          <Field label="Pincode" name="pincode" />
          <Field label="Established Year" name="established" />
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Droplets size={16} className="text-blue-600" /> Farming Details</h3>
          <Field label="Soil Type" name="soilType" />
          <Field label="Water Source" name="waterSource" />
          <Field label="Irrigation Method" name="irrigation" />
          <Field label="Farming Type" name="farmingType" />
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Sun size={16} className="text-yellow-500" /> Certifications</h3>
        <div className="flex gap-3 flex-wrap">
          {['🌿 Organic Certified', '✅ FSSAI Registered', '🏅 State Agri Award 2022', '♻️ Zero Chemical'].map(c => (
            <span key={c} className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
