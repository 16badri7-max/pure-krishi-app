import React, { useState } from 'react';
import { Search, ShoppingBag, Ban, CheckCircle2, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { CustomerAccountSummary } from '../../types';

export const CustomerManagementView: React.FC = () => {
  const { state } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccountSummary | null>(null);

  // Build authoritative customer list by merging customerAccounts with orders placed
  const derivedCustomers: CustomerAccountSummary[] = React.useMemo(() => {
    const map = new Map<string, CustomerAccountSummary>();
    state.customerAccounts.forEach(c => map.set(c.id, { ...c }));
    state.customerOrders.forEach(ord => {
      const existing = map.get(ord.customerId);
      if (!existing) {
        map.set(ord.customerId, {
          id: ord.customerId,
          name: ord.customerName,
          email: `${ord.customerName.toLowerCase().replace(/\s+/g, '.')}@purekrishi.customer`,
          phone: ord.customerPhone,
          location: ord.shippingAddress,
          status: 'active',
          totalOrders: 1,
          totalSpent: ord.totalAmount,
          lastOrderAt: ord.orderDate,
          joinedAt: ord.orderDate,
        });
      }
    });
    return Array.from(map.values());
  }, [state.customerAccounts, state.customerOrders]);

  const filtered = derivedCustomers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrders = selectedCustomer
    ? state.customerOrders.filter(o => o.customerId === selectedCustomer.id || o.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
            Customer Management & Order Activity
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            Monitor registered customers, profiles, order history, and account status across the Consumer Marketplace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Registered Customers</span>
          <div className="text-2xl font-extrabold text-[#17231C] mt-1">{derivedCustomers.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Active Accounts</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {derivedCustomers.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Customer Orders</span>
          <div className="text-2xl font-extrabold text-[#104D35] mt-1">{state.customerOrders.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">B2C Sales Volume</span>
          <div className="text-2xl font-extrabold text-[#17231C] mt-1">
            ₹{state.customerOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer by name, email, or phone..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white"
        >
          <option value="all">All Account Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#176B45]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F0] border-b border-gray-200 text-[#66736A] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Lifetime Spend</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(cust => {
                const liveOrders = state.customerOrders.filter(
                  o => o.customerId === cust.id || o.customerName === cust.name
                );
                const liveSpent = liveOrders.reduce((s, o) => s + o.totalAmount, 0);
                return (
                  <tr key={cust.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#F0F7F0] text-[#176B45] font-bold flex items-center justify-center">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#17231C]">{cust.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{cust.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Mail className="w-3 h-3 text-gray-400" /> {cust.email}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Phone className="w-3 h-3 text-gray-400" /> {cust.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{cust.location}</td>
                    <td className="px-4 py-3 font-bold text-[#17231C]">{liveOrders.length}</td>
                    <td className="px-4 py-3 font-extrabold text-[#104D35]">₹{liveSpent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cust.status === 'active' ? 'green' : 'red'}>
                        {cust.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Customer Profile & Order History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => centralApi.adminToggleCustomerStatus(cust.id)}
                          className={`p-1.5 rounded-lg ${
                            cust.status === 'active'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={cust.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          {cust.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile: ${selectedCustomer.name}`}
          subtitle={`${selectedCustomer.email} • ${selectedCustomer.phone}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#176B45]" />
              <span>{selectedCustomer.location}</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#17231C] flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#176B45]" />
                Order History ({selectedOrders.length})
              </h4>
              {selectedOrders.length === 0 ? (
                <p className="text-gray-400 py-4 text-center">No orders placed yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedOrders.map(ord => (
                    <div key={ord.id} className="p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-[#176B45]">{ord.id}</span>
                        <p className="text-[11px] text-gray-500">
                          {new Date(ord.orderDate).toLocaleString()} • {ord.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#104D35]">₹{ord.totalAmount.toLocaleString()}</div>
                        <Badge variant={ord.status === 'Delivered' ? 'green' : 'blue'}>{ord.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
