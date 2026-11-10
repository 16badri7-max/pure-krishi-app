import React, { useState } from 'react';
import { 
  Tractor, 
  Wheat, 
  MapPin, 
  Calendar, 
  Plus, 
  Bot, 
  BadgeIndianRupee, 
  CheckCircle2, 
  Clock, 
  Building2,
  Sparkles,
  Droplets,
  Layers,
  FileText,
  CreditCard,
  ShoppingBag,
  Bell,
  HelpCircle,
  Settings,
  Receipt,
  Camera,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Cpu
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MetricCard } from '../common/MetricCard';
import { CropRecord, HarvestBatch, Farm, FarmerExpense } from '../../types';
import { AIFarmingTools } from './AIFarmingTools';

export type FarmerNav = 
  | 'dashboard'
  | 'profile'
  | 'farms'
  | 'crops'
  | 'buyer_demand'
  | 'harvest'
  | 'earnings'
  | 'expenses'
  | 'expert_support'
  | 'notifications'
  | 'settings'
  | 'ai_tools';

interface FarmerPortalProps {
  onOpenAI: (cropContext?: { cropName: string; growthStage: string }) => void;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({ onOpenAI }) => {
  const { state, store } = useStore();
  const [activeNav, setActiveNav] = useState<FarmerNav>('dashboard');
  
  // Modals
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isLogHarvestOpen, setIsLogHarvestOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Active Farmer
  const currentFarmer = state.farmers.find(f => f.email === state.currentUser.email) || state.farmers[0];
  const farmerFarms = state.farms.filter(f => f.farmerId === currentFarmer.id);
  const farmerCrops = state.crops.filter(c => c.farmerId === currentFarmer.id);
  const farmerAllocations = state.allocations.filter(a => a.farmerId === currentFarmer.id);
  const farmerBatches = state.harvestBatches.filter(b => b.farmerId === currentFarmer.id);
  const farmerExpenses = state.farmerExpenses.filter(e => e.farmerId === currentFarmer.id);
  const farmerNotifs = state.notifications.filter(n => n.recipientRole === 'farmer' || n.recipientRole === 'all');

  // Real Supermarket requirements that match the farmer's registered crops!
  const matchingDemands = state.requirements.flatMap(r => 
    r.items.filter(item => 
      farmerCrops.some(c => 
        c.cropName.toLowerCase().includes(item.productName.toLowerCase()) ||
        item.productName.toLowerCase().includes(c.cropName.toLowerCase())
      )
    ).map(item => ({ ...item, buyerName: r.buyerName, reqId: r.id }))
  );

  // New Farm State
  const [newFarm, setNewFarm] = useState({
    farmName: '',
    village: currentFarmer.village,
    district: currentFarmer.district,
    state: currentFarmer.state,
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

  // New Crop State
  const [newCrop, setNewCrop] = useState({
    farmId: farmerFarms[0]?.id || '',
    cropName: 'Desi Organic Tomatoes (Heirloom)',
    variety: 'Abhinav Bio-Certified',
    category: 'Vegetables' as const,
    cultivatedAcres: 3.0,
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedYieldKg: 10000,
    growthStage: 'Vegetative' as CropRecord['growthStage'],
    healthStatus: 'Excellent' as CropRecord['healthStatus'],
  });

  // Harvest State
  const [harvestForm, setHarvestForm] = useState({
    cropName: farmerCrops[0]?.cropName || 'Desi Organic Tomatoes (Heirloom)',
    farmId: farmerFarms[0]?.id || '',
    harvestQuantity: 2000,
    unit: 'kg' as const,
    expectedGrade: 'Grade A Premium' as HarvestBatch['expectedGrade'],
    storageRequirements: 'Store in ventilated shade crates, temperature below 16°C.',
    assignedWarehouseId: state.warehouses[0]?.id || '',
  });

  // Expense State
  const [expenseForm, setExpenseForm] = useState({
    category: 'Seeds & Saplings' as FarmerExpense['category'],
    amount: 5000,
    description: 'Purchase of bio-fertilizer and vermicompost bags',
    date: new Date().toISOString().split('T')[0],
  });

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    store.addFarm({
      ...newFarm,
      farmerId: currentFarmer.id,
      verificationStatus: 'Pending Verification',
    });
    setIsAddFarmOpen(false);
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    store.addCropRecord({
      ...newCrop,
      farmerId: currentFarmer.id,
      farmerName: currentFarmer.name,
    });
    setIsAddCropOpen(false);
  };

  const handleLogHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    store.logHarvestBatch({
      farmerId: currentFarmer.id,
      farmerName: currentFarmer.name,
      farmId: harvestForm.farmId,
      cropName: harvestForm.cropName,
      harvestDate: new Date().toISOString().split('T')[0],
      harvestQuantity: harvestForm.harvestQuantity,
      unit: harvestForm.unit,
      expectedGrade: harvestForm.expectedGrade,
      storageRequirements: harvestForm.storageRequirements,
      photos: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
      ],
      assignedWarehouseId: harvestForm.assignedWarehouseId,
    });
    setIsLogHarvestOpen(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    store.addFarmerExpense({
      ...expenseForm,
      farmerId: currentFarmer.id,
    });
    setIsAddExpenseOpen(false);
  };

  const handleAcceptCommitment = (reqItemId: string, cropRecordId: string, quantityKg: number) => {
    store.farmerCommitDemand(reqItemId, cropRecordId, currentFarmer.id, quantityKg);
  };

  const navItems = [
    { id: 'dashboard', label: 'Farmer Dashboard', icon: Tractor },
    { id: 'ai_tools', label: '🤖 AI Farming Tools', icon: Cpu, badge: 9 },
    { id: 'farms', label: 'My Farms & Land', icon: MapPin, badge: farmerFarms.length },
    { id: 'crops', label: 'Crop Management', icon: Wheat, badge: farmerCrops.length },
    { id: 'buyer_demand', label: 'Matching Supermarket Demand', icon: Building2, badge: matchingDemands.length },
    { id: 'harvest', label: 'Harvest Log', icon: Wheat, badge: farmerBatches.length },
    { id: 'earnings', label: 'Earnings & Payments', icon: BadgeIndianRupee },
    { id: 'expenses', label: 'Farm Expenses', icon: Receipt, badge: farmerExpenses.length },
    { id: 'notifications', label: 'Farmer Alerts', icon: Bell, badge: farmerNotifs.filter(n => !n.isRead).length },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Farmer Sidebar */}
      <aside className="w-full md:w-64 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
            Farmer Portal
          </span>
          <h2 className="font-bold text-sm text-[#17231C]">{currentFarmer.name}</h2>
          <p className="text-[11px] text-[#66736A] mt-0.5">{currentFarmer.village}, {currentFarmer.district}</p>
        </div>

        {/* Quick Action Large Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveNav('ai_tools')}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>🤖 AI Farming Tools</span>
          </button>

          <button
            onClick={() => onOpenAI({ cropName: farmerCrops[0]?.cropName || 'Tomatoes', growthStage: 'Vegetative' })}
            className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Consult AI Agronomist</span>
          </button>

          <button
            onClick={() => setIsLogHarvestOpen(true)}
            className="w-full py-2 px-3 bg-[#176B45] hover:bg-[#104D35] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Harvest Batch</span>
          </button>
        </div>

        <nav className="space-y-1 pt-2 border-t border-gray-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id as FarmerNav)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
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
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Farmer Body */}
      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Navigation 1: Dashboard Overview */}
        {activeNav === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#176B45] to-[#104D35] rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display">{currentFarmer.name}</h1>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {currentFarmer.farmingPractices}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-1">
                  {currentFarmer.village}, {currentFarmer.district}, {currentFarmer.state} • {currentFarmer.totalAcres} Acres Registered
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddCropOpen(true)}
                  className="bg-white text-[#104D35] hover:bg-emerald-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Crop</span>
                </button>
              </div>
            </div>

            {/* 4 Financial & Production Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Guaranteed Earnings"
                value={`₹${(currentFarmer.totalEarnings / 1000).toFixed(0)}k`}
                subtitle="Direct settlement to bank"
                icon={BadgeIndianRupee}
              />
              <MetricCard
                title="Pending Payout"
                value={`₹${(currentFarmer.pendingPayment / 1000).toFixed(0)}k`}
                subtitle="Scheduled for release"
                badge="Net 3 Days"
                icon={Clock}
              />
              <MetricCard
                title="Active Crops"
                value={farmerCrops.length}
                subtitle={`${farmerFarms.reduce((s, f) => s + f.cultivatedAreaAcres, 0)} Acres in cultivation`}
                icon={Wheat}
              />
              <MetricCard
                title="Supermarket Contracts"
                value={farmerAllocations.length}
                subtitle="Committed buyback"
                icon={Building2}
              />
            </div>

            {/* Matching Demand Highlight on Dashboard */}
            {matchingDemands.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-[#17231C]">
                      New Supermarket Demands Matching Your Crops ({matchingDemands.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveNav('buyer_demand')}
                    className="text-xs font-bold text-[#176B45] hover:underline"
                  >
                    View All & Commit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingDemands.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <strong>{item.productName}</strong>
                        <Badge variant="green">{item.qualityGrade}</Badge>
                      </div>
                      <p className="text-gray-600">Buyer: <strong>{item.buyerName}</strong></p>
                      <p className="text-[#104D35] font-semibold">Demand: {item.requiredQuantity} {item.unit} ({item.frequency})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Farming Tools */}
        {activeNav === 'ai_tools' && (
          <AIFarmingTools
            farmerName={currentFarmer.name}
            cropName={farmerCrops[0]?.cropName || 'Desi Organic Tomatoes'}
            location={`${currentFarmer.village}, ${currentFarmer.district}, ${currentFarmer.state}`}
            crops={farmerCrops}
            farms={farmerFarms}
          />
        )}

        {/* Navigation 2: My Farms */}
        {activeNav === 'farms' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Registered Farm Parcels</h2>
                <p className="text-xs text-[#66736A]">Soil fertility, water sources, and Pure Krishi verification status.</p>
              </div>
              <button
                onClick={() => setIsAddFarmOpen(true)}
                className="px-3.5 py-1.5 bg-[#176B45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Farm</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {farmerFarms.map(farm => (
                <div key={farm.id} className="p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-[#17231C]">{farm.farmName}</h4>
                      <p className="text-gray-500">{farm.village}, {farm.district}</p>
                    </div>
                    <Badge variant={farm.verificationStatus === 'Verified by Pure Krishi' ? 'green' : 'amber'}>
                      {farm.verificationStatus}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-[#FAF8F0] p-2.5 rounded-lg text-[11px]">
                    <div>Area: <strong>{farm.cultivatedAreaAcres} / {farm.totalLandAreaAcres} Acres</strong></div>
                    <div>Water: <strong>{farm.waterSource}</strong></div>
                    <div>Soil pH: <strong>{farm.soilPh || '6.8'}</strong></div>
                    <div>Carbon: <strong>{farm.organicCarbonPercentage}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 3: Crop Management */}
        {activeNav === 'crops' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Active Crop Cultivation Cycles</h2>
                <p className="text-xs text-[#66736A]">Track growth stages, health condition, and expected yield.</p>
              </div>
              <button
                onClick={() => setIsAddCropOpen(true)}
                className="px-3.5 py-1.5 bg-[#176B45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Crop</span>
              </button>
            </div>

            <div className="space-y-3">
              {farmerCrops.map(crop => (
                <div key={crop.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-[#17231C]">{crop.cropName}</h4>
                      <span className="text-gray-500 font-mono">({crop.variety})</span>
                      <Badge variant={crop.healthStatus === 'Attention Needed' ? 'amber' : 'green'}>
                        {crop.healthStatus}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Stage: <strong className="text-[#104D35]">{crop.growthStage}</strong> • Sown: {crop.sowingDate} • Harvest: {crop.expectedHarvestDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#17231C]">{crop.expectedYieldKg.toLocaleString()} kg Expected</span>
                    <p className="text-emerald-700 font-semibold">{crop.allocatedToDemandKg} kg Contracted</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 4: Buyer Demand (Core Feature from Prompt 2) */}
        {activeNav === 'buyer_demand' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Direct Supermarket Procurement Demand</h2>
                <p className="text-xs text-[#66736A]">Real buyer requirements relevant to your crops. Express interest or accept commitment.</p>
              </div>
              <Badge variant="green">{matchingDemands.length} Matches</Badge>
            </div>

            <div className="space-y-3">
              {matchingDemands.map((item, idx) => {
                const matchingCrop = farmerCrops.find(c => 
                  c.cropName.toLowerCase().includes(item.productName.toLowerCase()) ||
                  item.productName.toLowerCase().includes(c.cropName.toLowerCase())
                );
                return (
                  <div key={idx} className="p-4 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sm text-[#104D35]">{item.productName}</span>
                        <p className="text-gray-600">Buyer: <strong>{item.buyerName}</strong></p>
                        <p className="text-gray-400 text-[11px]">Required by: {item.requiredDeliveryDate} • Frequency: {item.frequency}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#17231C]">{item.requiredQuantity} {item.unit}</span>
                        <p className="text-emerald-700 font-semibold">{item.expectedPriceRange}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-[11px] text-gray-500">
                        Your Available Surplus: <strong>{matchingCrop?.surplusKg || 1000} kg</strong>
                      </span>
                      <button
                        onClick={() => handleAcceptCommitment(item.id, matchingCrop?.id || farmerCrops[0]?.id, 500)}
                        className="px-4 py-1.5 bg-[#176B45] hover:bg-[#104D35] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Supply Commitment (500 kg)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation 5: Harvest Management */}
        {activeNav === 'harvest' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Harvest Intake & QC Status</h2>
                <p className="text-xs text-[#66736A]">Batches logged and inspected by Pure Krishi agronomists.</p>
              </div>
              <button
                onClick={() => setIsLogHarvestOpen(true)}
                className="px-3.5 py-1.5 bg-[#176B45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Harvest Batch</span>
              </button>
            </div>

            <div className="space-y-3">
              {farmerBatches.map(batch => (
                <div key={batch.id} className="p-3.5 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#176B45]">{batch.id}</span>
                    <h4 className="font-bold text-[#17231C]">{batch.cropName}</h4>
                    <p className="text-gray-500 text-[11px]">Harvested on {batch.harvestDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#104D35]">{batch.harvestQuantity} {batch.unit}</span>
                    <div className="mt-1">
                      <Badge variant={batch.status === 'Approved' ? 'green' : 'amber'}>{batch.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 6: Earnings */}
        {activeNav === 'earnings' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Farmer Direct DBT Settlements</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15">
                <span className="text-xs text-gray-500">Total Settled Earnings:</span>
                <div className="text-2xl font-bold font-display text-[#104D35] mt-1">₹{currentFarmer.totalEarnings.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15">
                <span className="text-xs text-gray-500">Pending Bank Transfer:</span>
                <div className="text-2xl font-bold font-display text-amber-700 mt-1">₹{currentFarmer.pendingPayment.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation 7: Farm Expenses */}
        {activeNav === 'expenses' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Farm Cultivation Expenses</h2>
                <p className="text-xs text-[#66736A]">Track seeds, organic inputs, and labor costs for gross margin accounting.</p>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3.5 py-1.5 bg-[#176B45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </button>
            </div>

            <div className="space-y-3">
              {farmerExpenses.map(exp => (
                <div key={exp.id} className="p-3.5 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-gray-800">{exp.category}</strong>
                    <p className="text-gray-500">{exp.description}</p>
                    <span className="text-[10px] text-gray-400 font-mono">{exp.date}</span>
                  </div>
                  <strong className="text-rose-600 font-bold text-sm">₹{exp.amount.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 8: Notifications */}
        {activeNav === 'notifications' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#17231C]">Farmer Sourcing Alerts</h2>
            {farmerNotifs.map(n => (
              <div key={n.id} className="p-3 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 text-xs">
                <strong className="text-[#17231C]">{n.title}</strong>
                <p className="text-gray-600 mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation 9: Profile */}
        {activeNav === 'profile' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Farmer Profile & Land Records</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Farmer Name</span>
                <strong>{currentFarmer.name}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Phone</span>
                <strong>{currentFarmer.phone}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Location</span>
                <strong>{currentFarmer.village}, {currentFarmer.district}, {currentFarmer.state}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Total Cultivated Area</span>
                <strong className="text-[#104D35]">{currentFarmer.totalAcres} Acres</strong>
              </div>
            </div>
          </div>
        )}

        {/* Navigation 10: Settings */}
        {activeNav === 'settings' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Farmer Account Settings</h2>
            <p className="text-xs text-gray-600">SMS Alerts & WhatsApp Notifications: <strong>Enabled for {currentFarmer.phone}</strong></p>
          </div>
        )}

      </main>

      {/* Register Farm Modal */}
      <Modal
        isOpen={isAddFarmOpen}
        onClose={() => setIsAddFarmOpen(false)}
        title="Register Farm Parcel"
        subtitle="Add acreage and soil parameters for Pure Krishi verification."
      >
        <form onSubmit={handleCreateFarm} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Farm Name *</label>
            <input
              type="text"
              required
              value={newFarm.farmName}
              onChange={(e) => setNewFarm({ ...newFarm, farmName: e.target.value })}
              className="w-full rounded-xl border border-gray-200 p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Cultivated Acres *</label>
              <input
                type="number"
                step="0.5"
                required
                value={newFarm.cultivatedAreaAcres}
                onChange={(e) => setNewFarm({ ...newFarm, cultivatedAreaAcres: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Water Source</label>
              <select
                value={newFarm.waterSource}
                onChange={(e) => setNewFarm({ ...newFarm, waterSource: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 p-2 bg-white"
              >
                <option value="Borewell">Borewell</option>
                <option value="Canal Irrigation">Canal Irrigation</option>
                <option value="River">River</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsAddFarmOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#176B45] text-white font-bold rounded-xl">Save Farm</button>
          </div>
        </form>
      </Modal>

      {/* Add Crop Modal */}
      <Modal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        title="Register New Crop"
        subtitle="Track growth stages and expected harvest yield."
      >
        <form onSubmit={handleCreateCrop} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Crop Name *</label>
              <input
                type="text"
                required
                value={newCrop.cropName}
                onChange={(e) => setNewCrop({ ...newCrop, cropName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Variety *</label>
              <input
                type="text"
                required
                value={newCrop.variety}
                onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Expected Yield (kg) *</label>
              <input
                type="number"
                required
                value={newCrop.expectedYieldKg}
                onChange={(e) => setNewCrop({ ...newCrop, expectedYieldKg: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Growth Stage</label>
              <select
                value={newCrop.growthStage}
                onChange={(e) => setNewCrop({ ...newCrop, growthStage: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 p-2 bg-white"
              >
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Fruit Formation">Fruit Formation</option>
                <option value="Maturity / Ready to Harvest">Maturity / Ready to Harvest</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsAddCropOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#176B45] text-white font-bold rounded-xl">Save Crop</button>
          </div>
        </form>
      </Modal>

      {/* Record Harvest Modal */}
      <Modal
        isOpen={isLogHarvestOpen}
        onClose={() => setIsLogHarvestOpen(false)}
        title="Record Farm Harvest Intake"
        subtitle="Generates batch tracking code and triggers warehouse QC dispatch."
      >
        <form onSubmit={handleLogHarvest} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Crop *</label>
              <input
                type="text"
                required
                value={harvestForm.cropName}
                onChange={(e) => setHarvestForm({ ...harvestForm, cropName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Harvest Quantity (kg) *</label>
              <input
                type="number"
                required
                value={harvestForm.harvestQuantity}
                onChange={(e) => setHarvestForm({ ...harvestForm, harvestQuantity: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 p-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsLogHarvestOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#176B45] text-white font-bold rounded-xl">Log Batch</button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Record Farm Expense"
        subtitle="Track cultivation expenditure for profit calculation."
      >
        <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Category *</label>
            <select
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
              className="w-full rounded-xl border border-gray-200 p-2 bg-white"
            >
              <option value="Seeds & Saplings">Seeds & Saplings</option>
              <option value="Bio-Fertilizer / Jeevamrit">Bio-Fertilizer / Jeevamrit</option>
              <option value="Irrigation & Power">Irrigation & Power</option>
              <option value="Labor & Harvesting">Labor & Harvesting</option>
              <option value="Equipment & Tools">Equipment & Tools</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Amount (₹) *</label>
            <input
              type="number"
              required
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description *</label>
            <input
              type="text"
              required
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="w-full rounded-xl border border-gray-200 p-2"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#176B45] text-white font-bold rounded-xl">Save Expense</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
