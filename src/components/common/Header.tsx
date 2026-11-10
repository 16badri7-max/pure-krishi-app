import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  RotateCcw,
  Bell,
  Menu,
  LogOut,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import logoImg from '../../assets/logo.jpg';
import { ProfileEditorModal } from './ProfileEditorModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenCart?: () => void;
  onLogout?: () => void;
}

const roleColors: Record<string, string> = {
  super_admin: 'bg-emerald-600',
  operations_admin: 'bg-blue-600',
  buyer: 'bg-purple-600',
  farmer: 'bg-amber-500',
  expert: 'bg-sky-600',
  warehouse_staff: 'bg-orange-500',
  delivery_partner: 'bg-indigo-600',
  customer: 'bg-rose-500',
};

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  operations_admin: 'Ops Admin',
  buyer: 'Buyer',
  farmer: 'Farmer',
  expert: 'Expert',
  warehouse_staff: 'Warehouse',
  delivery_partner: 'Delivery',
  customer: 'Customer',
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenCart, onLogout }) => {
  const { state, store } = useStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const relevantNotifs = state.notifications.filter(
    n => n.recipientRole === state.currentUser.role || n.recipientRole === 'all'
  );
  const unreadNotifs = relevantNotifs.filter(n => !n.isRead);
  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const user = state.currentUser;
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarBg = roleColors[user.role] || 'bg-[#104D35]';

  const handleReset = () => {
    store.resetToDefault();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── LEFT: Brand ── */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile menu toggle */}
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-[#176B45] hover:bg-[#F0F7F0] transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#DCECDC] shadow-sm shrink-0">
                <img src={logoImg} alt="Pure Krishi" className="w-full h-full object-cover" />
              </div>

              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-[#104D35] leading-none">
                    PURE KRISHI
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 leading-none hidden lg:block">
                    DEMAND-FIRST
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden lg:block">
                  AI-Powered Agricultural Platform
                </p>
              </div>
            </div>

            {/* ── RIGHT: Controls ── */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(v => !v)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-[#176B45] hover:bg-[#F0F7F0] transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#176B45]" />
                        <span className="text-xs font-bold text-gray-800">
                          Notifications
                          {unreadNotifs.length > 0 && (
                            <span className="ml-1.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadNotifs.length} new
                            </span>
                          )}
                        </span>
                      </div>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={() => store.markAllNotificationsAsRead(user.role)}
                          className="text-[10px] font-semibold text-[#176B45] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {relevantNotifs.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        relevantNotifs.slice(0, 10).map(n => (
                          <div
                            key={n.id}
                            onClick={() => store.markNotificationAsRead(n.id)}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                              !n.isRead ? 'bg-emerald-50/60' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-[11px] font-bold ${!n.isRead ? 'text-[#104D35]' : 'text-gray-700'}`}>
                                {n.title}
                              </span>
                              <span className="text-[9px] text-gray-400 shrink-0">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{n.message}</p>
                            {!n.isRead && (
                              <span className="inline-block mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={onOpenCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-[#176B45] hover:bg-[#F0F7F0] transition-colors"
                title="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#176B45] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Reset */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200 hidden sm:block" />

              {/* Profile pill — click to edit */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                title="Edit Profile"
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full ${avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white shadow`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                {/* Name & role */}
                <div className="text-left min-w-0 hidden md:block">
                  <p className="text-xs font-bold text-gray-800 leading-none truncate max-w-[100px]">{user.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{roleLabel[user.role] || user.role}</p>
                </div>
                <Pencil className="w-3 h-3 text-gray-300 group-hover:text-[#176B45] transition-colors hidden md:block" />
              </button>

              {/* Mobile avatar only */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className={`sm:hidden w-8 h-8 rounded-full ${avatarBg} text-white font-bold text-xs flex items-center justify-center overflow-hidden`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : initials}
              </button>

              {/* Logout */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100 transition-all text-xs font-semibold"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Editor Modal */}
      <ProfileEditorModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="font-bold text-gray-900 mb-1">Reset Demo Data?</h4>
            <p className="text-xs text-gray-500 mb-5">
              Restores all default data — supermarkets, farmers, crops, warehouses — to their fresh seed state.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
