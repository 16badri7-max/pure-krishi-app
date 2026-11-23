import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Sprout, ShoppingBag, Users, User, Package, CheckSquare,
  Archive, ShoppingCart, Warehouse, Store, Truck, CreditCard, BarChart3,
  Bell, FileText, Shield, Settings, ScrollText, ChevronLeft, ChevronRight,
  Leaf, LogOut, Menu, X
} from 'lucide-react';
import type { AdminUser } from '../../App';

const NAV = [
  { label: 'Admin Dashboard', icon: LayoutDashboard, to: '/dashboard', color: 'text-emerald-400' },
  { label: 'Farmer App Mgmt', icon: Sprout, to: '/farmer-app', color: 'text-amber-400' },
  { label: 'Customer App Mgmt', icon: ShoppingBag, to: '/customer-app', color: 'text-sky-400' },
  { label: 'Farmer Management', icon: Users, to: '/farmers', color: 'text-orange-400' },
  { label: 'Customer Management', icon: User, to: '/customers', color: 'text-blue-400' },
  { label: 'Product Management', icon: Package, to: '/products', color: 'text-purple-400' },
  { label: 'Product Approval', icon: CheckSquare, to: '/product-approval', color: 'text-green-400', badge: 'NEW' },
  { label: 'Inventory Management', icon: Archive, to: '/inventory', color: 'text-yellow-400' },
  { label: 'Order Management', icon: ShoppingCart, to: '/orders', color: 'text-pink-400' },
  { label: 'Warehouse Management', icon: Warehouse, to: '/warehouse', color: 'text-indigo-400' },
  { label: 'Supermarket Management', icon: Store, to: '/supermarkets', color: 'text-teal-400' },
  { label: 'Delivery Management', icon: Truck, to: '/delivery', color: 'text-cyan-400' },
  { label: 'Payment Management', icon: CreditCard, to: '/payments', color: 'text-emerald-400' },
  { label: 'Reports & Analytics', icon: BarChart3, to: '/reports', color: 'text-violet-400' },
  { label: 'Notifications', icon: Bell, to: '/notifications', color: 'text-rose-400', badge: '12' },
  { label: 'Change Requests', icon: FileText, to: '/change-requests', color: 'text-amber-400', badge: '5' },
  { label: 'User Roles & Permissions', icon: Shield, to: '/user-roles', color: 'text-red-400' },
  { label: 'Application Settings', icon: Settings, to: '/settings', color: 'text-gray-400' },
  { label: 'Audit Logs', icon: ScrollText, to: '/audit-logs', color: 'text-slate-400' },
];

interface Props {
  admin: AdminUser;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({ admin, onLogout, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-black text-sm leading-none">Pure Krishi</div>
            <div className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">Admin Centre</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                isActive
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
            {!collapsed && (
              <>
                <span className="text-xs font-semibold truncate flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Info + Logout */}
      <div className={`p-3 border-t border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {admin.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold truncate">{admin.name}</div>
                <div className="text-emerald-400 text-[10px] font-semibold">{admin.role}</div>
              </div>
              <button onClick={onLogout} className="p-1.5 text-white/40 hover:text-red-400 transition-colors" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={onLogout} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
        style={{ background: 'linear-gradient(180deg, #0f1f14 0%, #061209 100%)' }}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute top-4 right-0 translate-x-1/2 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg z-50 md:flex hidden"
          style={{ right: collapsed ? '-12px' : '-12px', position: 'absolute' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 z-50 md:hidden flex flex-col"
            style={{ background: 'linear-gradient(180deg, #0f1f14 0%, #061209 100%)' }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-slate-700">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setCollapsed(v => !v)} className="hidden md:flex p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <h1 className="font-bold text-slate-700 text-sm hidden sm:block">Pure Krishi — Admin Control Centre</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">Live</span>
            </div>
            <div className="text-xs text-slate-500 hidden md:block">👤 {admin.name}</div>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
