import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Clock,
  History,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { FarmerProductSubmission, ProductListing } from '../../types';

export const ProductManagementView: React.FC = () => {
  const { state } = useStore();
  const [tab, setTab] = useState<'catalogue' | 'submissions' | 'price_audit'>('catalogue');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'low_stock'>('all');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductListing | null>(null);
  const [reviewSubmission, setReviewSubmission] = useState<FarmerProductSubmission | null>(null);
  const [reviewPrice, setReviewPrice] = useState<number>(0);
  const [reviewQty, setReviewQty] = useState<number>(0);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewDescription, setReviewDescription] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState(() => ({
    name: '',
    category: 'Vegetables' as ProductListing['category'],
    price: 50,
    sellingPrice: 50,
    unit: '1 kg pack',
    availableQuantity: 100,
    farmerName: state.farmers[0]?.name || 'Ramesh Patil',
    farmerLocation: 'Nashik, Maharashtra',
    farmName: 'Godavari Bio-Dynamic Orchards',
    harvestBatchId: `BAT-${new Date().getFullYear()}-01`,
    verificationBadge: 'NPOP Organic Certified',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: '',
    nutritionalBenefits: 'Zero Chemical Residue, Farm-Direct Fresh',
    isPublished: true,
  }));

  const lowThreshold = state.platformSettings.lowStockThresholdKg || 50;

  const filteredProducts = state.products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const isPub = p.isPublished !== false && p.isActive !== false && (p.approvalStatus ?? 'approved') === 'approved';
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && isPub) ||
      (statusFilter === 'draft' && !isPub) ||
      (statusFilter === 'low_stock' && p.availableQuantity <= lowThreshold);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const pendingSubmissions = state.productSubmissions.filter(s => s.status === 'pending' || s.status === 'under_review');
  const priceAuditLogs = state.auditLogs.filter(
    l => l.entityType === 'products' || l.entityType === 'farmer_product_submissions'
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Vegetables',
      price: 50,
      sellingPrice: 50,
      unit: '1 kg pack',
      availableQuantity: 100,
      farmerName: state.farmers[0]?.name || 'Ramesh Patil',
      farmerLocation: state.farmers[0] ? `${state.farmers[0].village}, ${state.farmers[0].state}` : 'Maharashtra',
      farmName: state.farms[0]?.farmName || 'Verified Pure Krishi Partner Farm',
      harvestBatchId: `BAT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      verificationBadge: 'NPOP Organic Certified',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      description: '',
      nutritionalBenefits: 'Zero Chemical Residue, Farm-Direct Fresh',
      isPublished: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (prod: ProductListing) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      sellingPrice: prod.sellingPrice ?? prod.price,
      unit: prod.unit,
      availableQuantity: prod.availableQuantity,
      farmerName: prod.farmerName,
      farmerLocation: prod.farmerLocation,
      farmName: prod.farmName,
      harvestBatchId: prod.harvestBatchId,
      verificationBadge: prod.verificationBadge,
      imageUrl: prod.imageUrl,
      description: prod.description,
      nutritionalBenefits: prod.nutritionalBenefits.join(', '),
      isPublished: prod.isPublished !== false && prod.isActive !== false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const benefits = form.nutritionalBenefits
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (editingProduct) {
        await centralApi.adminUpdateProduct(editingProduct.id, {
          name: form.name.trim(),
          category: form.category,
          price: Number(form.price),
          sellingPrice: Number(form.sellingPrice || form.price),
          unit: form.unit,
          availableQuantity: Number(form.availableQuantity),
          farmerName: form.farmerName,
          farmerLocation: form.farmerLocation,
          farmName: form.farmName,
          harvestBatchId: form.harvestBatchId,
          verificationBadge: form.verificationBadge,
          imageUrl: form.imageUrl,
          description: form.description.trim(),
          nutritionalBenefits: benefits,
          isPublished: form.isPublished,
          isActive: form.isPublished,
          approvalStatus: form.isPublished ? 'approved' : 'draft',
        });
        setFeedback({ type: 'success', text: `Updated "${form.name}" in live customer catalogue & recorded audit log.` });
      } else {
        await centralApi.adminCreateProduct({
          name: form.name.trim(),
          category: form.category,
          price: Number(form.price),
          sellingPrice: Number(form.sellingPrice || form.price),
          unit: form.unit,
          availableQuantity: Number(form.availableQuantity),
          farmerName: form.farmerName,
          farmerLocation: form.farmerLocation,
          farmName: form.farmName,
          harvestBatchId: form.harvestBatchId,
          verificationBadge: form.verificationBadge,
          imageUrl: form.imageUrl,
          description: form.description.trim(),
          nutritionalBenefits: benefits,
          isPublished: form.isPublished,
          isActive: form.isPublished,
          approvalStatus: form.isPublished ? 'approved' : 'draft',
        });
        setFeedback({ type: 'success', text: `Created "${form.name}" in catalogue.` });
      }
      setIsProductModalOpen(false);
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save product' });
    }
  };

  const openReviewModal = (sub: FarmerProductSubmission) => {
    setReviewSubmission(sub);
    setReviewPrice(sub.proposedPrice);
    setReviewQty(sub.proposedQuantity);
    setReviewName(sub.productName);
    setReviewDescription(sub.description);
    setReviewNotes('');
  };

  const handleReviewDecision = async (decision: 'approved' | 'rejected') => {
    if (!reviewSubmission) return;
    try {
      await centralApi.adminReviewProductSubmission(reviewSubmission.id, decision, {
        adminNotes: reviewNotes || (decision === 'approved' ? 'Verified and published by Admin.' : 'Does not meet current listing standards.'),
        overridePrice: reviewPrice,
        overrideQuantity: reviewQty,
        overrideName: reviewName,
        overrideDescription: reviewDescription,
      });
      setFeedback({
        type: 'success',
        text:
          decision === 'approved'
            ? `Approved "${reviewName}" and published to the Customer Marketplace!`
            : `Rejected submission "${reviewName}" with feedback sent to farmer.`,
      });
      setReviewSubmission(null);
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to process review' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Central Product Catalogue & Approval Control
            </h1>
            <span className="bg-[#176B45] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin-Only Live Control
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Only authorized Admin users can add, edit prices, approve farmer submissions, publish, or remove products from the live Customer Marketplace.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Live Product</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Total Products</span>
          <div className="text-2xl font-extrabold text-[#17231C] mt-1">{state.products.length}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {state.products.filter(p => p.isPublished !== false && p.isActive !== false).length} Live Published
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Pending Approvals</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{pendingSubmissions.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Farmer submissions waiting</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Low Stock Alerts</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {state.products.filter(p => p.availableQuantity <= lowThreshold).length}
          </div>
          <span className="text-[11px] text-gray-500">Threshold ≤ {lowThreshold} units</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">B2B Locked Batches</span>
          <div className="text-2xl font-extrabold text-[#104D35] mt-1">
            {state.products.filter(p => p.isLockedForCustomers).length}
          </div>
          <span className="text-[11px] text-gray-500">Hidden from retail buyers</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-[#176B45]/15 w-fit">
        <button
          onClick={() => setTab('catalogue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            tab === 'catalogue' ? 'bg-[#176B45] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" /> Live Catalogue ({state.products.length})
        </button>
        <button
          onClick={() => setTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            tab === 'submissions' ? 'bg-[#176B45] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Farmer Submissions
          {pendingSubmissions.length > 0 && (
            <span className="bg-amber-400 text-stone-900 px-1.5 py-0.5 rounded-full text-[10px]">
              {pendingSubmissions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('price_audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            tab === 'price_audit' ? 'bg-[#176B45] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Price & Catalogue Audit ({priceAuditLogs.length})
        </button>
      </div>

      {/* TAB 1: LIVE CATALOGUE */}
      {tab === 'catalogue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, farmers, categories..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white"
            >
              <option value="all">All Categories</option>
              {state.categories.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published (Live)</option>
              <option value="draft">Draft / Hidden</option>
              <option value="low_stock">Low Stock</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-[#176B45]/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F0] border-b border-gray-200 text-[#66736A] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Farmer Source</th>
                    <th className="px-4 py-3">Selling Price</th>
                    <th className="px-4 py-3">Available Stock</th>
                    <th className="px-4 py-3">Catalogue Status</th>
                    <th className="px-4 py-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(prod => {
                    const isPublished =
                      prod.isPublished !== false &&
                      prod.isActive !== false &&
                      (prod.approvalStatus ?? 'approved') === 'approved';
                    const isLow = prod.availableQuantity <= lowThreshold;
                    return (
                      <tr key={prod.id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-[#17231C]">{prod.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{prod.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-medium">{prod.category}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">{prod.farmerName}</div>
                          <div className="text-[10px] text-gray-500">{prod.farmerLocation}</div>
                        </td>
                        <td className="px-4 py-3 font-extrabold text-[#104D35]">
                          ₹{prod.price} <span className="font-normal text-[10px] text-gray-500">/ {prod.unit}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${isLow ? 'text-rose-600' : 'text-[#17231C]'}`}>
                            {prod.availableQuantity.toLocaleString()}
                          </span>
                          {isLow && (
                            <span className="ml-1.5 text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                              LOW
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Badge variant={isPublished ? 'green' : 'amber'}>
                              {isPublished ? 'Published' : 'Unpublished'}
                            </Badge>
                            {prod.isLockedForCustomers && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                <Lock className="w-2.5 h-2.5" /> B2B Locked
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit Product & Price"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => void centralApi.adminToggleProductPublish(prod.id)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                              title={isPublished ? 'Unpublish from Customer App' : 'Approve & Publish to Customer App'}
                            >
                              {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${prod.name}" from the live catalogue?`)) {
                                  void centralApi.adminDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* TAB 2: FARMER SUBMISSIONS APPROVAL WORKFLOW */}
      {tab === 'submissions' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Workflow 1 — Farmer Submission Authority:</strong> Farmers cannot publish directly to the live customer store or modify approved prices. Review each submission below, adjust final customer price/details if needed, and approve or reject.
            </div>
          </div>

          <div className="space-y-3">
            {state.productSubmissions.map(sub => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-[#176B45]/15 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={sub.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'}
                    alt={sub.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#17231C]">{sub.productName}</span>
                      <Badge variant={sub.status === 'approved' ? 'green' : sub.status === 'rejected' ? 'red' : 'amber'}>
                        {sub.status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {sub.submissionType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{sub.description}</p>
                    <p className="text-[11px] text-[#66736A]">
                      Submitted by <strong>{sub.farmerName}</strong> • Category: {sub.category} • Proposed:{' '}
                      <strong className="text-[#104D35]">
                        ₹{sub.proposedPrice}/{sub.unit}
                      </strong>{' '}
                      • Qty: {sub.proposedQuantity} {sub.unit}
                    </p>
                    {sub.adminNotes && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Admin Note: {sub.adminNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {sub.status === 'pending' || sub.status === 'under_review' ? (
                    <button
                      onClick={() => openReviewModal(sub)}
                      className="px-4 py-2 bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Review & Decide
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-500">
                      Reviewed by {sub.reviewedBy || 'Admin'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {tab === 'price_audit' && (
        <div className="bg-white rounded-2xl border border-[#176B45]/15 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-[#17231C]">Product & Price Change Audit Log</h3>
          <div className="divide-y divide-gray-100 text-xs">
            {priceAuditLogs.length === 0 ? (
              <p className="text-gray-400 py-6 text-center">No product changes logged yet.</p>
            ) : (
              priceAuditLogs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-[#176B45] mr-2">{log.action}</span>
                    <span className="font-semibold text-[#17231C]">{log.summary}</span>
                    <p className="text-[11px] text-gray-500">
                      Actor: {log.actorName} ({log.actorRole}) • Entity ID: {log.entityId}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? `Edit Live Product: ${editingProduct.name}` : 'Add New Live Product'}
        subtitle="Changes are audited and reflected in the Customer Marketplace immediately upon save."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as ProductListing['category'] })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                {['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dry fruits', 'Spices'].map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold mb-1">Base Price (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value), sellingPrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Selling Price (₹)</label>
              <input
                type="number"
                min={1}
                value={form.sellingPrice}
                onChange={e => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Unit *</label>
              <input
                required
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={form.availableQuantity}
                onChange={e => setForm({ ...form, availableQuantity: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Farmer Name</label>
              <input
                value={form.farmerName}
                onChange={e => setForm({ ...form, farmerName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input
                value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description *</label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={e => setForm({ ...form, isPublished: e.target.checked })}
              className="rounded text-[#176B45]"
            />
            <span>Approve & Publish Immediately to Customer Marketplace</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl">
              {editingProduct ? 'Save & Audit Update' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Farmer Submission Modal */}
      {reviewSubmission && (
        <Modal
          isOpen={Boolean(reviewSubmission)}
          onClose={() => setReviewSubmission(null)}
          title={`Review Farmer Submission: ${reviewSubmission.productName}`}
          subtitle={`Submitted by ${reviewSubmission.farmerName} (${reviewSubmission.submissionType.replace('_', ' ')})`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Approved Product Title</label>
                <input
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Final Customer Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={reviewPrice}
                    onChange={e => setReviewPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Approved Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={reviewQty}
                    onChange={e => setReviewQty(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Published Description</label>
              <textarea
                rows={2}
                value={reviewDescription}
                onChange={e => setReviewDescription(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Admin Review Notes (visible to farmer)</label>
              <input
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="Optional feedback or approval notes..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => void handleReviewDecision('rejected')}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
              <button
                type="button"
                onClick={() => void handleReviewDecision('approved')}
                className="px-5 py-2 bg-[#176B45] hover:bg-[#104D35] text-white font-bold rounded-xl flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish to Customer App
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
