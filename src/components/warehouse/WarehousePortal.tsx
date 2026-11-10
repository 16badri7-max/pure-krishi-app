import React, { useState } from 'react';
import { 
  Warehouse, 
  Boxes, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  Wheat, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Search,
  Plus,
  AlertTriangle,
  MoveRight,
  FileSpreadsheet,
  ScanLine,
  MapPin,
  ClipboardList,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MetricCard } from '../common/MetricCard';

export type WarehouseSection = 
  | 'dashboard'
  | 'incoming'
  | 'registration'
  | 'quality'
  | 'inventory'
  | 'storage_locations'
  | 'picking'
  | 'packing'
  | 'dispatch'
  | 'reports';

export const WarehousePortal: React.FC = () => {
  const { state, store } = useStore();
  const [activeSection, setActiveSection] = useState<WarehouseSection>('dashboard');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(state.warehouses[0]?.id || 'wh-01');
  
  // Registration modal
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [regCropName, setRegCropName] = useState('Desi Organic Tomatoes (Heirloom)');
  const [regFarmerName, setRegFarmerName] = useState(state.farmers[0]?.name || 'Ramesh Patil');
  const [regFarmerId, setRegFarmerId] = useState(state.farmers[0]?.id || 'fmr-01');
  const [regQuantity, setRegQuantity] = useState(1500);
  const [regUnit, setRegUnit] = useState<'kg' | 'quintals'>('kg');
  const [regGrade, setRegGrade] = useState<'Grade A Premium' | 'Grade A' | 'Grade B'>('Grade A Premium');
  const [regStorage, setRegStorage] = useState('Chilled (4°C - 6°C), High Humidity');

  // Relocate modal
  const [relocateModalOpen, setRelocateModalOpen] = useState(false);
  const [relocateInventoryId, setRelocateInventoryId] = useState('');
  const [newStorageLocation, setNewStorageLocation] = useState('Zone A Cold Bay - Rack A-04');

  // Search & filter
  const [searchFilter, setSearchFilter] = useState('');

  const currentWarehouse = state.warehouses.find(w => w.id === selectedWarehouseId) || state.warehouses[0];

  const inboundBatches = state.harvestBatches.filter(b => b.assignedWarehouseId === currentWarehouse.id || !b.assignedWarehouseId);
  const pendingQualityBatches = inboundBatches.filter(b => b.status === 'Harvested' || b.status === 'Under Inspection');
  const warehouseInventory = state.inventory.filter(i => i.warehouseId === currentWarehouse.id || !i.warehouseId);
  
  const totalAvailableKg = warehouseInventory.reduce((sum, item) => sum + item.availableQuantityKg, 0);
  const totalReservedKg = warehouseInventory.reduce((sum, item) => sum + item.reservedQuantityKg, 0);
  
  const ordersToPick = state.b2bOrders.filter(o => o.status === 'Confirmed');
  const ordersToPack = state.b2bOrders.filter(o => o.status === 'Processing');
  const ordersToDispatch = state.b2bOrders.filter(o => o.status === 'Packed');
  const completedDispatches = state.b2bOrders.filter(o => o.status === 'Dispatched' || o.status === 'Delivered');

  const lowStockItems = warehouseInventory.filter(i => i.availableQuantityKg < 500);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Warehouse },
    { id: 'incoming', label: 'Incoming Harvest', icon: Wheat, badge: pendingQualityBatches.length },
    { id: 'registration', label: 'Batch Registration', icon: ScanLine },
    { id: 'quality', label: 'Quality Status', icon: ShieldCheck },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'storage_locations', label: 'Storage Locations', icon: Layers },
    { id: 'picking', label: 'Order Picking', icon: ClipboardList, badge: ordersToPick.length },
    { id: 'packing', label: 'Packing', icon: PackageCheck, badge: ordersToPack.length },
    { id: 'dispatch', label: 'Dispatch', icon: Truck, badge: ordersToDispatch.length },
    { id: 'reports', label: 'Movement Reports', icon: FileSpreadsheet },
  ];

  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    store.registerInboundHarvestBatch({
      cropName: regCropName,
      farmerName: regFarmerName,
      farmerId: regFarmerId,
      farmId: 'farm-01',
      harvestQuantity: Number(regQuantity),
      unit: regUnit,
      expectedGrade: regGrade,
      storageRequirements: regStorage,
      assignedWarehouseId: currentWarehouse.id,
    });
    setRegisterModalOpen(false);
  };

  const handleOpenRelocate = (invId: string) => {
    setRelocateInventoryId(invId);
    setRelocateModalOpen(true);
  };

  const handleSubmitRelocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relocateInventoryId) return;
    store.assignStorageLocation(relocateInventoryId, newStorageLocation, state.currentUser.name);
    setRelocateModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Warehouse Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
              Agro-Hub Logistics
            </span>
            <span className="bg-[#F0F7F0] text-[#176B45] text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#DCECDC]">
              Cold Chain
            </span>
          </div>
          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="w-full mt-2 text-xs font-bold text-[#17231C] bg-[#FAF8F0] p-2 rounded-xl border border-[#176B45]/20 focus:outline-none"
          >
            {state.warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>{wh.name.split('Pure Krishi ')[1] || wh.name}</option>
            ))}
          </select>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as WarehouseSection)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#104D35] text-white shadow-sm'
                    : 'text-[#66736A] hover:bg-[#F0F7F0] hover:text-[#17231C]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#176B45]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-stone-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Inbound Ingest Action */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="w-full py-2.5 px-3 bg-[#F0F7F0] hover:bg-[#DCECDC] text-[#104D35] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-[#176B45]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#176B45]" />
            <span>Ingest Harvest Batch</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* Top Warehouse Header Banner */}
        <div className="bg-white rounded-3xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F7F0] text-[#176B45] flex items-center justify-center font-bold text-xl border border-[#DCECDC] shrink-0">
                <Warehouse className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
                    {currentWarehouse.name}
                  </h1>
                  <Badge variant="green">Cold Storage Active</Badge>
                </div>
                <p className="text-xs text-[#66736A] mt-0.5">
                  Location: {currentWarehouse.location}, {currentWarehouse.city} | Manager: {currentWarehouse.contactPerson} ({currentWarehouse.phone})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold bg-[#FAF8F0] p-3 rounded-2xl border border-[#176B45]/15">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span>Zone A Cold Bay: <strong>+4.2°C</strong> | Zone B Ambient: <strong>+18°C</strong></span>
            </div>
          </div>
        </div>

        {/* SECTION 1: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* 7 KPI Dashboard Metrics requested in Prompt 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">Incoming</span>
                <span className="text-lg font-extrabold text-[#104D35]">{inboundBatches.length}</span>
                <span className="text-[9px] text-gray-400 block">Batches</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">Pending QC</span>
                <span className="text-lg font-extrabold text-amber-700">{pendingQualityBatches.length}</span>
                <span className="text-[9px] text-amber-600 font-bold block">Awaiting Test</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">Available</span>
                <span className="text-lg font-extrabold text-[#176B45]">{(totalAvailableKg / 1000).toFixed(1)}t</span>
                <span className="text-[9px] text-gray-400 block">{totalAvailableKg} kg</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">Reserved</span>
                <span className="text-lg font-extrabold text-blue-600">{(totalReservedKg / 1000).toFixed(1)}t</span>
                <span className="text-[9px] text-blue-500 block">Allocated</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">To Pack</span>
                <span className="text-lg font-extrabold text-purple-700">{ordersToPack.length}</span>
                <span className="text-[9px] text-purple-600 block">Orders</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">To Dispatch</span>
                <span className="text-lg font-extrabold text-emerald-700">{ordersToDispatch.length}</span>
                <span className="text-[9px] text-emerald-600 block">Staged</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-[11px] text-[#66736A] block">Low Stock</span>
                <span className="text-lg font-extrabold text-red-600">{lowStockItems.length}</span>
                <span className="text-[9px] text-red-500 block">&lt;500 kg alerts</span>
              </div>
            </div>

            {/* Inbound & Outbound Pipeline Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inbound Pending Quality Checks */}
              <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-[#17231C]">Incoming Harvest at Gate</h3>
                  <button onClick={() => setActiveSection('incoming')} className="text-xs font-bold text-[#176B45] hover:underline">
                    View All ({inboundBatches.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {inboundBatches.slice(0, 3).map((b) => (
                    <div key={b.id} className="p-3 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="font-mono font-bold text-[#176B45]">{b.id}</span>
                        <Badge variant={b.status === 'Approved' ? 'green' : 'amber'}>{b.status}</Badge>
                      </div>
                      <h4 className="font-bold text-[#17231C]">{b.cropName}</h4>
                      <div className="flex justify-between text-gray-600 text-[11px]">
                        <span>Farmer: <strong>{b.farmerName}</strong></span>
                        <span>Quantity: <strong>{b.harvestQuantity} {b.unit}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outbound Pack & Dispatch Staging */}
              <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-[#17231C]">Fulfillment & Dispatch Staging</h3>
                  <button onClick={() => setActiveSection('dispatch')} className="text-xs font-bold text-[#176B45] hover:underline">
                    View Fleet ({ordersToDispatch.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {ordersToDispatch.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500">
                      No packed orders awaiting dispatch.
                    </div>
                  ) : (
                    ordersToDispatch.map((order) => (
                      <div key={order.id} className="p-3 rounded-xl bg-white border border-gray-200 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                          <Badge variant="blue">Packed & Staged</Badge>
                        </div>
                        <h4 className="font-bold text-[#17231C]">{order.buyerName}</h4>
                        <p className="text-[11px] text-gray-600">{order.deliveryAddress}</p>
                        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                          <span className="font-bold text-[#104D35]">₹{order.totalAmount.toLocaleString()}</span>
                          <button
                            onClick={() => store.advanceWarehouseWorkflow(order.id, 'Dispatched', state.currentUser.name)}
                            className="px-3 py-1 bg-[#104D35] hover:bg-[#176B45] text-white rounded-lg text-[11px] font-bold"
                          >
                            Load to Truck & Dispatch
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: INCOMING HARVEST */}
        {activeSection === 'incoming' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display">Incoming Farm Produce Ingest</h2>
                <p className="text-xs text-[#66736A]">Harvest crates and truck arrivals from registered farmer partners.</p>
              </div>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-3 py-1.5 bg-[#104D35] text-white rounded-xl text-xs font-bold hover:bg-[#176B45] flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ingest Produce</span>
              </button>
            </div>

            <div className="space-y-3">
              {inboundBatches.map((batch) => (
                <div key={batch.id} className="p-4 rounded-xl border border-gray-200 hover:border-[#176B45]/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#176B45]">{batch.id}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">Harvested: {batch.harvestDate}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#17231C] mt-0.5">{batch.cropName}</h4>
                      <p className="text-xs text-gray-600">Farmer: <strong>{batch.farmerName}</strong></p>
                    </div>
                    <div className="text-right">
                      <Badge variant={batch.status === 'Approved' ? 'green' : batch.status === 'Rejected' ? 'red' : 'amber'}>
                        {batch.status}
                      </Badge>
                      <span className="text-sm font-extrabold text-[#104D35] block mt-1">
                        {batch.harvestQuantity} {batch.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs bg-[#FAF8F0] p-2.5 rounded-lg border border-[#176B45]/10 text-gray-700">
                    Storage Requirement: <strong>{batch.storageRequirements}</strong> | Expected: <strong>{batch.expectedGrade}</strong>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setActiveSection('quality')}
                      className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
                    >
                      QC Lab Report
                    </button>
                    {batch.status !== 'Approved' && (
                      <button
                        onClick={() => {
                          store.submitQualityInspection({
                            harvestBatchId: batch.id,
                            inspectorId: state.currentUser.id,
                            inspectorName: state.currentUser.name,
                            assignedGrade: 'Grade A Premium',
                            visualDefectPercentage: 1.0,
                            chemicalResidueStatus: 'Zero Detected (Clean Lab)',
                            observations: 'Rapid inbound inspection passed. Firm, clean, no rot.',
                            photos: [],
                            status: 'Approved',
                          });
                        }}
                        className="px-4 py-1.5 text-xs bg-[#104D35] hover:bg-[#176B45] text-white rounded-lg font-bold"
                      >
                        Accept & Approve Batch
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: BATCH REGISTRATION */}
        {activeSection === 'registration' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Inbound Produce Barcode & Batch Registration</h2>
              <p className="text-xs text-[#66736A]">Weigh and register newly arrived farm crates at the warehouse receiving dock.</p>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4 max-w-xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Select Crop Produce:</label>
                  <select
                    value={regCropName}
                    onChange={(e) => setRegCropName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Desi Organic Tomatoes (Heirloom)">Desi Organic Tomatoes (Heirloom)</option>
                    <option value="Nashik Red Onions (Medium Size)">Nashik Red Onions (Medium Size)</option>
                    <option value="Organic Baby Spinach & Palak">Organic Baby Spinach & Palak</option>
                    <option value="English Cucumbers (Polyhouse Grown)">English Cucumbers (Polyhouse Grown)</option>
                    <option value="G4 Green Chillies">G4 Green Chillies</option>
                    <option value="Himalayan Golden Shimla Apples">Himalayan Golden Shimla Apples</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Delivering Farmer:</label>
                  <select
                    value={regFarmerId}
                    onChange={(e) => {
                      const f = state.farmers.find(farmer => farmer.id === e.target.value);
                      if (f) {
                        setRegFarmerId(f.id);
                        setRegFarmerName(f.name);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    {state.farmers.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Gross Ingest Quantity:</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={regQuantity}
                    onChange={(e) => setRegQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Unit of Measure:</label>
                  <select
                    value={regUnit}
                    onChange={(e) => setRegUnit(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="quintals">Quintals (qtl)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Expected Quality Grade:</label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Grade A Premium">Grade A Premium</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assigned Cold Chamber:</label>
                  <select
                    value={regStorage}
                    onChange={(e) => setRegStorage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Zone A Cold Bay (+4°C to +6°C)">Zone A Cold Bay (+4°C to +6°C)</option>
                    <option value="Zone B Semi-Chilled (+8°C to +12°C)">Zone B Semi-Chilled (+8°C to +12°C)</option>
                    <option value="Zone C Ambient Ventilated (+18°C)">Zone C Ambient Ventilated (+18°C)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold shadow-sm"
              >
                Generate Batch ID & Log Ingest
              </button>
            </form>
          </div>
        )}

        {/* SECTION 4: QUALITY STATUS */}
        {activeSection === 'quality' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">QC Lab Verification & Chemical Residue Tests</h2>
              <p className="text-xs text-[#66736A]">All harvest produce must pass lab verification before storage allocation.</p>
            </div>

            <div className="space-y-3">
              {state.inspections.map((insp) => (
                <div key={insp.id} className="p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#176B45]">{insp.id}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-mono text-gray-600">Batch {insp.harvestBatchId}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">Inspector: <strong>{insp.inspectorName}</strong> on {new Date(insp.inspectedAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <Badge variant={insp.status === 'Approved' ? 'green' : 'red'}>
                      {insp.assignedGrade}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10">
                    <div>Chemical Status: <strong className="text-[#104D35] block">{insp.chemicalResidueStatus}</strong></div>
                    <div>Brix Sugar: <strong>{insp.brixSugarContent || 'N/A'} °Bx</strong></div>
                    <div>Moisture: <strong>{insp.moisturePercentage || 'N/A'}%</strong></div>
                    <div>Defect Rate: <strong>{insp.visualDefectPercentage}%</strong></div>
                  </div>

                  <p className="text-gray-700 italic bg-white p-2.5 rounded-lg border border-gray-100">
                    "{insp.observations}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: INVENTORY */}
        {activeSection === 'inventory' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display">Active Warehouse Inventory</h2>
                <p className="text-xs text-[#66736A]">Total produce in racks, cold bays, and dispatch holding.</p>
              </div>
              <input
                type="text"
                placeholder="Search produce or batch..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#176B45]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F0] text-[#17231C] font-bold">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Batch ID</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Storage Location</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Reserved</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {warehouseInventory
                    .filter(i => i.productName.toLowerCase().includes(searchFilter.toLowerCase()) || i.batchId.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-[#17231C]">{item.productName}</td>
                        <td className="p-3 font-mono text-[#176B45] font-bold">{item.batchId}</td>
                        <td className="p-3"><Badge variant="green">{item.grade}</Badge></td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            {item.storageLocation || 'Zone A Cold Bay'}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-[#104D35]">{item.availableQuantityKg} kg</td>
                        <td className="p-3 font-bold text-blue-600">{item.reservedQuantityKg} kg</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleOpenRelocate(item.id)}
                            className="px-2.5 py-1 text-xs bg-[#F0F7F0] hover:bg-[#DCECDC] text-[#104D35] rounded-lg font-bold border border-[#DCECDC]"
                          >
                            Relocate
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 6: STORAGE LOCATIONS */}
        {activeSection === 'storage_locations' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Cold Storage Chambers & Rack Allocation</h2>
              <p className="text-xs text-[#66736A]">Manage produce positioning across temperature-controlled bays.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-[#17231C]">Zone A Cold Bay</h4>
                  <Badge variant="blue">+4.2°C</Badge>
                </div>
                <p className="text-xs text-gray-600">Reserved for delicate vegetables: Heirloom Tomatoes, Baby Spinach, Cucumbers.</p>
                <div className="text-xs text-blue-900 font-semibold pt-1">
                  Capacity: <strong>600 Tonnes (74% Occupied)</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-[#17231C]">Zone B Semi-Chilled</h4>
                  <Badge variant="green">+11.0°C</Badge>
                </div>
                <p className="text-xs text-gray-600">Reserved for fruits and root produce: Himalayan Apples, Bell Peppers, Ginger.</p>
                <div className="text-xs text-emerald-900 font-semibold pt-1">
                  Capacity: <strong>450 Tonnes (51% Occupied)</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-[#17231C]">Zone C Dry Ventilated</h4>
                  <Badge variant="amber">+18.5°C</Badge>
                </div>
                <p className="text-xs text-gray-600">Reserved for dry crops: Nashik Red Onions, G4 Chillies, Turmeric, Grains.</p>
                <div className="text-xs text-amber-900 font-semibold pt-1">
                  Capacity: <strong>450 Tonnes (68% Occupied)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: ORDER PICKING */}
        {activeSection === 'picking' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Order Picking Waves</h2>
              <p className="text-xs text-[#66736A]">Confirmed supermarket purchase orders ready to be picked from cold bays.</p>
            </div>

            <div className="space-y-3">
              {ordersToPick.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  All confirmed orders have been picked into staging.
                </div>
              ) : (
                ordersToPick.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                        <h4 className="font-bold text-sm text-[#17231C]">{order.buyerName}</h4>
                        <p className="text-xs text-gray-500">Scheduled Delivery: {order.deliveryDate}</p>
                      </div>
                      <Badge variant="amber">Needs Picking</Badge>
                    </div>

                    <div className="bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10 space-y-1">
                      <span className="font-bold text-[#104D35] block">Pick List Items:</span>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700">
                          <span>{it.productName} (Batch: {it.batchId})</span>
                          <strong>{it.quantityKg} kg</strong>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => store.advanceWarehouseWorkflow(order.id, 'Processing', state.currentUser.name)}
                        className="px-4 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold"
                      >
                        Start Picking Wave
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 8: PACKING */}
        {activeSection === 'packing' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Packing & Palletizing Station</h2>
              <p className="text-xs text-[#66736A]">Weigh crates, apply Pure Krishi traceability QR barcodes, and palletize.</p>
            </div>

            <div className="space-y-3">
              {ordersToPack.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No orders currently in the packing lane.
                </div>
              ) : (
                ordersToPack.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                        <h4 className="font-bold text-sm text-[#17231C]">{order.buyerName}</h4>
                      </div>
                      <Badge variant="blue">Packing In Progress</Badge>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-gray-700">
                      Total Crates: <strong>{Math.ceil(order.items.reduce((s, i) => s + i.quantityKg, 0) / 20)} Crates</strong> • Temperature Target: <strong>&lt;12°C</strong>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => store.advanceWarehouseWorkflow(order.id, 'Packed', state.currentUser.name)}
                        className="px-4 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold flex items-center space-x-1.5"
                      >
                        <PackageCheck className="w-4 h-4 text-amber-300" />
                        <span>Seal Pallet & Move to Dispatch Bay</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 9: DISPATCH */}
        {activeSection === 'dispatch' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Cold Chain Reefer Fleet Dispatch</h2>
              <p className="text-xs text-[#66736A]">Hand off sealed pallets to assigned delivery partner vehicles.</p>
            </div>

            <div className="space-y-3">
              {ordersToDispatch.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No orders waiting at dispatch dock.
                </div>
              ) : (
                ordersToDispatch.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-gray-200 bg-[#FAF8F0] space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                        <h4 className="font-bold text-sm text-[#17231C]">{order.buyerName}</h4>
                        <p className="text-xs text-gray-500">{order.deliveryAddress}</p>
                      </div>
                      <Badge variant="green">Ready for Reefer Loading</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#176B45]/10">
                      <span className="font-bold text-[#104D35]">Value: ₹{order.totalAmount.toLocaleString()}</span>
                      <button
                        onClick={() => store.advanceWarehouseWorkflow(order.id, 'Dispatched', state.currentUser.name)}
                        className="px-4 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold flex items-center space-x-1.5"
                      >
                        <Truck className="w-4 h-4 text-amber-300" />
                        <span>Dispatch to Fleet Unit MH-04-AZ-9981</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 10: REPORTS & AUDIT LOGS */}
        {activeSection === 'reports' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Complete Inventory Movement Audit Log</h2>
              <p className="text-xs text-[#66736A]">Every produce movement recorded in PostgreSQL database with timestamp and operator name.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F0] text-[#17231C] font-bold">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Movement Type</th>
                    <th className="p-3">Batch / Produce</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">From</th>
                    <th className="p-3">To Location</th>
                    <th className="p-3">Staff Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.inventoryMovements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-gray-50/50">
                      <td className="p-3 text-gray-500">{new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3">
                        <Badge variant={mov.movementType === 'Dispatch' ? 'blue' : mov.movementType === 'Inbound Ingest' ? 'green' : 'amber'}>
                          {mov.movementType}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-[#17231C]">{mov.productName}</td>
                      <td className="p-3 font-bold text-[#104D35]">{mov.quantityKg} kg</td>
                      <td className="p-3 text-gray-600">{mov.fromLocation}</td>
                      <td className="p-3 font-semibold text-[#176B45]">{mov.toLocation}</td>
                      <td className="p-3 text-gray-600">{mov.staffName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: BATCH INGEST REGISTRATION */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Ingest Inbound Farm Produce at Receiving Dock"
      >
        <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Crop Name:</label>
              <input
                type="text"
                required
                value={regCropName}
                onChange={(e) => setRegCropName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Delivering Farmer:</label>
              <input
                type="text"
                required
                value={regFarmerName}
                onChange={(e) => setRegFarmerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Quantity (kg):</label>
              <input
                type="number"
                required
                min={1}
                value={regQuantity}
                onChange={(e) => setRegQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Grade:</label>
              <select
                value={regGrade}
                onChange={(e) => setRegGrade(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              >
                <option value="Grade A Premium">Grade A Premium</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold shadow-sm"
            >
              Confirm Ingest & Record Movement
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: RELOCATE STORAGE BAY */}
      <Modal
        isOpen={relocateModalOpen}
        onClose={() => setRelocateModalOpen(false)}
        title="Relocate Produce to New Storage Bay"
      >
        <form onSubmit={handleSubmitRelocate} className="space-y-4 text-xs">
          <p className="text-gray-600">
            Select destination cold storage chamber or ambient rack. Movement will be logged in the permanent audit trail.
          </p>

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 block">Target Storage Location:</label>
            <select
              value={newStorageLocation}
              onChange={(e) => setNewStorageLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 text-xs"
            >
              <option value="Zone A Cold Bay - Rack A-04 (+4°C)">Zone A Cold Bay - Rack A-04 (+4°C)</option>
              <option value="Zone A Cold Bay - Rack A-12 (+4°C)">Zone A Cold Bay - Rack A-12 (+4°C)</option>
              <option value="Zone B Semi-Chilled - Bay B-08 (+10°C)">Zone B Semi-Chilled - Bay B-08 (+10°C)</option>
              <option value="Zone C Ambient Ventilated - Bay C-02 (+18°C)">Zone C Ambient Ventilated - Bay C-02 (+18°C)</option>
              <option value="Staging Dock Bay 4 (Dispatch Prep)">Staging Dock Bay 4 (Dispatch Prep)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setRelocateModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold"
            >
              Confirm Relocation
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
