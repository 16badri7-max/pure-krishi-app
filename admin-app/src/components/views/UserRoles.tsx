import React, { useState } from 'react';
import { Shield, Plus, Edit, Check, X } from 'lucide-react';

const roles = [
  { name: 'Super Admin', users: 1, color: 'bg-red-100 text-red-700', permissions: ['dashboard', 'farmers', 'customers', 'products', 'orders', 'finance', 'settings', 'audit', 'roles'] },
  { name: 'Manager', users: 3, color: 'bg-purple-100 text-purple-700', permissions: ['dashboard', 'farmers', 'customers', 'products', 'orders'] },
  { name: 'Support Agent', users: 5, color: 'bg-blue-100 text-blue-700', permissions: ['dashboard', 'customers', 'orders'] },
  { name: 'Inventory Clerk', users: 2, color: 'bg-orange-100 text-orange-700', permissions: ['dashboard', 'products', 'orders'] },
  { name: 'Finance Officer', users: 2, color: 'bg-green-100 text-green-700', permissions: ['dashboard', 'finance', 'orders'] },
];

const allPermissions = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'farmers', label: 'Farmer Mgmt' },
  { key: 'customers', label: 'Customer Mgmt' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'finance', label: 'Finance' },
  { key: 'settings', label: 'Settings' },
  { key: 'audit', label: 'Audit Logs' },
  { key: 'roles', label: 'User Roles' },
];

const users = [
  { name: 'Veerabhadrappa', role: 'Super Admin', email: 'admin@pureagrih.in', status: 'active' },
  { name: 'Meena S', role: 'Manager', email: 'meena.s@pureagrih.in', status: 'active' },
  { name: 'Kiran Kumar', role: 'Support Agent', email: 'kiran@pureagrih.in', status: 'active' },
  { name: 'Deepa Nair', role: 'Finance Officer', email: 'deepa@pureagrih.in', status: 'active' },
  { name: 'Rahul M', role: 'Inventory Clerk', email: 'rahul@pureagrih.in', status: 'inactive' },
];

export default function UserRoles() {
  const [tab, setTab] = useState<'roles' | 'users' | 'matrix'>('roles');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Roles & Permissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage roles, permissions and admin users</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
          <Plus size={16} /> Add Role
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['roles', 'users', 'matrix'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Roles Tab */}
      {tab === 'roles' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(r => (
            <div key={r.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-purple-600" />
                  <span className="font-semibold text-gray-800">{r.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.color}`}>{r.users} user{r.users !== 1 ? 's' : ''}</span>
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><Edit size={13} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allPermissions.map(p => (
                  <span key={p.key} className={`text-xs px-2 py-0.5 rounded-full border ${r.permissions.includes(p.key) ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.name} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    {roles.find(r => r.name === u.role) && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roles.find(r => r.name === u.role)?.color}`}>{u.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-blue-50 rounded text-blue-500"><Edit size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Matrix Tab */}
      {tab === 'matrix' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Permission</th>
                {roles.map(r => (
                  <th key={r.name} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map(p => (
                <tr key={p.key} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{p.label}</td>
                  {roles.map(r => (
                    <td key={r.name} className="px-4 py-3 text-center">
                      {r.permissions.includes(p.key)
                        ? <Check size={16} className="text-green-600 mx-auto" />
                        : <X size={16} className="text-red-300 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export { UserRoles };
