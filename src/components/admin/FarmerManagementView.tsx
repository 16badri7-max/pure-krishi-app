import React, { useState } from 'react';
import { 
  Tractor, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Wheat, 
  BadgeIndianRupee, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Farmer } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const FarmerManagementView: React.FC = () => {
  const { state, store } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Farmer Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    village: '',
    district: '',
    state: 'Maharashtra',
    totalAcres: 10,
    farmingPractices: 'Certified Organic (NPOP)',
    mainCrops: 'Tomatoes, Onions',
  });

  const filteredFarmers = state.farmers.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.mainCrops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = filterState === 'all' || f.state === filterState;
    return matchesSearch && matchesState;
  });

  const handleCreateFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    store.addFarmer({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      village: formData.village,
      district: formData.district,
      state: formData.state,
      totalAcres: Number(formData.totalAcres),
      farmingPractices: formData.farmingPractices,
      mainCrops: formData.mainCrops.split(',').map(s => s.trim()),
      farms: [],
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      village: '',
      district: '',
      state: 'Maharashtra',
      totalAcres: 10,
      farmingPractices: 'Certified Organic (NPOP)',
      mainCrops: 'Tomatoes, Onions',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Organic Farmer Partners & Cooperatives
            </h1>
            <span className="bg-[#F0F7F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#DCECDC]">
              NPOP & Natural Farming
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Registered farmers whose cultivated land and harvest capacity are matched directly to contracted supermarket demand.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by farmer name, district, crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#176B45] bg-white"
          >
            <option value="all">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-[#F0F7F0] text-[#176B45] flex items-center justify-center font-bold text-base border border-[#DCECDC]">
                  {farmer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17231C]">{farmer.name}</h3>
                  <p className="text-xs text-[#66736A] flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
                  </p>
                </div>
              </div>
              <Badge variant="green">{farmer.totalAcres} Acres</Badge>
            </div>

            <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#66736A]">Farming Practice:</span>
                <span className="font-semibold text-[#104D35]">{farmer.farmingPractices}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#66736A]">Key Crops:</span>
                <span className="font-semibold text-[#17231C]">{farmer.mainCrops.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200">
                <span className="text-[#66736A]">Total Pure Krishi Earnings:</span>
                <span className="font-bold text-[#104D35]">₹{farmer.totalEarnings.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#66736A]">Pending Payout:</span>
                <span className="font-bold text-amber-700">₹{farmer.pendingPayment.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-3 text-[#66736A]">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>{farmer.phone}</span>
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#176B45] bg-[#F0F7F0] px-2 py-0.5 rounded border border-[#DCECDC]">
                {farmer.farms.length} Farm Parcels Registered
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Farmer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Organic Farmer"
        subtitle="Record farmer background, cultivation land size, and natural farming methods."
      >
        <form onSubmit={handleCreateFarmer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Farmer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patil"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 94XXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Village *</label>
              <input
                type="text"
                required
                placeholder="Dindori"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">District *</label>
              <input
                type="text"
                required
                placeholder="Nashik"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Total Land Area (Acres) *</label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                value={formData.totalAcres}
                onChange={(e) => setFormData({ ...formData, totalAcres: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Farming Practice</label>
              <select
                value={formData.farmingPractices}
                onChange={(e) => setFormData({ ...formData, farmingPractices: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Certified Organic (NPOP)">Certified Organic (NPOP)</option>
                <option value="Natural Farming (ZBNF)">Natural Farming (ZBNF)</option>
                <option value="Pesticide Free">Pesticide Free</option>
                <option value="Regenerative Agriculture">Regenerative Agriculture</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17231C] mb-1">Main Crops (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Tomatoes, Onions, Spinach"
              value={formData.mainCrops}
              onChange={(e) => setFormData({ ...formData, mainCrops: e.target.value })}
              className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
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
              Register Farmer Profile
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
