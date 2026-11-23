import React, { useState } from 'react';
import { Package, Upload, CheckCircle } from 'lucide-react';

export default function ProductSubmission() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    productName: '', category: '', quantity: '', unit: 'kg', price: '', description: '', harvestDate: '', organic: false,
  });

  const update = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Submission Received!</h2>
          <p className="text-gray-500 text-sm mt-2">Your product has been submitted for admin approval.<br />You'll be notified once reviewed.</p>
          <button onClick={() => { setSubmitted(false); setForm({ productName: '', category: '', quantity: '', unit: 'kg', price: '', description: '', harvestDate: '', organic: false }); }}
            className="mt-6 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition text-sm font-medium">
            Submit Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Submit Product</h1>
        <p className="text-gray-500 text-sm">Submit your produce for admin review and marketplace listing</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Product Name *</label>
            <input required value={form.productName} onChange={e => update('productName', e.target.value)}
              placeholder="e.g. Organic Tomatoes"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Category *</label>
            <select required value={form.category} onChange={e => update('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Select Category</option>
              {['Vegetables', 'Fruits', 'Grains', 'Spices', 'Pulses', 'Dairy', 'Other'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Quantity Available *</label>
            <div className="flex gap-2">
              <input required type="number" min="1" value={form.quantity} onChange={e => update('quantity', e.target.value)}
                placeholder="e.g. 200"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              <select value={form.unit} onChange={e => update('unit', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['kg', 'g', 'ton', 'litre', 'dozen', 'piece'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Suggested Price (₹) *</label>
            <input required type="number" min="1" value={form.price} onChange={e => update('price', e.target.value)}
              placeholder="per kg/unit"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Harvest Date</label>
            <input type="date" value={form.harvestDate} onChange={e => update('harvestDate', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input type="checkbox" id="organic" checked={form.organic as boolean} onChange={e => update('organic', e.target.checked)}
              className="w-4 h-4 text-green-600 rounded" />
            <label htmlFor="organic" className="text-sm font-medium text-gray-700">Certified Organic 🌿</label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
            placeholder="Describe your product quality, growing method, etc."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
        </div>

        {/* Upload placeholder */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-green-400 transition cursor-pointer">
          <Upload size={24} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Click to upload product photos</p>
          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB each</p>
        </div>

        <button type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-600 transition">
          <Package size={18} /> Submit for Approval
        </button>
      </form>
    </div>
  );
}
