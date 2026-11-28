import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Thermometer, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Edit2
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { InventoryItem } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const WarehouseInventoryView: React.FC = () => {
  const { state, store } = useStore();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Physical audit reconciliation');
  const [isAddWhOpen, setIsAddWhOpen] = useState(false);
  const [whForm, setWhForm] = useState({
    name: '',
    location: '',
    city: '',
    state: 'Maharashtra',
    capacityTonnes: 100,
    occupiedTonnes: 0,
    coldStorageAvailable: true,
    contactPerson: '',
    phone: '',
  });

  const totalAvailableKg = state.inventory.reduce((s, i) => s + i.availableQuantityKg, 0);
  const totalReservedKg = state.inventory.reduce((s, i) => s + i.reservedQuantityKg, 0);
  const threshold = state.platformSettings.lowStockThresholdKg || 50;
  const lowStockRetail = state.products.filter(p => p.availableQuantity <= threshold);
  const pendingStockSubs = state.stockSubmissions.filter(s => s.status === 'pending');

  const filteredInventory = state.inventory.filter((item) => {
    const matchesWarehouse = selectedWarehouseId === 'all' || item.warehouseId === selectedWarehouseId;
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWarehouse && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Warehouse & Cold Storage Operations
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Live Pallet & Bin Inventory
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Track certified inbound harvest batches, temperature-controlled storage, farmer stock approvals, and low-stock alerts.
          </p>
        </div>
        <button
          onClick={() => setIsAddWhOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Agro-Hub Warehouse
        </button>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Total Inventory</span>
          <div className="text-2xl font-extrabold text-[#17231C] mt-1">{(totalAvailableKg + totalReservedKg).toLocaleString()} kg</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Available Stock</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{totalAvailableKg.toLocaleString()} kg</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Reserved Stock</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{totalReservedKg.toLocaleString()} kg</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Low-Stock Products</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{lowStockRetail.length}</div>
        </div>
      </div>

      {/* Workflow 3: Pending Farmer Stock Submissions Queue */}
      {state.stockSubmissions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#17231C] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Farmer Stock & Harvest Submissions ({pendingStockSubs.length} Pending Approval)
              </h3>
              <p className="text-[11px] text-[#66736A]">
                Farmers submit harvest stock additions for Admin review. Approving updates official inventory & customer availability.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.stockSubmissions.map(sub => (
              <div key={sub.id} className="p-3.5 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#17231C]">{sub.productName}</strong>
                    <Badge variant={sub.status === 'approved' ? 'green' : sub.status === 'rejected' ? 'red' : 'amber'}>
                      {sub.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    +{sub.submittedQuantity} {sub.unit} by <strong>{sub.farmerName}</strong> • Harvest: {sub.harvestDate}
                  </p>
                  {sub.notes && <p className="text-[10px] text-gray-500 mt-0.5">{sub.notes}</p>}
                </div>
                {sub.status === 'pending' && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => void centralApi.adminReviewStockSubmission(sub.id, 'approved', 'Verified and added to live inventory.')}
                      className="px-2.5 py-1.5 bg-[#176B45] hover:bg-[#104D35] text-white font-bold rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => void centralApi.adminReviewStockSubmission(sub.id, 'rejected', 'Quality/quantity mismatch.')}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warehouses Capacity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.warehouses.map((wh) => {
          const occupancy = Math.round((wh.occupiedTonnes / wh.capacityTonnes) * 100);
          return (
            <div 
              key={wh.id}
              className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17231C]">{wh.name}</h3>
                  <p className="text-xs text-[#66736A]">{wh.city}, {wh.state}</p>
                </div>
                {wh.coldStorageAvailable && (
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center space-x-1" title="Cold Storage Available">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Cold Chain</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#66736A]">Storage Capacity:</span>
                  <span className="font-bold text-[#104D35]">{wh.occupiedTonnes} / {wh.capacityTonnes} Tonnes ({occupancy}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${occupancy > 80 ? 'bg-amber-500' : 'bg-[#176B45]'}`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#66736A]">
                <span>Mgr: {wh.contactPerson}</span>
                <span>{wh.phone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product, batch ID, farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">All Regional Agro-Hubs</option>
            {state.warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Stock Table */}
      <div className="bg-white rounded-2xl border border-[#176B45]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F0] border-b border-gray-200 text-[#66736A] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Batch ID & Origin</th>
                <th className="px-4 py-3">Agro-Hub</th>
                <th className="px-4 py-3">QC Grade</th>
                <th className="px-4 py-3">Available Stock</th>
                <th className="px-4 py-3">Reserved for POs</th>
                <th className="px-4 py-3">Unit Valuation</th>
                <th className="px-4 py-3">Freshness / Expiry</th>
                <th className="px-4 py-3 text-right">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#17231C]">
                    {item.productName}
                    <div className="text-[10px] text-gray-500 font-normal">{item.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-[#176B45] text-xs">{item.batchId}</span>
                    <div className="text-[11px] text-gray-600">{item.farmerName}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.warehouseName.replace('Pure Krishi ', '')}</td>
                  <td className="px-4 py-3">
                    <Badge variant="green">{item.grade}</Badge>
                  </td>
                  <td className="px-4 py-3 font-extrabold text-[#104D35] text-sm">
                    {item.availableQuantityKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-700">
                    {item.reservedQuantityKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-gray-800">
                    ₹{item.unitPrice.toFixed(2)} / kg
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {item.expiryDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setAdjustItem(item);
                        setAdjustQty(item.availableQuantityKg);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Admin Stock Adjustment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Stock Adjustment Modal */}
      {adjustItem && (
        <Modal
          isOpen={Boolean(adjustItem)}
          onClose={() => setAdjustItem(null)}
          title={`Adjust Stock: ${adjustItem.productName}`}
          subtitle={`Batch ${adjustItem.batchId} • ${adjustItem.warehouseName}`}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              store.adminAdjustInventoryStock(adjustItem.id, adjustQty, adjustReason);
              setAdjustItem(null);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold mb-1">Approved Available Quantity (kg)</label>
              <input
                type="number"
                min={0}
                required
                value={adjustQty}
                onChange={e => setAdjustQty(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Audit Reason</label>
              <input
                required
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAdjustItem(null)} className="px-4 py-2 text-gray-600">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl">
                Save & Log Adjustment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Warehouse Modal */}
      <Modal isOpen={isAddWhOpen} onClose={() => setIsAddWhOpen(false)} title="Register Regional Agro-Hub Warehouse">
        <form
          onSubmit={e => {
            e.preventDefault();
            store.adminAddWarehouse(whForm);
            setIsAddWhOpen(false);
          }}
          className="space-y-3 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Warehouse Name *</label>
              <input required value={whForm.name} onChange={e => setWhForm({ ...whForm, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">City *</label>
              <input required value={whForm.city} onChange={e => setWhForm({ ...whForm, city: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Location / Address *</label>
              <input required value={whForm.location} onChange={e => setWhForm({ ...whForm, location: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Capacity (Tonnes)</label>
              <input type="number" min={5} value={whForm.capacityTonnes} onChange={e => setWhForm({ ...whForm, capacityTonnes: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Manager Name *</label>
              <input required value={whForm.contactPerson} onChange={e => setWhForm({ ...whForm, contactPerson: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone *</label>
              <input required value={whForm.phone} onChange={e => setWhForm({ ...whForm, phone: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAddWhOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl">Create Warehouse</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
