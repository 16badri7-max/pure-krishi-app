import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Trash2,
  Building2,
  Wheat
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { BuyerRequirementItem } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const BuyerRequirementsView: React.FC = () => {
  const { state, store } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Requirement Form State
  const [targetBuyerId, setTargetBuyerId] = useState<string>(state.buyers[0]?.id || '');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Central DC, Bhiwandi, Maharashtra');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  
  const [items, setItems] = useState<Array<Omit<BuyerRequirementItem, 'id' | 'allocatedFarmerQuantity' | 'status'>>>([
    {
      productName: 'Organic Desi Tomatoes',
      category: 'Vegetables',
      requiredQuantity: 1000,
      unit: 'kg',
      frequency: 'Weekly',
      expectedPriceRange: '₹35 - ₹42 / kg',
      qualityGrade: 'Grade A Premium',
      organicRequirement: '100% Certified Organic',
      packaging: 'Crates',
      requiredDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  ]);

  const handleAddItemRow = () => {
    setItems([
      ...items,
      {
        productName: '',
        category: 'Vegetables',
        requiredQuantity: 500,
        unit: 'kg',
        frequency: 'Weekly',
        expectedPriceRange: '₹30 - ₹40 / kg',
        qualityGrade: 'Grade A',
        organicRequirement: 'Naturally Grown / Zero Chemical',
        packaging: 'Crates',
        requiredDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    setItems(updated);
  };

  const handleSubmitRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const buyer = state.buyers.find(b => b.id === targetBuyerId) || state.buyers[0];
    
    const formattedItems: BuyerRequirementItem[] = items.map((item, idx) => ({
      ...item,
      id: `req-item-${Date.now()}-${idx}`,
      allocatedFarmerQuantity: 0,
      status: 'Pending',
    }));

    store.addBuyerRequirement({
      buyerId: buyer.id,
      buyerName: buyer.businessName,
      deliveryLocation,
      items: formattedItems,
      additionalInstructions,
      status: 'Submitted',
    });

    setIsAddModalOpen(false);
    setAdditionalInstructions('');
  };

  const filteredRequirements = state.requirements.filter((req) => {
    const matchesSearch = 
      req.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBuyer = selectedBuyerId === 'all' || req.buyerId === selectedBuyerId;
    return matchesSearch && matchesBuyer;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Supermarket Product Requirements
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Live Sourcing Demands
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Supermarket buyers submit precise product specifications, delivery cadences, and quality grades prior to farmer allocation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Buyer Requirement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by buyer, product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#66736A]" />
          <select
            value={selectedBuyerId}
            onChange={(e) => setSelectedBuyerId(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#176B45] bg-white"
          >
            <option value="all">All Supermarkets</option>
            {state.buyers.map((b) => (
              <option key={b.id} value={b.id}>{b.businessName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-700">No buyer requirements found</h3>
            <p className="text-xs text-gray-500 mt-1">Submit a new procurement requirement from a supermarket partner.</p>
          </div>
        ) : (
          filteredRequirements.map((req) => (
            <div 
              key={req.id} 
              className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#176B45]" />
                    <h3 className="text-sm font-bold text-[#17231C]">{req.buyerName}</h3>
                    <Badge variant={req.status === 'Farmer Matched' ? 'green' : 'amber'}>
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#66736A] flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>Delivery Location: {req.deliveryLocation}</span>
                  </p>
                </div>
                <div className="text-xs text-[#66736A] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Requirement Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F0] text-[#66736A] uppercase font-bold text-[10px] rounded-lg">
                    <tr>
                      <th className="px-3 py-2 rounded-l-lg">Product Required</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Quantity</th>
                      <th className="px-3 py-2">Frequency</th>
                      <th className="px-3 py-2">Quality & Standard</th>
                      <th className="px-3 py-2">Target Date</th>
                      <th className="px-3 py-2">Farmer Sourced</th>
                      <th className="px-3 py-2 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {req.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 font-bold text-[#17231C]">
                          {item.productName}
                          <div className="text-[10px] font-normal text-gray-500">
                            Target: {item.expectedPriceRange}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{item.category}</td>
                        <td className="px-3 py-2.5 font-bold text-[#104D35]">
                          {item.requiredQuantity} {item.unit}
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{item.frequency}</td>
                        <td className="px-3 py-2.5">
                          <div className="font-semibold text-xs text-[#176B45]">{item.qualityGrade}</div>
                          <div className="text-[10px] text-gray-500">{item.organicRequirement}</div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-600">{item.requiredDeliveryDate}</td>
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-xs">
                            {item.allocatedFarmerQuantity || 0} / {item.requiredQuantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant={item.status === 'Sourced' ? 'green' : item.status === 'Partially Sourced' ? 'amber' : 'neutral'}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {req.additionalInstructions && (
                <div className="text-xs bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10 text-[#66736A]">
                  <strong className="text-[#17231C]">Buyer Packaging Instructions:</strong> {req.additionalInstructions}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Buyer Requirement Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Submit Supermarket Product Requirements"
        subtitle="Collect multi-product bulk demand with strict quality and frequency criteria."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmitRequirement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Select Supermarket / Buyer *
              </label>
              <select
                value={targetBuyerId}
                onChange={(e) => setTargetBuyerId(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-white font-medium"
              >
                {state.buyers.map((b) => (
                  <option key={b.id} value={b.id}>{b.businessName} ({b.city})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Delivery Location / Hub *
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Central Hub / Supermarket Loading Bay"
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          {/* Multiple Products Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#17231C] uppercase tracking-wider">
                Required Agricultural Products ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-bold text-[#176B45] hover:text-[#104D35] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Crop</span>
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-2 relative"
                >
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Heirloom Tomatoes"
                        value={item.productName}
                        onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                        className="w-full text-xs rounded-lg border border-gray-200 px-2.5 py-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-white"
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Spices">Spices</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Quantity</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.requiredQuantity}
                          onChange={(e) => handleItemChange(idx, 'requiredQuantity', Number(e.target.value))}
                          className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Unit</label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-white"
                        >
                          <option value="kg">kg</option>
                          <option value="tonnes">tonnes</option>
                          <option value="quintals">quintals</option>
                          <option value="crates">crates</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Frequency</label>
                      <select
                        value={item.frequency}
                        onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                        className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-white"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="One-Time">One-Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Quality Grade</label>
                      <select
                        value={item.qualityGrade}
                        onChange={(e) => handleItemChange(idx, 'qualityGrade', e.target.value)}
                        className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-white"
                      >
                        <option value="Grade A Premium">Grade A Premium</option>
                        <option value="Grade A">Grade A</option>
                        <option value="Grade B Standard">Grade B Standard</option>
                        <option value="Export Quality">Export Quality</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Target Delivery Date</label>
                      <input
                        type="date"
                        required
                        value={item.requiredDeliveryDate}
                        onChange={(e) => handleItemChange(idx, 'requiredDeliveryDate', e.target.value)}
                        className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17231C] mb-1">
              Packaging & Quality Guidelines
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Ventilated crates, temperature below 15°C, no synthetic chemical residue."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
            >
              Submit Requirements to Procurement Pipeline
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
