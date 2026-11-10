import React, { useState } from 'react';
import { 
  Wheat, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Calendar,
  Warehouse,
  Tractor
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { HarvestBatch } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const HarvestManagementView: React.FC = () => {
  const { state, store } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [viewBatch, setViewBatch] = useState<HarvestBatch | null>(null);

  // New Harvest Batch Form State
  const [newBatch, setNewBatch] = useState({
    farmerId: state.farmers[0]?.id || '',
    farmId: state.farms[0]?.id || '',
    cropName: 'Desi Organic Tomatoes (Heirloom)',
    harvestDate: new Date().toISOString().split('T')[0],
    harvestQuantity: 1500,
    unit: 'kg' as 'kg' | 'quintals',
    expectedGrade: 'Grade A Premium' as HarvestBatch['expectedGrade'],
    storageRequirements: 'Cool Dry Storage (12°C - 15°C), 85% RH',
    assignedWarehouseId: state.warehouses[0]?.id || '',
    photos: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const filteredBatches = state.harvestBatches.filter((b) => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = state.farmers.find(f => f.id === newBatch.farmerId) || state.farmers[0];
    
    store.logHarvestBatch({
      ...newBatch,
      farmerName: farmer.name,
    });

    setIsAddBatchOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Harvest Batch Registration & Inbound Intake
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Farm-to-Fork Batch Tracking
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Every harvest event is assigned a unique batch identifier, linked to farm soil records, and dispatched for quality inspection.
          </p>
        </div>

        <button
          onClick={() => setIsAddBatchOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Harvest Batch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search batch ID, crop, farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">All Batch Statuses</option>
            <option value="Harvested">Harvested</option>
            <option value="Under Inspection">Under Inspection</option>
            <option value="Approved">Approved</option>
            <option value="In Warehouse">In Warehouse</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-[#176B45]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F0] border-b border-gray-200 text-[#66736A] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Harvest Batch ID</th>
                <th className="px-4 py-3">Crop Harvested</th>
                <th className="px-4 py-3">Farmer & Farm</th>
                <th className="px-4 py-3">Harvest Date</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Expected Grade</th>
                <th className="px-4 py-3">Assigned Agro-Hub</th>
                <th className="px-4 py-3">QC Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBatches.map((batch) => {
                const wh = state.warehouses.find(w => w.id === batch.assignedWarehouseId);
                return (
                  <tr key={batch.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#176B45]">
                      {batch.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#17231C]">{batch.cropName}</div>
                      <div className="text-[10px] text-gray-500">{batch.storageRequirements}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#17231C]">{batch.farmerName}</div>
                      <div className="text-[10px] text-gray-500">{batch.farmId}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{batch.harvestDate}</td>
                    <td className="px-4 py-3 font-extrabold text-[#104D35]">
                      {batch.harvestQuantity.toLocaleString()} {batch.unit}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{batch.expectedGrade}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[140px]">
                      {wh?.name.replace('Pure Krishi ', '') || 'Central Agro-Hub'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={batch.status === 'Approved' || batch.status === 'In Warehouse' ? 'green' : batch.status === 'Under Inspection' ? 'blue' : 'amber'}>
                        {batch.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setViewBatch(batch)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#176B45] hover:bg-[#F0F7F0] transition-colors"
                        title="View Batch Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Batch Details Modal */}
      {viewBatch && (
        <Modal
          isOpen={Boolean(viewBatch)}
          onClose={() => setViewBatch(null)}
          title={`Harvest Batch Dossier: ${viewBatch.id}`}
          subtitle="Complete traceability and provenance records from field to cold chain."
        >
          <div className="space-y-4">
            <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={viewBatch.photos[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'}
                alt={viewBatch.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded">
                Logged at Field: {viewBatch.harvestDate} | {viewBatch.farmerName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                <span className="text-[10px] text-gray-500 block">Harvest Quantity</span>
                <strong className="text-sm font-bold text-[#104D35]">{viewBatch.harvestQuantity} {viewBatch.unit}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                <span className="text-[10px] text-gray-500 block">Quality Status</span>
                <strong className="text-sm font-bold text-[#176B45]">{viewBatch.status}</strong>
              </div>
            </div>

            <div className="text-xs space-y-1 text-gray-600">
              <p><strong>Storage & Atmosphere:</strong> {viewBatch.storageRequirements}</p>
              <p><strong>Inspection Link:</strong> {viewBatch.qualityInspectionId || 'Pending Inspection by QC Team'}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewBatch(null)}
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Harvest Modal */}
      <Modal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
        title="Record Farm Harvest Intake"
        subtitle="Generate unique batch identification for incoming produce."
      >
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Farmer *</label>
              <select
                value={newBatch.farmerId}
                onChange={(e) => setNewBatch({ ...newBatch, farmerId: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                {state.farmers.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.district})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Harvested Crop *</label>
              <input
                type="text"
                required
                value={newBatch.cropName}
                onChange={(e) => setNewBatch({ ...newBatch, cropName: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Harvest Date</label>
              <input
                type="date"
                required
                value={newBatch.harvestDate}
                onChange={(e) => setNewBatch({ ...newBatch, harvestDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Harvest Quantity</label>
              <input
                type="number"
                required
                value={newBatch.harvestQuantity}
                onChange={(e) => setNewBatch({ ...newBatch, harvestQuantity: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Unit</label>
              <select
                value={newBatch.unit}
                onChange={(e) => setNewBatch({ ...newBatch, unit: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="kg">kg</option>
                <option value="quintals">quintals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Expected Grade</label>
              <select
                value={newBatch.expectedGrade}
                onChange={(e) => setNewBatch({ ...newBatch, expectedGrade: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Grade A Premium">Grade A Premium</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Assigned Agro-Hub</label>
              <select
                value={newBatch.assignedWarehouseId}
                onChange={(e) => setNewBatch({ ...newBatch, assignedWarehouseId: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                {state.warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17231C] mb-1">Cold Chain / Storage Protocol</label>
            <input
              type="text"
              value={newBatch.storageRequirements}
              onChange={(e) => setNewBatch({ ...newBatch, storageRequirements: e.target.value })}
              className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddBatchOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
            >
              Save Batch Record
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
