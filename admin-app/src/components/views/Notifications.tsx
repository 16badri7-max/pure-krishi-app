import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Package, Users, Wheat, ShoppingCart, AlertCircle } from 'lucide-react';

const allNotifications = [
  { id: 1, title: 'New farmer registration', message: 'Venkatesh R has registered as a farmer and needs approval.', time: '2 min ago', type: 'farmer', read: false, icon: Wheat, color: 'text-green-600 bg-green-100' },
  { id: 2, title: 'Large B2B order placed', message: 'FreshMart Superstore placed an order for ₹45,000.', time: '15 min ago', type: 'order', read: false, icon: ShoppingCart, color: 'text-blue-600 bg-blue-100' },
  { id: 3, title: 'Product approval pending', message: '3 new products submitted by farmers are awaiting approval.', time: '1 hour ago', type: 'product', read: false, icon: Package, color: 'text-orange-600 bg-orange-100' },
  { id: 4, title: 'Customer complaint', message: 'Ramesh Nair reported a quality issue with onions (Order #1023).', time: '2 hours ago', type: 'customer', read: true, icon: AlertCircle, color: 'text-red-600 bg-red-100' },
  { id: 5, title: 'New customer signup', message: 'Hotel Srinivasa (B2B) has registered as a new customer.', time: '3 hours ago', type: 'customer', read: true, icon: Users, color: 'text-purple-600 bg-purple-100' },
  { id: 6, title: 'Stock alert', message: 'Tomatoes stock is below threshold (< 50 kg remaining).', time: '5 hours ago', type: 'product', read: true, icon: Package, color: 'text-yellow-600 bg-yellow-100' },
  { id: 7, title: 'Farmer earnings processed', message: 'Monthly earnings of ₹1,24,000 disbursed to 8 farmers.', time: '1 day ago', type: 'farmer', read: true, icon: Wheat, color: 'text-green-600 bg-green-100' },
];

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} new</span>
          )}
        </div>
        <button onClick={markAllRead}
          className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 font-medium">
          <CheckCheck size={16} /> Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'farmer', 'customer', 'order', 'product'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        )}
        {filtered.map(n => (
          <div key={n.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition ${n.read ? 'bg-white border-gray-100' : 'bg-green-50 border-green-200'}`}>
            <div className={`p-2 rounded-lg ${n.color} flex-shrink-0`}>
              <n.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-gray-400">{n.time}</span>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="p-1 hover:bg-green-100 rounded text-green-600" title="Mark read">
                      <CheckCheck size={13} />
                    </button>
                  )}
                  <button onClick={() => remove(n.id)} className="p-1 hover:bg-red-50 rounded text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Notifications };
