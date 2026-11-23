import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Ban, Users, ShoppingCart, Eye, Phone, Mail } from 'lucide-react';

const customers = [
  { id: 1, name: 'Anjali Sharma', email: 'anjali@gmail.com', phone: '+91 9876543210', city: 'Bengaluru', orders: 12, spent: '₹8,450', status: 'active', type: 'Individual', joined: '2024-01-10' },
  { id: 2, name: 'Hotel Srinivasa', email: 'hotel@srinivasa.com', phone: '+91 9123456780', city: 'Mysuru', orders: 48, spent: '₹1,24,000', status: 'active', type: 'Hotel/B2B', joined: '2024-02-05' },
  { id: 3, name: 'Green Leaf Restaurant', email: 'info@greenleaf.in', phone: '+91 9988776655', city: 'Mangaluru', orders: 36, spent: '₹89,200', status: 'active', type: 'Restaurant/B2B', joined: '2024-02-20' },
  { id: 4, name: 'Ramesh Nair', email: 'ramesh.n@gmail.com', phone: '+91 9345678901', city: 'Hubli', orders: 5, spent: '₹2,100', status: 'suspended', type: 'Individual', joined: '2024-03-15' },
  { id: 5, name: 'FreshMart Superstore', email: 'buy@freshmart.in', phone: '+91 9654321098', city: 'Dharwad', orders: 120, spent: '₹5,67,000', status: 'active', type: 'Supermarket/B2B', joined: '2024-01-25' },
  { id: 6, name: 'Priya Kulkarni', email: 'priya.k@hotmail.com', phone: '+91 9212121212', city: 'Gadag', orders: 7, spent: '₹3,780', status: 'active', type: 'Individual', joined: '2024-04-08' },
];

export default function CustomerManagement() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || c.status === filter;
    const matchType = typeFilter === 'all' || c.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchSearch && matchStatus && matchType;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
  };

  const typeColors: Record<string, string> = {
    'Individual': 'bg-blue-100 text-blue-700',
    'Hotel/B2B': 'bg-purple-100 text-purple-700',
    'Restaurant/B2B': 'bg-orange-100 text-orange-700',
    'Supermarket/B2B': 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage individual & B2B customers</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, color: 'from-blue-500 to-blue-700', icon: Users },
          { label: 'B2B Clients', value: customers.filter(c => c.type.includes('B2B')).length, color: 'from-purple-500 to-purple-700', icon: ShoppingCart },
          { label: 'Active', value: customers.filter(c => c.status === 'active').length, color: 'from-green-500 to-green-700', icon: Eye },
          { label: 'Suspended', value: customers.filter(c => c.status === 'suspended').length, color: 'from-red-500 to-red-700', icon: Ban },
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
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="all">All Types</option>
          <option value="individual">Individual</option>
          <option value="hotel">Hotel/B2B</option>
          <option value="restaurant">Restaurant/B2B</option>
          <option value="supermarket">Supermarket/B2B</option>
        </select>
        <div className="flex gap-2">
          {['all', 'active', 'suspended'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
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
              {['Customer', 'Contact', 'City', 'Type', 'Orders', 'Total Spent', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-400">Joined {c.joined}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-600 text-xs"><Mail size={11} />{c.email}</div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5"><Phone size={11} />{c.phone}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.city}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[c.type] || 'bg-gray-100 text-gray-700'}`}>{c.type}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-medium">{c.orders}</td>
                <td className="px-4 py-3 font-medium text-green-700">{c.spent}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
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

export { CustomerManagement };
