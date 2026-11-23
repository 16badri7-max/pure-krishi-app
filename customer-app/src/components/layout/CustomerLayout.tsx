import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Store, ShoppingCart, Package, MapPin, User, LogOut } from 'lucide-react';

const navItems = [
  { icon: Store, label: 'Shop', path: '/shop' },
  { icon: ShoppingCart, label: 'Cart', path: '/cart' },
  { icon: Package, label: 'Orders', path: '/orders' },
  { icon: MapPin, label: 'Track', path: '/track' },
  { icon: User, label: 'Profile', path: '/profile' },
];

interface CustomerLayoutProps {
  children: React.ReactNode;
  customer: { name: string; email: string } | null;
  cartCount: number;
}

export default function CustomerLayout({ children, customer, cartCount }: CustomerLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} className="text-green-300" />
          <span className="font-bold text-lg">Pure Krishi</span>
          <span className="text-green-300 text-xs hidden sm:inline">· Fresh Farm-to-Fork</span>
        </div>
        <div className="flex items-center gap-4">
          {customer && <span className="text-sm text-green-200 hidden sm:inline">Hi, {customer.name}!</span>}
          <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-lg transition">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="p-2 hover:bg-white/10 rounded-lg transition">
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex z-30">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className={`flex-1 flex flex-col items-center py-2.5 transition ${active ? 'text-green-700' : 'text-gray-400'}`}>
              <item.icon size={20} />
              <span className="text-xs mt-0.5 font-medium">{item.label}</span>
              {item.path === '/cart' && cartCount > 0 && (
                <span className="absolute top-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop sidebar nav */}
      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-16 bg-white border-r border-gray-100 flex-col items-center pt-4 gap-2 z-20">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} title={item.label}
              className={`p-3 rounded-xl transition ${active ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
              <item.icon size={20} />
            </Link>
          );
        })}
      </div>

      {/* Content offset for desktop sidebar */}
      <style>{`@media (min-width: 768px) { main { padding-left: 4rem; } }`}</style>
    </div>
  );
}
