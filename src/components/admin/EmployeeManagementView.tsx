import React, { useState } from 'react';
import { UserCog, Plus, Mail, Phone } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { EmployeeRecord, UserRole } from '../../types';

export const EmployeeManagementView: React.FC = () => {
  const { state } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleTitle: 'Warehouse Operations Specialist',
    department: 'Warehouse Operations',
    accessRole: 'warehouse_staff' as UserRole,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    centralApi.adminAddEmployee({
      ...form,
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
    });
    setIsAddOpen(false);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      roleTitle: 'Warehouse Operations Specialist',
      department: 'Warehouse Operations',
      accessRole: 'warehouse_staff',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
            Employee & Staff Operations Management
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            Manage Pure Krishi internal staff, role assignments, departments, and operational access permissions.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.employees.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F0F7F0] text-[#176B45] font-bold flex items-center justify-center">
                  {emp.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17231C]">{emp.fullName}</h3>
                  <p className="text-xs text-[#66736A]">{emp.roleTitle}</p>
                </div>
              </div>
              <Badge variant={emp.status === 'active' ? 'green' : emp.status === 'on_leave' ? 'amber' : 'red'}>
                {emp.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="p-3 bg-[#FAF8F0] rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Department:</span>
                <strong>{emp.department}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Access Role:</span>
                <span className="font-mono font-bold text-[#176B45]">{emp.accessRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined:</span>
                <span>{emp.joinedAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {emp.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {emp.phone}
                </span>
              </div>
              <select
                value={emp.status}
                onChange={e => centralApi.adminUpdateEmployeeStatus(emp.id, e.target.value as EmployeeRecord['status'])}
                className="text-[11px] rounded-lg border border-gray-200 px-2 py-1 bg-white font-semibold"
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Onboard Employee / Operations Staff">
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Work Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Department</label>
              <input
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Job Title *</label>
              <input
                required
                value={form.roleTitle}
                onChange={e => setForm({ ...form, roleTitle: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">System Access Role</label>
              <select
                value={form.accessRole}
                onChange={e => setForm({ ...form, accessRole: e.target.value as UserRole })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="operations_admin">Operations Admin</option>
                <option value="warehouse_staff">Warehouse Staff</option>
                <option value="expert">Agricultural Expert</option>
                <option value="delivery_partner">Delivery Partner</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl flex items-center gap-1">
              <UserCog className="w-3.5 h-3.5" /> Save Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
