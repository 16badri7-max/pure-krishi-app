import React, { useState } from 'react';
import { 
  CalendarRange, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Wheat, 
  Building2, 
  Tractor,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { CropPlanAllocation, BuyerRequirementItem, CropRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const CropPlanningView: React.FC = () => {
  const { state, store } = useStore();
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>(state.requirements[0]?.id || '');
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  
  // Allocation Modal State
  const [targetReqItem, setTargetReqItem] = useState<{
    itemId: string;
    productName: string;
    buyerName: string;
    neededKg: number;
    targetDate: string;
  } | null>(null);

  const [selectedCropRecordId, setSelectedCropRecordId] = useState<string>('');
  const [allocatingQuantityKg, setAllocatingQuantityKg] = useState<number>(500);

  const activeRequirement = state.requirements.find(r => r.id === selectedRequirementId) || state.requirements[0];

  const handleOpenAllocation = (item: BuyerRequirementItem, buyerName: string) => {
    const unallocated = Math.max(0, item.requiredQuantity - (item.allocatedFarmerQuantity || 0));
    setTargetReqItem({
      itemId: item.id,
      productName: item.productName,
      buyerName,
      neededKg: unallocated,
      targetDate: item.requiredDeliveryDate,
    });
    setAllocatingQuantityKg(unallocated > 0 ? unallocated : item.requiredQuantity);
    
    // Find candidate crops that match product name or category
    const candidate = state.crops.find(c => 
      c.cropName.toLowerCase().includes(item.productName.toLowerCase()) ||
      item.productName.toLowerCase().includes(c.cropName.toLowerCase())
    );
    if (candidate) {
      setSelectedCropRecordId(candidate.id);
    } else if (state.crops.length > 0) {
      setSelectedCropRecordId(state.crops[0].id);
    }

    setIsAllocateModalOpen(true);
  };

  const handleConfirmAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReqItem || !selectedCropRecordId) return;

    const crop = state.crops.find(c => c.id === selectedCropRecordId);
    if (!crop) return;

    store.allocateFarmerToDemand({
      requirementItemId: targetReqItem.itemId,
      buyerName: targetReqItem.buyerName,
      cropRecordId: crop.id,
      farmerId: crop.farmerId,
      farmerName: crop.farmerName,
      cropName: crop.cropName,
      allocatedQuantityKg: allocatingQuantityKg,
      targetHarvestDate: crop.expectedHarvestDate,
      estimatedDeliveryDate: targetReqItem.targetDate,
      status: 'Confirmed',
    });

    setIsAllocateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Demand-Based Crop Planning & Farmer Allocation
            </h1>
            <span className="bg-[#176B45] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Core Business Intelligence
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Pure Krishi maps supermarket bulk demand directly to verified organic farmer acreage, eliminating speculative cultivation risks.
          </p>
        </div>
      </div>

      {/* Select Requirement Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#176B45]/15 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-[#17231C] uppercase tracking-wider mb-1">
              Select Supermarket Procurement Demand:
            </label>
            <select
              value={selectedRequirementId}
              onChange={(e) => setSelectedRequirementId(e.target.value)}
              className="text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white font-semibold text-[#176B45] w-full sm:w-96 focus:ring-2 focus:ring-[#176B45]"
            >
              {state.requirements.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.buyerName} — {req.items.length} Products ({req.status})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#66736A]">
            <span className="px-3 py-1.5 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 font-semibold text-[#17231C]">
              Delivery Location: {activeRequirement?.deliveryLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Product Items Demand vs Production Gap Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#17231C] uppercase tracking-wider flex items-center space-x-2">
          <span>Supermarket Demand Breakdown & Farmer Supply Matching</span>
          <Sparkles className="w-4 h-4 text-emerald-600" />
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {activeRequirement?.items.map((item) => {
            const allocated = item.allocatedFarmerQuantity || 0;
            const shortage = Math.max(0, item.requiredQuantity - allocated);
            const percentFilled = Math.min(100, Math.round((allocated / item.requiredQuantity) * 100));
            const isFull = percentFilled >= 100;

            // Find matching candidate crops across all farmers
            const candidateCrops = state.crops.filter(c => 
              c.cropName.toLowerCase().includes(item.productName.toLowerCase()) ||
              item.productName.toLowerCase().includes(c.cropName.toLowerCase())
            );

            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-[#17231C]">{item.productName}</h4>
                      <Badge variant={isFull ? 'green' : shortage > 0 ? 'amber' : 'neutral'}>
                        {isFull ? '100% Sourced' : `${shortage} ${item.unit} Supply Shortage`}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#66736A] mt-0.5">
                      Spec: <strong className="text-gray-800">{item.qualityGrade}</strong> | {item.organicRequirement} | Cadence: {item.frequency}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-sm font-extrabold text-[#17231C]">
                      Target: {item.requiredQuantity.toLocaleString()} {item.unit}
                    </div>
                    <p className="text-xs text-[#176B45] font-semibold">
                      Allocated: {allocated.toLocaleString()} {item.unit} ({percentFilled}%)
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isFull ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Matching Farmers and Available Capacity */}
                <div className="bg-[#FAF8F0] rounded-xl p-3 border border-[#176B45]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#104D35] uppercase">
                      Candidate Organic Farmers Growing this Crop ({candidateCrops.length})
                    </span>
                    <button
                      onClick={() => handleOpenAllocation(item, activeRequirement.buyerName)}
                      className="px-3 py-1 bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Allocate Farmer Capacity</span>
                    </button>
                  </div>

                  {candidateCrops.length === 0 ? (
                    <div className="p-3 text-center text-xs text-amber-800 bg-amber-50 rounded-lg border border-amber-200">
                      ⚠️ No existing registered crop record currently matches "{item.productName}". Go to Land Discovery to onboard an organic grower with suitable soil for this crop.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {candidateCrops.map((crop) => (
                        <div key={crop.id} className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-800">{crop.farmerName}</span>
                            <p className="text-[10px] text-gray-500">
                              Yield: {crop.expectedYieldKg.toLocaleString()} kg | Harvest: {crop.expectedHarvestDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-700 text-[11px]">
                              {crop.surplusKg.toLocaleString()} kg Surplus
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Committed Allocations Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#17231C] font-display">
          All Active Pure Krishi Crop Supply Plans ({state.allocations.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F0] text-[#66736A] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-3 py-2.5">Buyer Contract</th>
                <th className="px-3 py-2.5">Target Crop</th>
                <th className="px-3 py-2.5">Assigned Farmer</th>
                <th className="px-3 py-2.5">Committed Volume</th>
                <th className="px-3 py-2.5">Target Harvest</th>
                <th className="px-3 py-2.5">Estimated Dispatch</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {state.allocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-bold text-[#17231C]">{alloc.buyerName}</td>
                  <td className="px-3 py-2.5 text-[#104D35] font-semibold">{alloc.cropName}</td>
                  <td className="px-3 py-2.5 text-gray-700">{alloc.farmerName}</td>
                  <td className="px-3 py-2.5 font-bold">{alloc.allocatedQuantityKg.toLocaleString()} kg</td>
                  <td className="px-3 py-2.5 font-mono text-gray-600">{alloc.targetHarvestDate}</td>
                  <td className="px-3 py-2.5 font-mono text-emerald-700">{alloc.estimatedDeliveryDate}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant="green">{alloc.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {targetReqItem && (
        <Modal
          isOpen={isAllocateModalOpen}
          onClose={() => setIsAllocateModalOpen(false)}
          title={`Allocate Farmer to ${targetReqItem.productName}`}
          subtitle={`Fulfilling contracted demand for ${targetReqItem.buyerName}`}
        >
          <form onSubmit={handleConfirmAllocation} className="space-y-4">
            <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 text-xs space-y-1">
              <p><strong>Required Product:</strong> {targetReqItem.productName}</p>
              <p><strong>Unallocated Quantity:</strong> {targetReqItem.neededKg} kg</p>
              <p><strong>Target Supermarket Delivery:</strong> {targetReqItem.targetDate}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Select Organic Farmer Crop Record *
              </label>
              <select
                value={selectedCropRecordId}
                onChange={(e) => setSelectedCropRecordId(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                {state.crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cropName} ({c.farmerName}) — {c.surplusKg} kg Surplus Available (Harvest: {c.expectedHarvestDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Allocated Quantity (kg) *
              </label>
              <input
                type="number"
                required
                min="10"
                value={allocatingQuantityKg}
                onChange={(e) => setAllocatingQuantityKg(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAllocateModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
              >
                Confirm Allocation & Plan Cultivation
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
