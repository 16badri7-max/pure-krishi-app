import React, { useState } from 'react';
import { Search, Download, Shield, User, Package, ShoppingCart, Settings, Wheat } from 'lucide-react';

const logs = [
  { id: 1, user: 'Veerabhadrappa', action: 'Approved product submission', resource: 'Organic Tomatoes', type: 'product', time: '2024-11-23 14:32', ip: '192.168.1.100' },
  { id: 2, user: 'Meena S', action: 'Suspended customer account', resource: 'Ramesh Nair', type: 'customer', time: '2024-11-23 13:15', ip: '192.168.1.101' },
  { id: 3, user: 'Veerabhadrappa', action: 'Updated commission rate to 8%', resource: 'App Settings', type: 'settings', time: '2024-11-23 11:45', ip: '192.168.1.100' },
  { id: 4, user: 'Kiran Kumar', action: 'Marked order as delivered', resource: 'Order #PK-1023', type: 'order', time: '2024-11-23 10:20', ip: '192.168.1.103' },
  { id: 5, user: 'Deepa Nair', action: 'Processed farmer payment', resource: 'Raju Patil - ₹12,400', type: 'farmer', time: '2024-11-22 16:00', ip: '192.168.1.104' },
  { id: 6, user: 'Veerabhadrappa', action: 'Rejected change request CR004', resource: 'Hotel Srinivasa', type: 'customer', time: '2024-11-22 14:30', ip: '192.168.1.100' },
  { id: 7, user: 'Rahul M', action: 'Updated stock quantity', resource: 'Fresh Wheat 500kg', type: 'product', time: '2024-11-22 12:10', ip: '192.168.1.105' },
  { id: 8, user: 'Meena S', action: 'Added new warehouse', resource: 'Hubli Warehouse #3', type: 'settings', time: '2024-11-21 09:50', ip: '192.168.1.101' },
  { id: 9, user: 'Veerabhadrappa', action: 'Admin login', resource: 'Authentication', type: 'auth', time: '2024-11-21 09:00', ip: '192.168.1.100' },
  { id: 10, user: 'Kiran Kumar', action: 'Created support ticket response', resource: 'Ticket #T-456', type: 'customer', time: '2024-11-20 15:40', ip: '192.168.1.103' },
];

const typeConfig: Record<string, { color: string; icon: React.ElementType }> = {
  product: { color: 'bg-orange-100 text-orange-700', icon: Package },
  customer: { color: 'bg-blue-100 text-blue-700', icon: User },
  settings: { color: 'bg-gray-100 text-gray-700', icon: Settings },
  order: { color: 'bg-green-100 text-green-700', icon: ShoppingCart },
  farmer: { color: 'bg-yellow-100 text-yellow-700', icon: Wheat },
  auth: { color: 'bg-red-100 text-red-700', icon: Shield },
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = logs.filter(l => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>
          <p className="text-gray-500 text-sm mt-1">Complete history of admin actions</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium">
          <Download size={16} /> Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search by user or action..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'product', 'customer', 'order', 'farmer', 'settings', 'auth'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${typeFilter === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow border border-gray-100 divide-y divide-gray-50">
        {filtered.map(log => {
          const cfg = typeConfig[log.type] || typeConfig['auth'];
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition">
              <div className={`p-2 rounded-lg ${cfg.color} flex-shrink-0 mt-0.5`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{log.user}</span>
                    <span className="text-sm text-gray-500 ml-2">{log.action}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{log.time}</div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">Resource: <span className="text-gray-600 font-medium">{log.resource}</span></span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs text-gray-400">IP: {log.ip}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{log.type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { AuditLogs };
