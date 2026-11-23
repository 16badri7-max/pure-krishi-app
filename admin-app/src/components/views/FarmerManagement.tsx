import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Ban, CheckCircle, Eye, Phone, MapPin, Wheat } from 'lucide-react';

const farmers = [
  { id: 1, name: 'Raju Patil', phone: '+91 9876543210', location: 'Dharwad, Karnataka', crops: 'Tomato, Onion', land: '5.2 acres', status: 'active', joined: '2024-01-15', earnings: '₹1,24,000' },
  { id: 2, name: 'Suresh Kumar', phone: '+91 9123456780', location: 'Hubli, Karnataka', crops: 'Rice, Wheat', land: '8.0 acres', status: 'active', joined: '2024-02-20', earnings: '₹98,500' },
  { id: 3, name: 'Manjunath B', phone: '+91 9988776655', location: 'Gadag, Karnataka', crops: 'Groundnut', land: '3.5 acres', status: 'suspended', joined: '2024-03-10', earnings: '₹45,200' },
  { id: 4, name: 'Priya Devi', phone: '+91 9345678901', location: 'Bagalkot, Karnataka', crops: 'Sugarcane', land: '12.0 acres', status: 'active', joined: '2024-04-05', earnings: '₹2,10,000' },
  { id: 5, name: 'Venkatesh R', phone: '+91 9654321098', location: 'Bijapur, Karnataka', crops: 'Mango, Grapes', land: '7.3 acres', status: 'pending', joined: '2024-05-01', earnings: '₹0' },
];

export default function FarmerManagement() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = farmers.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || f.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farmer Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage registered farmers and their accounts</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium">
          <Plus size={16} /> Add Farmer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Farmers', value: farmers.length, color: 'from-green-500 to-green-700', icon: Wheat },
          { label: 'Active', value: farmers.filter(f => f.status === 'active').length, color: 'from-blue-500 to-blue-700', icon: CheckCircle },
          { label: 'Suspended', value: farmers.filter(f => f.status === 'suspended').length, color: 'from-red-500 to-red-700', icon: Ban },
          { label: 'Pending', value: farmers.filter(f => f.status === 'pending').length, color: 'from-yellow-500 to-yellow-700', icon: Eye },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-xl p-4`}>
            <s.icon size={22} className="mb-2 opacity-80" />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'suspended', 'pending'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Farmer', 'Contact', 'Location', 'Crops', 'Land', 'Earnings', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{f.name}</div>
                  <div className="text-xs text-gray-400">Joined {f.joined}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-600"><Phone size={12} />{f.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-600"><MapPin size={12} />{f.location}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{f.crops}</td>
                <td className="px-4 py-3 text-gray-600">{f.land}</td>
                <td className="px-4 py-3 font-medium text-green-700">{f.earnings}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[f.status]}`}>{f.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye size={14} /></button>
                    <button className="p-1 hover:bg-green-50 rounded text-green-600" title="Edit"><Edit size={14} /></button>
                    <button className="p-1 hover:bg-orange-50 rounded text-orange-600" title="Suspend"><Ban size={14} /></button>
                    <button className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { FarmerManagement };
