import React, { useState } from 'react';
import { Tags, Plus, Edit2, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { ProductCategory } from '../../types';

export const CategoryManagementView: React.FC = () => {
  const { state } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '🌱',
    displayOrder: state.categories.length + 1,
    isActive: true,
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      name: '',
      description: '',
      icon: '🌱',
      displayOrder: state.categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat: ProductCategory) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    centralApi.adminSaveCategory({
      ...(editing ? { id: editing.id } : {}),
      ...form,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
            Product Categories Management
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            Organize marketplace categories, icons, display priority, and customer storefront visibility.
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.categories
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(cat => {
            const matchingProducts = state.products.filter(
              p => p.category.toLowerCase() === cat.name.toLowerCase()
            );
            const totalUnits = matchingProducts.reduce((s, p) => s + p.availableQuantity, 0);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#F0F7F0] text-2xl flex items-center justify-center">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#17231C]">{cat.name}</h3>
                      <span className="text-[10px] font-mono text-gray-400">
                        /{cat.slug} • Order #{cat.displayOrder}
                      </span>
                    </div>
                  </div>
                  <Badge variant={cat.isActive ? 'green' : 'neutral'}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </div>

                <p className="text-xs text-[#66736A]">{cat.description}</p>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF8F0] rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Products</span>
                    <strong className="text-[#104D35]">{matchingProducts.length} SKUs</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Total Stock</span>
                    <strong className="text-[#17231C]">{totalUnits.toLocaleString()} units</strong>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(cat)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => centralApi.adminToggleCategory(cat.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-1"
                  >
                    {cat.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {cat.isActive ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? `Edit Category: ${editing.name}` : 'Create Product Category'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Category Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Icon Emoji</label>
              <input
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Display Order</label>
            <input
              type="number"
              min={1}
              value={form.displayOrder}
              onChange={e => setForm({ ...form, displayOrder: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl flex items-center gap-1">
              <Tags className="w-3.5 h-3.5" /> Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
