import React from 'react';
import { 
  Building2, 
  Tractor, 
  FileText, 
  CalendarRange, 
  Wheat, 
  Warehouse, 
  ShoppingCart, 
  BadgeIndianRupee, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';

interface OverviewViewProps {
  onNavigate: (view: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { state } = useStore();

  // Aggregated live calculations
  const totalBuyers = state.buyers.length;
  const activeAgreements = state.agreements.filter(a => a.status === 'Active' || a.status === 'Authorized & Signed').length;
  const pendingRequirements = state.requirements.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length;
  const totalFarmers = state.farmers.length;
  const totalFarms = state.farms.length;
  const totalCultivatedAcres = state.farms.reduce((sum, f) => sum + f.cultivatedAreaAcres, 0);
  const activeCropPlans = state.allocations.length;
  const expectedHarvestKg = state.crops.reduce((sum, c) => sum + c.expectedYieldKg, 0);
  const availableInventoryKg = state.inventory.reduce((sum, i) => sum + i.availableQuantityKg, 0);
  const pendingOrders = state.b2bOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Completed').length;
  const totalRevenue = state.financials.grossRevenue;
  const pendingFarmerPayments = state.financials.pendingFarmerPayments;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Buyer-First Business Model Status */}
      <div className="bg-gradient-to-r from-[#176B45] to-[#104D35] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Wheat className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Demand-Driven Agricultural Operating System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
            Pure Krishi Command Center
          </h1>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            Supermarket demand is verified first, followed by direct matching with certified organic farmers, precision crop planning, cold-chain aggregation, and end-to-end quality inspection.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('requirements')}
              className="bg-white text-[#104D35] hover:bg-emerald-50 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>View Supermarket Demands</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('crop_planning')}
              className="bg-[#5BA66B] hover:bg-[#458553] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5"
            >
              <span>Match Demand to Farmers</span>
              <CalendarRange className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 12 Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Supermarket Partners"
          value={totalBuyers}
          subtitle={`${activeAgreements} Active Supply Agreements`}
          change="+2 this month"
          isPositive={true}
          icon={Building2}
        />
        <MetricCard
          title="Pending Requirements"
          value={pendingRequirements}
          subtitle="Awaiting farmer capacity match"
          badge="B2B Demand"
          icon={FileText}
        />
        <MetricCard
          title="Active Farmers"
          value={totalFarmers}
          subtitle={`${totalFarms} Farms across 4 states`}
          change="100% verified"
          isPositive={true}
          icon={Tractor}
        />
        <MetricCard
          title="Cultivated Land"
          value={`${totalCultivatedAcres.toFixed(1)} Acres`}
          subtitle="ZBNF & NPOP Organic"
          icon={Wheat}
        />
        <MetricCard
          title="Active Crop Allocations"
          value={activeCropPlans}
          subtitle="Contracted to Supermarkets"
          change="Zero Speculative Planting"
          isPositive={true}
          icon={CalendarRange}
        />
        <MetricCard
          title="Expected Harvest"
          value={`${(expectedHarvestKg / 1000).toFixed(1)} Tonnes`}
          subtitle="Over current season"
          icon={Wheat}
        />
        <MetricCard
          title="Available Inventory"
          value={`${(availableInventoryKg / 1000).toFixed(1)} Tonnes`}
          subtitle="Across 3 Agro-Hubs"
          badge="QC Cleared"
          icon={Warehouse}
        />
        <MetricCard
          title="Pending B2B Dispatches"
          value={pendingOrders}
          subtitle="In picking / transit"
          icon={ShoppingCart}
        />
        <MetricCard
          title="Gross Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(2)} Lakh`}
          subtitle="B2B + B2C Consolidated"
          change="+19.7% Gross Margin"
          isPositive={true}
          icon={TrendingUp}
        />
        <MetricCard
          title="Farmer Payments Pending"
          value={`₹${(pendingFarmerPayments / 1000).toFixed(1)}k`}
          subtitle="Scheduled disbursement"
          badge="Net 3 Days"
          icon={BadgeIndianRupee}
        />
        <MetricCard
          title="AI Agronomy Escalations"
          value={state.expertReviews.filter(e => e.status === 'Pending Review').length}
          subtitle="Awaiting Chief Agronomist"
          icon={AlertCircle}
        />
        <MetricCard
          title="Quality Pass Rate"
          value="98.8%"
          subtitle="Zero chemical residue"
          change="Lab Certified"
          isPositive={true}
          icon={ShieldCheck}
        />
      </div>

      {/* Two Column Layout: Demand-vs-Supply Matching & Active B2B Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Demand Fulfillment & Active Crop Allocations */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">
                Buyer Demand & Allocation Status
              </h2>
              <p className="text-xs text-[#66736A]">
                Comparing supermarket orders directly against allocated farmer harvests.
              </p>
            </div>
            <button
              onClick={() => onNavigate('crop_planning')}
              className="text-xs font-bold text-[#176B45] hover:text-[#104D35] flex items-center space-x-1"
            >
              <span>Open Planner</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {state.allocations.map((alloc) => (
              <div 
                key={alloc.id}
                className="p-4 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#104D35]">{alloc.cropName}</span>
                    <Badge variant="green">{alloc.status}</Badge>
                  </div>
                  <p className="text-xs text-[#66736A]">
                    Contracted Buyer: <span className="font-semibold text-gray-800">{alloc.buyerName}</span>
                  </p>
                  <p className="text-xs text-[#66736A]">
                    Assigned Farmer: <span className="font-semibold text-gray-800">{alloc.farmerName}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right space-y-1 shrink-0">
                  <div className="text-base font-bold text-[#17231C]">
                    {alloc.allocatedQuantityKg.toLocaleString()} kg
                  </div>
                  <p className="text-[11px] text-[#66736A]">
                    Harvest Target: {alloc.targetHarvestDate}
                  </p>
                  <p className="text-[11px] text-[#176B45] font-semibold">
                    Delivery: {alloc.estimatedDeliveryDate}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-[#F0F7F0] rounded-xl border border-[#DCECDC] text-xs text-[#176B45] flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Pure Krishi Rule:</strong> No crop is cultivated without a pre-registered supermarket demand or guaranteed minimum support procurement agreement.
            </span>
          </div>
        </div>

        {/* Right Col: Procurement Pipeline Summary */}
        <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">
                Procurement Pipeline
              </h2>
              <p className="text-xs text-[#66736A]">Supermarket B2B lifecycle</p>
            </div>
            <button
              onClick={() => onNavigate('buyers')}
              className="text-xs font-bold text-[#176B45] hover:text-[#104D35]"
            >
              Kanban
            </button>
          </div>

          <div className="space-y-3">
            {state.buyers.slice(0, 5).map((buyer) => (
              <div 
                key={buyer.id} 
                className="p-3 rounded-xl border border-gray-100 hover:border-[#176B45]/30 transition-all flex items-start justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#17231C]">{buyer.businessName}</h4>
                  <p className="text-[11px] text-[#66736A]">{buyer.city}, {buyer.state}</p>
                  <div className="mt-1.5">
                    <Badge variant={buyer.stage === 'Supply in Progress' || buyer.stage === 'Active Buyer' ? 'green' : 'amber'}>
                      {buyer.stage}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#104D35]">
                    ₹{(buyer.totalPurchaseValue / 1000).toFixed(0)}k
                  </span>
                  <p className="text-[10px] text-[#66736A]">{buyer.totalRequirementsCount} Demands</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => onNavigate('buyers')}
              className="w-full py-2 px-3 text-xs font-bold text-center text-[#176B45] bg-[#F0F7F0] hover:bg-[#E2F0E2] rounded-xl transition-colors"
            >
              View All Supermarket Accounts
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
