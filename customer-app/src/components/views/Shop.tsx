import React, { useState } from 'react';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';

const products = [
  { id: 1, name: 'Organic Tomatoes', farmer: 'Raju Patil', price: 55, unit: 'kg', rating: 4.8, reviews: 124, icon: '🍅', category: 'Vegetables', organic: true, stock: 85 },
  { id: 2, name: 'Fresh Red Onions', farmer: 'Suresh Kumar', price: 32, unit: 'kg', rating: 4.6, reviews: 87, icon: '🧅', category: 'Vegetables', organic: false, stock: 120 },
  { id: 3, name: 'Basmati Rice', farmer: 'Priya Devi', price: 85, unit: 'kg', rating: 4.9, reviews: 203, icon: '🍚', category: 'Grains', organic: true, stock: 500 },
  { id: 4, name: 'Green Spinach', farmer: 'Raju Patil', price: 25, unit: 'kg', rating: 4.4, reviews: 56, icon: '🥬', category: 'Vegetables', organic: true, stock: 8 },
  { id: 5, name: 'Alphonso Mangoes', farmer: 'Venkatesh R', price: 400, unit: 'kg', rating: 4.9, reviews: 341, icon: '🥭', category: 'Fruits', organic: false, stock: 30 },
  { id: 6, name: 'Fresh Coconuts', farmer: 'Priya Devi', price: 35, unit: 'piece', rating: 4.5, reviews: 92, icon: '🥥', category: 'Fruits', organic: false, stock: 200 },
  { id: 7, name: 'Turmeric Powder', farmer: 'Suresh Kumar', price: 180, unit: 'kg', rating: 4.7, reviews: 65, icon: '🌿', category: 'Spices', organic: true, stock: 45 },
  { id: 8, name: 'Fresh Garlic', farmer: 'Manjunath B', price: 120, unit: 'kg', rating: 4.3, reviews: 44, icon: '🧄', category: 'Vegetables', organic: false, stock: 60 },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices'];

interface ShopProps {
  addToCart: (item: { id: number; name: string; price: number; icon: string }) => void;
}

export default function Shop({ addToCart }: ShopProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [added, setAdded] = useState<Record<number, boolean>>({});

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.farmer.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const handleAdd = (p: typeof products[0]) => {
    addToCart({ id: p.id, name: p.name, price: p.price, icon: p.icon });
    setAdded(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [p.id]: false })), 1200);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-8xl opacity-20">🌾</div>
        <div className="relative">
          <div className="text-sm font-medium text-green-300 mb-1">🌱 Direct from Farmers</div>
          <h2 className="text-2xl font-bold">Fresh Organic Produce</h2>
          <p className="text-green-200 text-sm mt-1">Zero chemical residue · Farm to Fork daily</p>
          <div className="mt-3 flex gap-3">
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">🥗 100% Organic</div>
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">🚚 Same-day delivery</div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search fruits, vegetables, grains..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
          <Filter size={18} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 text-center text-4xl">{p.icon}</div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-1">
                <div className="text-sm font-semibold text-gray-800 leading-tight">{p.name}</div>
                {p.organic && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">Org</span>}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">by {p.farmer}</div>
              <div className="flex items-center gap-1 mt-1">
                <Star size={11} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-600">{p.rating}</span>
                <span className="text-xs text-gray-400">({p.reviews})</span>
              </div>
              {p.stock < 20 && (
                <div className="text-xs text-red-500 mt-0.5">Only {p.stock}kg left!</div>
              )}
              <div className="flex items-center justify-between mt-2.5">
                <div>
                  <span className="text-base font-bold text-gray-900">₹{p.price}</span>
                  <span className="text-xs text-gray-400">/{p.unit}</span>
                </div>
                <button onClick={() => handleAdd(p)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${added[p.id] ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white'}`}>
                  <ShoppingCart size={12} />
                  {added[p.id] ? 'Added!' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
