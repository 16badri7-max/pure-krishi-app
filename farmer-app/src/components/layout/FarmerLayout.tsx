import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Sprout, Wheat, Package, BarChart2,
  ShoppingCart, IndianRupee, Bot, Headphones, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', color: 'text-green-300' },
  { icon: Sprout, label: 'My Farm', path: '/farm', color: 'text-emerald-300' },
  { icon: Wheat, label: 'Crops & Harvest', path: '/crops', color: 'text-yellow-300' },
  { icon: Package, label: 'Submit Products', path: '/submit', color: 'text-orange-300' },
  { icon: BarChart2, label: 'Stock Updates', path: '/stock', color: 'text-blue-300' },
  { icon: ShoppingCart, label: 'Assigned Orders', path: '/orders', color: 'text-purple-300' },
  { icon: IndianRupee, label: 'Earnings', path: '/earnings', color: 'text-pink-300' },
  { icon: Bot, label: 'AI Assistant', path: '/ai', color: 'text-cyan-300' },
  { icon: Headphones, label: 'Expert Support', path: '/support', color: 'text-indigo-300' },
];

interface FarmerLayoutProps {
  children: React.ReactNode;
  farmer: { name: string; phone: string } | null;
  onLogout: () => void;
}

export default function FarmerLayout({ children, farmer, onLogout }: FarmerLayoutProps) {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${open ? 'w-60' : 'w-16'} bg-gradient-to-b from-green-900 to-emerald-900 flex flex-col transition-all duration-300 relative z-20 flex-shrink-0`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {open && (
            <div className="flex items-center gap-2">
              <Sprout size={22} className="text-green-300" />
              <span className="text-white font-bold text-sm">Pure Krishi</span>
            </div>
          )}
          <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Farmer info */}
        {open && farmer && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-white font-semibold text-sm truncate">{farmer.name}</div>
            <div className="text-green-300 text-xs">{farmer.phone}</div>
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mt-1 inline-block">🌾 Farmer</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition group ${active ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                <item.icon size={18} className={active ? 'text-green-300' : item.color + ' opacity-70 group-hover:opacity-100'} />
                {open && <span className="text-sm font-medium">{item.label}</span>}
                {open && active && <ChevronRight size={14} className="ml-auto text-green-300" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/10 transition">
            <LogOut size={18} />
            {open && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
