import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Droplets, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  Maximize2,
  Compass,
  Tractor
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Farm } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const LandDiscoveryView: React.FC = () => {
  const { state, store } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPractice, setFilterPractice] = useState('all');
  const [filterWater, setFilterWater] = useState('all');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(state.farms[0] || null);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);

  // New Farm Form State
  const [newFarm, setNewFarm] = useState({
    farmerId: state.farmers[0]?.id || '',
    farmName: '',
    village: '',
    district: '',
    state: 'Maharashtra',
    totalLandAreaAcres: 5,
    cultivatedAreaAcres: 4.5,
    ownershipType: 'Owned' as Farm['ownershipType'],
    waterSource: 'Borewell' as Farm['waterSource'],
    farmingPractice: 'Certified Organic' as Farm['farmingPractice'],
    soilType: 'Black Cotton Soil' as Farm['soilType'],
    soilPh: 6.8,
    organicCarbonPercentage: 0.85,
    latitude: 19.9975,
    longitude: 73.7898,
    photos: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const filteredFarms = state.farms.filter((f) => {
    const matchesSearch = 
      f.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPractice = filterPractice === 'all' || f.farmingPractice === filterPractice;
    const matchesWater = filterWater === 'all' || f.waterSource === filterWater;
    return matchesSearch && matchesPractice && matchesWater;
  });

  const handleVerifyFarm = (farmId: string, status: Farm['verificationStatus']) => {
    store.verifyFarm(farmId, status);
    if (selectedFarm && selectedFarm.id === farmId) {
      setSelectedFarm({ ...selectedFarm, verificationStatus: status });
    }
  };

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    const created = store.addFarm({
      ...newFarm,
      verificationStatus: 'Pending Verification',
    });
    setSelectedFarm(created);
    setIsAddFarmOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Land & Cultivated Farm Discovery
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Verified Soil & Water Assets
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Discover verified agricultural land parcels to match against incoming supermarket purchase requirements.
          </p>
        </div>

        <button
          onClick={() => setIsAddFarmOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Farm Parcel</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search farm name, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterPractice}
            onChange={(e) => setFilterPractice(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">All Farming Practices</option>
            <option value="Certified Organic">Certified Organic</option>
            <option value="Natural Farming (ZBNF)">Natural Farming (ZBNF)</option>
            <option value="Pesticide Free">Pesticide Free</option>
            <option value="Regenerative Agriculture">Regenerative Agriculture</option>
          </select>

          <select
            value={filterWater}
            onChange={(e) => setFilterWater(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">All Water Sources</option>
            <option value="Borewell">Borewell</option>
            <option value="Canal Irrigation">Canal Irrigation</option>
            <option value="River">River</option>
            <option value="Rainfed">Rainfed</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: Map Simulation & Farm Directory List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Farm Directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17231C] uppercase tracking-wider">
              Discovered Farm Parcels ({filteredFarms.length})
            </span>
            <span className="text-xs text-[#66736A]">Click parcel to inspect agronomic data</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredFarms.map((farm) => {
              const isSelected = selectedFarm?.id === farm.id;
              const farmer = state.farmers.find(f => f.id === farm.farmerId);
              return (
                <div
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0F7F0] border-[#176B45] shadow-md ring-1 ring-[#176B45]'
                      : 'bg-white border-[#176B45]/15 hover:border-[#176B45]/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-[#17231C]">{farm.farmName}</h4>
                        <Badge variant={farm.verificationStatus === 'Verified by Pure Krishi' ? 'green' : 'amber'}>
                          {farm.verificationStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#66736A] mt-0.5 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{farm.village}, {farm.district}, {farm.state}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#104D35]">
                        {farm.cultivatedAreaAcres} / {farm.totalLandAreaAcres} Acres
                      </span>
                      <p className="text-[10px] text-gray-500">Cultivated / Total</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white/70 p-2.5 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Soil Type</span>
                      <strong className="text-gray-800">{farm.soilType}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Soil pH</span>
                      <strong className="text-emerald-700">{farm.soilPh || '6.8'} (Optimal)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Organic Carbon</span>
                      <strong className="text-emerald-700">{farm.organicCarbonPercentage}%</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Water Source</span>
                      <strong className="text-gray-800">{farm.waterSource}</strong>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#66736A]">
                    <span>Farmer: <strong className="text-[#17231C]">{farmer?.name || 'Partner Farmer'}</strong></span>
                    <span className="text-[11px] font-semibold text-[#176B45]">
                      GPS: {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Agronomic Detail & Visual Coordinates */}
        <div className="lg:col-span-5 space-y-4">
          {selectedFarm ? (
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4 sticky top-20">
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Parcel Code: {selectedFarm.id}</span>
                  <h3 className="text-base font-bold text-[#17231C] font-display mt-0.5">
                    {selectedFarm.farmName}
                  </h3>
                  <p className="text-xs text-[#66736A]">
                    {selectedFarm.village}, {selectedFarm.district}, {selectedFarm.state}
                  </p>
                </div>
                <Badge variant={selectedFarm.verificationStatus === 'Verified by Pure Krishi' ? 'green' : 'amber'}>
                  {selectedFarm.verificationStatus}
                </Badge>
              </div>

              {/* Farm Photo Simulation */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={selectedFarm.photos[0] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedFarm.farmName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded">
                  GPS Coordinates: {selectedFarm.latitude}° N, {selectedFarm.longitude}° E
                </div>
              </div>

              {/* Verified Agronomic Parameters */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#17231C] uppercase tracking-wider">
                  Verified Soil & Production Capacity
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Cultivation Practice</span>
                    <strong className="text-[#104D35]">{selectedFarm.farmingPractice}</strong>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Land Tenure</span>
                    <strong className="text-gray-800">{selectedFarm.ownershipType}</strong>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Irrigation Reliability</span>
                    <strong className="text-gray-800">{selectedFarm.waterSource}</strong>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Soil Organic Matter</span>
                    <strong className="text-emerald-700">{selectedFarm.organicCarbonPercentage}% (High Fertility)</strong>
                  </div>
                </div>
              </div>

              {/* Verification Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Inspection & Audit:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVerifyFarm(selectedFarm.id, 'Verified by Pure Krishi')}
                    className="px-3 py-1.5 text-xs font-bold bg-[#176B45] hover:bg-[#104D35] text-white rounded-lg shadow-sm transition-all"
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => handleVerifyFarm(selectedFarm.id, 'Inspection Scheduled')}
                    className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all"
                  >
                    Schedule Audit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Select a farm parcel to view certified soil diagnostics and GPS records.</p>
            </div>
          )}
        </div>

      </div>

      {/* Register Farm Modal */}
      <Modal
        isOpen={isAddFarmOpen}
        onClose={() => setIsAddFarmOpen(false)}
        title="Register Agricultural Cultivated Land Parcel"
        subtitle="Record geo-tagged coordinates, soil fertility parameters, and water source."
      >
        <form onSubmit={handleCreateFarm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Assigned Farmer *</label>
              <select
                value={newFarm.farmerId}
                onChange={(e) => setNewFarm({ ...newFarm, farmerId: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                {state.farmers.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.district})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Farm Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kaveri Green Springs Estate"
                value={newFarm.farmName}
                onChange={(e) => setNewFarm({ ...newFarm, farmName: e.target.value })}
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
                value={newFarm.village}
                onChange={(e) => setNewFarm({ ...newFarm, village: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">District *</label>
              <input
                type="text"
                required
                value={newFarm.district}
                onChange={(e) => setNewFarm({ ...newFarm, district: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">State</label>
              <input
                type="text"
                value={newFarm.state}
                onChange={(e) => setNewFarm({ ...newFarm, state: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Cultivated Acres *</label>
              <input
                type="number"
                required
                step="0.5"
                value={newFarm.cultivatedAreaAcres}
                onChange={(e) => setNewFarm({ ...newFarm, cultivatedAreaAcres: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Water Source</label>
              <select
                value={newFarm.waterSource}
                onChange={(e) => setNewFarm({ ...newFarm, waterSource: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Borewell">Borewell</option>
                <option value="Canal Irrigation">Canal Irrigation</option>
                <option value="River">River</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Farming Practice</label>
              <select
                value={newFarm.farmingPractice}
                onChange={(e) => setNewFarm({ ...newFarm, farmingPractice: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Certified Organic">Certified Organic</option>
                <option value="Natural Farming (ZBNF)">Natural Farming (ZBNF)</option>
                <option value="Pesticide Free">Pesticide Free</option>
                <option value="Regenerative Agriculture">Regenerative Agriculture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Soil Type</label>
              <select
                value={newFarm.soilType}
                onChange={(e) => setNewFarm({ ...newFarm, soilType: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFarm.soilPh}
                  onChange={(e) => setNewFarm({ ...newFarm, soilPh: Number(e.target.value) })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Organic Carbon %</label>
                <input
                  type="number"
                  step="0.05"
                  value={newFarm.organicCarbonPercentage}
                  onChange={(e) => setNewFarm({ ...newFarm, organicCarbonPercentage: Number(e.target.value) })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddFarmOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
            >
              Save Cultivated Land Parcel
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
