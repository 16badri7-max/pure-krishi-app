import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CalendarRange, 
  Wheat, 
  Warehouse, 
  ShoppingCart, 
  Truck, 
  BadgeIndianRupee, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';

export type OpsSection = 
  | 'overview'
  | 'requirement_review'
  | 'farmer_allocation'
  | 'harvest_scheduling'
  | 'inventory_coord'
  | 'po_processing'
  | 'delivery_coord'
  | 'payment_followup';

export const OperationsPortal: React.FC = () => {
  const { state, store } = useStore();
  const [activeSection, setActiveSection] = useState<OpsSection>('overview');

  const pendingRequirements = state.requirements.filter(r => r.status === 'Submitted' || r.status === 'Under Review');
  const pendingOrders = state.b2bOrders.filter(o => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Packed');
  const pendingHarvests = state.harvestBatches.filter(b => b.status === 'Harvested' || b.status === 'Under Inspection');
  const outstandingReceivables = state.financials.outstandingBuyerPayments;

  const navItems = [
    { id: 'overview', label: 'Operations Dashboard', icon: Building2 },
    { id: 'requirement_review', label: 'Requirement Review', icon: FileText, badge: pendingRequirements.length },
    { id: 'farmer_allocation', label: 'Farmer Allocation', icon: CalendarRange },
    { id: 'harvest_scheduling', label: 'Harvest Scheduling', icon: Wheat, badge: pendingHarvests.length },
    { id: 'inventory_coord', label: 'Inventory Coordination', icon: Warehouse },
    { id: 'po_processing', label: 'PO Processing', icon: ShoppingCart, badge: pendingOrders.length },
    { id: 'delivery_coord', label: 'Delivery Coordination', icon: Truck },
    { id: 'payment_followup', label: 'Payment Follow-up', icon: BadgeIndianRupee },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Operations Sidebar */}
      <aside className="w-full md:w-64 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
              Operations Control
            </span>
            <span className="bg-[#F0F7F0] text-[#176B45] text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#DCECDC]">
              Level 2
            </span>
          </div>
          <p className="text-[11px] text-[#66736A] mt-0.5">
            Procurement & Logistics Coordination
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as OpsSection)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#176B45] text-white shadow-sm'
                    : 'text-[#17231C] hover:bg-[#F0F7F0] hover:text-[#176B45]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#5BA66B]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Operations Main Content Area */}
      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Section 1: Operations Overview */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#176B45]/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
                    Daily Operations Command
                  </h1>
                  <p className="text-xs text-[#66736A] mt-0.5">
                    Coordinating procurement pipelines, harvest intakes, and regional cold-chain dispatches.
                  </p>
                </div>
                <Badge variant="green">All Systems Optimal</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
                <MetricCard
                  title="Requirements in Triage"
                  value={pendingRequirements.length}
                  subtitle="Awaiting farmer allocation"
                  icon={FileText}
                  badge="Procurement"
                />
                <MetricCard
                  title="Harvest Intakes"
                  value={pendingHarvests.length}
                  subtitle="Under quality inspection"
                  icon={Wheat}
                />
                <MetricCard
                  title="Orders in Fulfillment"
                  value={pendingOrders.length}
                  subtitle="Picking / Pallet Packing"
                  icon={ShoppingCart}
                />
                <MetricCard
                  title="Outstanding Receivables"
                  value={`₹${(outstandingReceivables / 1000).toFixed(0)}k`}
                  subtitle="Payment tracking"
                  icon={BadgeIndianRupee}
                />
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-[#17231C]">Urgent Operational Tasks</h3>
                  <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">Action Required</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl flex items-center justify-between">
                    <div>
                      <strong>Reliance Fresh Cucumber Demand</strong>
                      <p className="text-gray-500">600 kg supply gap needs secondary farmer match</p>
                    </div>
                    <button
                      onClick={() => setActiveSection('farmer_allocation')}
                      className="px-2.5 py-1 bg-[#176B45] text-white font-bold rounded-lg text-[11px]"
                    >
                      Allocate
                    </button>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl flex items-center justify-between">
                    <div>
                      <strong>Bhiwandi Hub Truck Dispatch</strong>
                      <p className="text-gray-500">PO-2025-881 packed and scheduled for departure</p>
                    </div>
                    <button
                      onClick={() => setActiveSection('delivery_coord')}
                      className="px-2.5 py-1 bg-[#176B45] text-white font-bold rounded-lg text-[11px]"
                    >
                      Assign Fleet
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-[#17231C]">Agro-Hub Capacity Status</h3>
                  <span className="text-xs text-[#176B45] font-bold">Cold Chain Active</span>
                </div>
                <div className="space-y-3 text-xs">
                  {state.warehouses.map(w => (
                    <div key={w.id} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>{w.name.replace('Pure Krishi ', '')}</span>
                        <strong className="text-[#104D35]">{w.occupiedTonnes} / {w.capacityTonnes} Tonnes</strong>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#176B45] h-full"
                          style={{ width: `${Math.round((w.occupiedTonnes / w.capacityTonnes) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Requirement Review */}
        {activeSection === 'requirement_review' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Supermarket Demands in Review</h2>
                <p className="text-xs text-[#66736A]">Verify quality grades and delivery windows before farmer commitment.</p>
              </div>
              <Badge variant="amber">{pendingRequirements.length} Pending</Badge>
            </div>

            <div className="space-y-3">
              {state.requirements.map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#17231C]">{req.buyerName}</h4>
                      <p className="text-gray-500">Destination: {req.deliveryLocation}</p>
                    </div>
                    <Badge variant={req.status === 'Farmer Matched' ? 'green' : 'amber'}>{req.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    {req.items.map(item => (
                      <div key={item.id} className="bg-white p-2 rounded-lg border border-gray-200 flex justify-between">
                        <span>{item.productName} ({item.requiredQuantity} {item.unit})</span>
                        <strong className="text-[#104D35]">{item.status}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Farmer Allocation */}
        {activeSection === 'farmer_allocation' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Farmer Production Allocation</h2>
                <p className="text-xs text-[#66736A]">Directly assign verified farmer capacity to confirmed supermarket demands.</p>
              </div>
            </div>

            <div className="space-y-3">
              {state.allocations.map(alloc => (
                <div key={alloc.id} className="p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#104D35]">{alloc.cropName}</span>
                    <p className="text-gray-600">Farmer: <strong>{alloc.farmerName}</strong> | Buyer: {alloc.buyerName}</p>
                    <p className="text-gray-400 text-[11px]">Harvest Target: {alloc.targetHarvestDate} • Delivery: {alloc.estimatedDeliveryDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#17231C]">{alloc.allocatedQuantityKg.toLocaleString()} kg</span>
                    <div className="mt-1">
                      <Badge variant="green">{alloc.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Harvest Scheduling */}
        {activeSection === 'harvest_scheduling' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Inbound Harvest Intake Scheduling</h2>
                <p className="text-xs text-[#66736A]">Coordinate farm pickup trucks with central Agro-Hub receiving bays.</p>
              </div>
              <Badge variant="green">{state.harvestBatches.length} Total Batches</Badge>
            </div>

            <div className="space-y-3">
              {state.harvestBatches.map(batch => (
                <div key={batch.id} className="p-3.5 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#176B45]">{batch.id}</span>
                    <h4 className="font-bold text-[#17231C]">{batch.cropName}</h4>
                    <p className="text-gray-500">Farmer: {batch.farmerName} • Harvest Date: {batch.harvestDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#104D35] text-sm">{batch.harvestQuantity} {batch.unit}</span>
                    <div className="mt-1">
                      <Badge variant={batch.status === 'Approved' ? 'green' : 'amber'}>{batch.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Inventory Coordination */}
        {activeSection === 'inventory_coord' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Cold Chain Inventory Coordination</h2>
            <div className="space-y-3">
              {state.inventory.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-[#17231C] text-sm">{item.productName}</strong>
                    <p className="text-gray-500">Batch: {item.batchId} • {item.warehouseName.replace('Pure Krishi ', '')}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#104D35] text-sm">{item.availableQuantityKg} kg Available</span>
                    <p className="text-amber-700 font-semibold">{item.reservedQuantityKg} kg Reserved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: PO Processing */}
        {activeSection === 'po_processing' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Purchase Order Processing Queue</h2>
            <div className="space-y-3">
              {state.b2bOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                    <h4 className="font-bold text-[#17231C]">{order.buyerName}</h4>
                    <p className="text-gray-500">Scheduled: {order.deliveryDate} • Total: ₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={order.status === 'Dispatched' ? 'blue' : order.status === 'Delivered' ? 'green' : 'amber'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Delivery Coordination */}
        {activeSection === 'delivery_coord' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Logistics Dispatch & Route Management</h2>
            <div className="space-y-3">
              {state.b2bOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                      <h4 className="font-bold text-[#17231C]">{order.buyerName}</h4>
                      <p className="text-gray-500">Address: {order.deliveryAddress}</p>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'green' : 'blue'}>{order.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-[11px]">
                    <span className="text-gray-600">Carrier: <strong>{order.deliveryPartnerName || 'ColdChain Fleet'}</strong></span>
                    <span className="font-mono text-gray-500">Delivery Date: {order.deliveryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 8: Payment Follow-up */}
        {activeSection === 'payment_followup' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Payment Reconciliation & Farmer DBT Follow-up</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 space-y-1 text-xs">
                <span className="text-gray-500 block">Pending Farmer Disbursements</span>
                <strong className="text-lg text-amber-700">₹{state.financials.pendingFarmerPayments.toLocaleString()}</strong>
                <p className="text-[11px] text-gray-600">Subject to QC certification sign-off.</p>
              </div>
              <div className="p-4 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 space-y-1 text-xs">
                <span className="text-gray-500 block">Supermarket Receivables (Net 15 Days)</span>
                <strong className="text-lg text-[#104D35]">₹{state.financials.outstandingBuyerPayments.toLocaleString()}</strong>
                <p className="text-[11px] text-gray-600">Active invoice payment terms.</p>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
