import React, { useState } from 'react';
import { PageHeader, StatCard } from './shared';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const products = [
  { id: 'P001', name: 'Organic Tomatoes', category: 'Vegetables', price: '₹52/kg', stock: '1,200kg', farmer: 'Ramesh Patil', status: 'Published', approved: true },
  { id: 'P002', name: 'Basmati Rice (Organic)', category: 'Grains', price: '₹180/kg', stock: '500kg', farmer: 'Govind Sharma', status: 'Published', approved: true },
  { id: 'P003', name: 'Fresh Spinach', category: 'Vegetables', price: '₹28/kg', stock: '400kg', farmer: 'Lakshmi Devi', status: 'Published', approved: true },
  { id: 'P004', name: 'Raw Honey', category: 'Specialty', price: '₹480/kg', stock: '80kg', farmer: 'Meena Nair', status: 'Draft', approved: false },
  { id: 'P005', name: 'Organic Pomegranate', category: 'Fruits', price: '₹85/kg', stock: '0kg', farmer: 'Ramesh Patil', status: 'Out of Stock', approved: true },
  { id: 'P006', name: 'Cold-Pressed Coconut Oil', category: 'Oils', price: '₹180/L', farmer: 'Meena Nair', stock: '200L', status: 'Published', approved: true },
];

export const ProductManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeader title="Product Management" subtitle="Admin-only: Add, edit, approve and publish products" icon="📦" color="from-purple-500 to-violet-700" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value="542" sub="23 added this month" />
        <StatCard label="Published" value="498" />
        <StatCard label="Draft / Pending" value="32" />
        <StatCard label="Out of Stock" value="12" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-bold text-slate-800">Product Catalogue</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." className="text-xs border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400 w-44" />
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="px-5 py-3 text-left font-bold">Product</th>
                <th className="px-4 py-3 text-left font-bold">Category</th>
                <th className="px-4 py-3 text-left font-bold">Farmer</th>
                <th className="px-4 py-3 text-center font-bold">Price</th>
                <th className="px-4 py-3 text-center font-bold">Stock</th>
                <th className="px-4 py-3 text-center font-bold">Status</th>
                <th className="px-4 py-3 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-purple-50/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-800">{p.name}</div>
                    <div className="text-slate-400 text-[10px]">{p.id}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3.5 text-slate-600">{p.farmer}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{p.price}</td>
                  <td className="px-4 py-3.5 text-center text-slate-700">{p.stock}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Published' ? 'bg-green-100 text-green-700' :
                      p.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3 h-3" /></button>
                      <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                      <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                        {p.status === 'Published' ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
