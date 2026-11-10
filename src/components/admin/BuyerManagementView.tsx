import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Kanban,
  Table as TableIcon,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Buyer, BuyerType, ProcurementStage } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const BuyerManagementView: React.FC = () => {
  const { state, store } = useStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    businessName: string;
    buyerType: BuyerType;
    contactPerson: string;
    procurementManager: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    gstNumber: string;
    preferredCommunication: 'Email' | 'Phone' | 'WhatsApp';
    stage: ProcurementStage;
  }>({
    businessName: '',
    buyerType: 'Supermarkets',
    contactPerson: '',
    procurementManager: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    gstNumber: '',
    preferredCommunication: 'Email',
    stage: 'Lead Identified',
  });

  const stages: ProcurementStage[] = [
    'Lead Identified',
    'Contacted',
    'Meeting Scheduled',
    'Requirements Collected',
    'Quotation Submitted',
    'Negotiation',
    'Trial Order',
    'Agreement Signed',
    'Active Buyer',
    'Supply in Progress',
  ];

  const filteredBuyers = state.buyers.filter((b) => {
    const matchesSearch = 
      b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || b.buyerType === filterType;
    return matchesSearch && matchesType;
  });

  const handleStageChange = (buyerId: string, newStage: ProcurementStage) => {
    store.updateBuyerStage(buyerId, newStage);
  };

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.phone || !formData.email) return;

    store.addBuyer(formData);
    setIsAddModalOpen(false);
    setFormData({
      businessName: '',
      buyerType: 'Supermarkets',
      contactPerson: '',
      procurementManager: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      gstNumber: '',
      preferredCommunication: 'Email',
      stage: 'Lead Identified',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              B2B Supermarket & Buyer Management
            </h1>
            <span className="bg-[#F0F7F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#DCECDC]">
              Stage 1 Business Priority
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Identify, register, and onboard retail supermarket procurement managers to establish reliable demand channels.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                viewMode === 'kanban' ? 'bg-white shadow text-[#104D35]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                viewMode === 'table' ? 'bg-white shadow text-[#104D35]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Supermarket</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, city, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#66736A]" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#176B45] bg-white"
          >
            <option value="all">All Buyer Types</option>
            <option value="Supermarkets">Supermarkets</option>
            <option value="Organic Stores">Organic Stores</option>
            <option value="Retail Shops">Retail Shops</option>
            <option value="Hotels">Hotels</option>
            <option value="Distributors">Distributors</option>
          </select>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-3 min-w-[1500px]">
            {stages.map((stage) => {
              const stageBuyers = filteredBuyers.filter((b) => b.stage === stage);
              return (
                <div 
                  key={stage}
                  className="w-72 bg-[#FAF8F0] rounded-2xl p-3 border border-[#176B45]/15 flex flex-col shrink-0"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                    <span className="text-xs font-bold text-[#17231C] truncate max-w-[180px]">
                      {stage}
                    </span>
                    <span className="text-[11px] font-extrabold bg-white px-2 py-0.5 rounded-full border border-gray-200 text-[#176B45]">
                      {stageBuyers.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[580px] pr-1">
                    {stageBuyers.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-gray-400 border border-dashed border-gray-200 rounded-xl">
                        No buyers in this stage
                      </div>
                    ) : (
                      stageBuyers.map((buyer) => (
                        <div
                          key={buyer.id}
                          className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold text-[#17231C] leading-snug">
                              {buyer.businessName}
                            </h4>
                            <span className="text-[10px] bg-[#F0F7F0] text-[#176B45] px-1.5 py-0.5 rounded border border-[#DCECDC] font-semibold shrink-0">
                              {buyer.buyerType}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-[#66736A]">
                            <p className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{buyer.city}, {buyer.state}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{buyer.phone}</span>
                            </p>
                            <p className="font-medium text-[#17231C]">
                              Mgr: {buyer.procurementManager}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#104D35]">
                              ₹{(buyer.totalPurchaseValue / 1000).toFixed(0)}k val
                            </span>

                            {/* Move stage selector */}
                            <select
                              value={buyer.stage}
                              onChange={(e) => handleStageChange(buyer.id, e.target.value as ProcurementStage)}
                              className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-medium text-gray-700"
                            >
                              {stages.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#176B45]/15 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F0] border-b border-gray-200 text-[#66736A] uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">Supermarket / Business</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Procurement Contact</th>
                  <th className="px-4 py-3">City & State</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                  <th className="px-4 py-3">Requirements</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-[#F0F7F0]/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#17231C]">{buyer.businessName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">GST: {buyer.gstNumber || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="green">{buyer.buyerType}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#17231C]">{buyer.procurementManager}</div>
                      <div className="text-[11px] text-[#66736A]">{buyer.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {buyer.city}, {buyer.state}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={buyer.stage}
                        onChange={(e) => handleStageChange(buyer.id, e.target.value as ProcurementStage)}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-semibold text-[#176B45]"
                      >
                        {stages.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#17231C]">
                      {buyer.totalRequirementsCount} Demands
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-bold text-[#104D35]">
                        ₹{buyer.totalPurchaseValue.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard Supermarket Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard Supermarket / Bulk Buyer"
        subtitle="Register business purchasing manager details to begin demand collection."
      >
        <form onSubmit={handleCreateBuyer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Reliance Fresh, Nature's Basket"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Buyer Type
              </label>
              <select
                value={formData.buyerType}
                onChange={(e) => setFormData({ ...formData, buyerType: e.target.value as BuyerType })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-white"
              >
                <option value="Supermarkets">Supermarkets</option>
                <option value="Organic Stores">Organic Stores</option>
                <option value="Retail Shops">Retail Shops</option>
                <option value="Hotels">Hotels</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Distributors">Distributors</option>
                <option value="Institutional Buyers">Institutional Buyers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Contact Person
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Procurement / Purchasing Manager *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VP Fresh Sourcing"
                value={formData.procurementManager}
                onChange={(e) => setFormData({ ...formData, procurementManager: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98XXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Business Email *
              </label>
              <input
                type="email"
                required
                placeholder="procurement@supermarket.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="Mumbai, Bengaluru..."
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                GST Number
              </label>
              <input
                type="text"
                placeholder="27AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17231C] mb-1">
              Delivery / Central Warehouse Address
            </label>
            <textarea
              rows={2}
              placeholder="Full physical address for delivery dispatch..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              Save Supermarket Account
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
