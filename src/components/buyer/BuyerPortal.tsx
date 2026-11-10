import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  ScrollText, 
  ShoppingCart, 
  Truck, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Download,
  AlertCircle,
  FileCheck,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  Send,
  Eye,
  ShieldCheck,
  Receipt,
  Lock,
  Unlock,
  Package
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MetricCard } from '../common/MetricCard';
import { BuyerRequirementItem, Quotation, ProductListing } from '../../types';

export type BuyerNav = 
  | 'dashboard'
  | 'direct_order'
  | 'profile'
  | 'requirements'
  | 'create_requirement'
  | 'quotations'
  | 'agreements'
  | 'orders'
  | 'deliveries'
  | 'invoices'
  | 'notifications'
  | 'support'
  | 'settings';

export const BuyerPortal: React.FC = () => {
  const { state, store } = useStore();
  const [activeNav, setActiveNav] = useState<BuyerNav>('dashboard');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [negotiationText, setNegotiationText] = useState('');
  const [isSubmitReqOpen, setIsSubmitReqOpen] = useState(false);
  const [directOrderModalProduct, setDirectOrderModalProduct] = useState<ProductListing | null>(null);
  const [directOrderQty, setDirectOrderQty] = useState<number>(1000);
  const [directOrderNotes, setDirectOrderNotes] = useState<string>('Standard B2B wholesale order for retail store distribution.');


  // Current buyer account
  const currentBuyer = state.buyers.find(b => b.email === state.currentUser.email) || state.buyers[0];

  const buyerReqs = state.requirements.filter(r => r.buyerId === currentBuyer.id);
  const buyerAgreements = state.agreements.filter(a => a.buyerId === currentBuyer.id);
  const buyerQuotations = state.quotations.filter(q => q.buyerId === currentBuyer.id);
  const buyerOrders = state.b2bOrders.filter(o => o.buyerId === currentBuyer.id);
  const buyerNotifs = state.notifications.filter(n => n.recipientRole === 'buyer' || n.recipientRole === 'all');

  // Requirement Form State
  const [newReq, setNewReq] = useState({
    productName: 'Desi Organic Tomatoes',
    category: 'Vegetables' as const,
    requiredQuantity: 1000,
    unit: 'kg' as const,
    frequency: 'Weekly' as const,
    expectedPriceRange: '₹38 - ₹44 / kg',
    qualityGrade: 'Grade A Premium' as const,
    organicRequirement: '100% Certified Organic' as const,
    packaging: 'Crates' as const,
    requiredDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryLocation: currentBuyer?.address || 'Bhiwandi Central DC, Mumbai',
    additionalInstructions: 'Delivery required before 07:00 AM in refrigerated transport.',
  });

  const handleSubmitReq = (e: React.FormEvent) => {
    e.preventDefault();
    const item: BuyerRequirementItem = {
      id: `req-item-${Date.now()}`,
      productName: newReq.productName,
      category: newReq.category,
      requiredQuantity: newReq.requiredQuantity,
      unit: newReq.unit,
      frequency: newReq.frequency,
      expectedPriceRange: newReq.expectedPriceRange,
      qualityGrade: newReq.qualityGrade,
      organicRequirement: newReq.organicRequirement,
      packaging: newReq.packaging,
      requiredDeliveryDate: newReq.requiredDeliveryDate,
      allocatedFarmerQuantity: 0,
      status: 'Pending',
    };

    store.addBuyerRequirement({
      buyerId: currentBuyer.id,
      buyerName: currentBuyer.businessName,
      deliveryLocation: newReq.deliveryLocation,
      items: [item],
      additionalInstructions: newReq.additionalInstructions,
      status: 'Submitted',
    });

    setIsSubmitReqOpen(false);
    setActiveNav('requirements');
  };

  const handleQuotationDecision = (quotationId: string, status: 'Accepted' | 'Rejected' | 'Negotiation') => {
    store.updateQuotationStatus(quotationId, status, negotiationText);
    setSelectedQuotation(null);
    setNegotiationText('');
  };

  const navItems = [
    { id: 'dashboard', label: 'Procurement Dashboard', icon: Building2 },
    { id: 'direct_order', label: 'Direct Order & Lock B2B', icon: Lock },
    { id: 'requirements', label: 'Product Requirements', icon: FileText, badge: buyerReqs.length },
    { id: 'quotations', label: 'Received Quotations', icon: FileCheck, badge: buyerQuotations.filter(q => q.status === 'Submitted').length },
    { id: 'agreements', label: 'Supply Agreements', icon: ScrollText, badge: buyerAgreements.length },
    { id: 'orders', label: 'Purchase Orders', icon: ShoppingCart, badge: buyerOrders.length },
    { id: 'deliveries', label: 'Track Deliveries', icon: Truck },
    { id: 'invoices', label: 'Invoices & Payments', icon: Receipt },
    { id: 'notifications', label: 'Procurement Alerts', icon: Bell, badge: buyerNotifs.filter(n => !n.isRead).length },
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Buyer Sidebar */}
      <aside className="w-full md:w-64 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
            Supermarket B2B
          </span>
          <h2 className="font-bold text-sm text-[#17231C] truncate">{currentBuyer.businessName}</h2>
          <p className="text-[11px] text-[#66736A] mt-0.5">{currentBuyer.procurementManager}</p>
        </div>

        <button
          onClick={() => setIsSubmitReqOpen(true)}
          className="w-full py-2.5 px-3 bg-[#176B45] hover:bg-[#104D35] text-white rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center justify-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Product Demand</span>
        </button>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id as BuyerNav)}
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

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Navigation Section 1: Dashboard Overview */}
        {activeNav === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
                    Procurement Dashboard
                  </h1>
                  <p className="text-xs text-[#66736A] mt-0.5">
                    Welcome back, <strong>{currentBuyer.procurementManager}</strong>. Monitor your contracted organic fresh produce supply.
                  </p>
                </div>
                <Badge variant="green">{currentBuyer.stage}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <MetricCard
                  title="Total Requirements"
                  value={buyerReqs.length}
                  subtitle="Active procurement requests"
                  icon={FileText}
                />
                <MetricCard
                  title="Active Agreements"
                  value={buyerAgreements.length}
                  subtitle="Committed annual contracts"
                  icon={ScrollText}
                />
                <MetricCard
                  title="Pending Quotations"
                  value={buyerQuotations.filter(q => q.status === 'Submitted').length}
                  subtitle="Awaiting your approval"
                  icon={FileCheck}
                  badge="Review"
                />
                <MetricCard
                  title="Total Procurement Value"
                  value={`₹${(currentBuyer.totalPurchaseValue / 1000).toFixed(0)}k`}
                  subtitle="YTD settled purchases"
                  icon={CreditCard}
                />
              </div>
            </div>

            {/* Quick Direct Order & Lock Action */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-900 flex items-center justify-center font-bold shrink-0">
                  <Lock className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#17231C]">Direct Sourcing & Retail Customer Lock</h4>
                  <p className="text-xs text-[#66736A]">Order harvest produce directly to lock out retail customer purchasing and secure exclusive supermarket supply.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNav('direct_order')}
                className="px-4 py-2 bg-[#104D35] hover:bg-[#176B45] text-white text-xs font-bold rounded-xl shadow shrink-0 flex items-center space-x-1.5"
              >
                <span>Browse & Lock Produce</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Sourcing Pipeline Status */}
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#17231C] font-display">
                Procurement & Supply Lifecycle
              </h3>
              <div className="p-4 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 text-xs text-[#17231C] leading-relaxed">
                <strong>Standard Pure Krishi Workflow:</strong> Requirement Submitted ➔ Production Capacity Matching ➔ Formal Quotation ➔ Supply Agreement ➔ Scheduled Weekly Deliveries with Cold Chain Traceability.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section: Direct Produce Order & Retail Customer Lock */}
        {activeNav === 'direct_order' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span>Direct Produce Order & Retail Customer Lock</span>
                </h2>
                <p className="text-xs text-[#66736A] mt-0.5">
                  Ordering any harvest produce will immediately <strong>lock this product from all retail customers</strong> across the entire consumer marketplace, reserving the batch exclusively for {currentBuyer.businessName}.
                </p>
              </div>
            </div>

            {/* Produce Grid with Lock & Order actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {state.products.map((prod) => {
                const isLocked = prod.isLockedForCustomers;
                const isLockedByUs = prod.lockedByBuyerName === currentBuyer.businessName;
                const wholesalePrice = Math.round(prod.price * 0.85);

                return (
                  <div
                    key={prod.id}
                    className={`rounded-2xl border p-4 space-y-3 flex flex-col justify-between transition-all ${
                      isLockedByUs
                        ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                        : isLocked
                        ? 'border-gray-200 bg-gray-50/50 opacity-80'
                        : 'border-[#176B45]/20 bg-white hover:border-[#176B45] shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          {isLocked ? (
                            <span className="bg-amber-500 text-stone-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1 border border-amber-300">
                              <Lock className="w-3 h-3" />
                              <span>{isLockedByUs ? 'Locked by You' : 'Locked for B2B'}</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                              <span>Available for Lock</span>
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-black/60 backdrop-blur-xs text-white font-bold text-[9px] px-2 py-0.5 rounded">
                            {prod.verificationBadge}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold">{prod.category}</span>
                        <h4 className="font-bold text-sm text-[#17231C] leading-snug">{prod.name}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">Grower: <strong>{prod.farmerName}</strong> ({prod.farmerLocation})</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Retail Consumer Price:</span>
                          <span className="line-through text-gray-400">₹{prod.price} / {prod.unit}</span>
                        </div>
                        <div className="flex justify-between font-bold text-[#104D35]">
                          <span>B2B Wholesale Price:</span>
                          <span>₹{wholesalePrice} / kg (-15%)</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-600 pt-1 border-t border-gray-200">
                          <span>Harvest Batch:</span>
                          <span className="font-mono text-[#176B45] font-bold">{prod.harvestBatchId}</span>
                        </div>
                      </div>

                      {isLocked && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                          <strong>Current B2B Allocation:</strong>
                          <p>{prod.lockedReason || `Reserved for ${prod.lockedByBuyerName}`}</p>
                          <span className="text-[10px] text-amber-700 block">Retail Customers Locked: Yes</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      {isLockedByUs ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Secured for Your Stores</span>
                          </span>
                          <button
                            onClick={() => store.unlockProductForCustomers(prod.id)}
                            className="px-2.5 py-1 text-[11px] text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                            title="Release this batch back to retail customers"
                          >
                            Release Lock
                          </button>
                        </div>
                      ) : isLocked ? (
                        <div className="w-full text-center py-1 text-xs text-gray-500 font-semibold bg-gray-100 rounded-xl">
                          Exclusively Reserved by Other Buyer
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDirectOrderModalProduct(prod);
                            setDirectOrderQty(1000);
                          }}
                          className="w-full py-2 bg-[#104D35] hover:bg-[#176B45] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-300" />
                          <span>Order & Lock from Customers</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Navigation Section 2: Requirements List */}
        {activeNav === 'requirements' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Submitted Product Requirements</h2>
                <p className="text-xs text-[#66736A]">All bulk sourcing requests submitted to Pure Krishi agronomists.</p>
              </div>
              <button
                onClick={() => setIsSubmitReqOpen(true)}
                className="px-3.5 py-1.5 bg-[#176B45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Demand</span>
              </button>
            </div>

            <div className="space-y-3">
              {buyerReqs.map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-[#176B45]">{req.id}</span>
                      <p className="text-gray-500">Destination: {req.deliveryLocation}</p>
                    </div>
                    <Badge variant={req.status === 'Farmer Matched' ? 'green' : 'amber'}>{req.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {req.items.map(item => (
                      <div key={item.id} className="p-2.5 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                        <div>
                          <strong className="text-gray-800">{item.productName}</strong>
                          <p className="text-[10px] text-gray-500">{item.qualityGrade} • {item.frequency}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#104D35]">{item.requiredQuantity} {item.unit}</span>
                          <p className="text-[10px] text-gray-400">Target: {item.expectedPriceRange}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Section 3: Quotations */}
        {activeNav === 'quotations' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">Received Quotations & Price Proposals</h2>
                <p className="text-xs text-[#66736A]">Compare prices, review available quantities, and accept or negotiate terms.</p>
              </div>
            </div>

            <div className="space-y-4">
              {buyerQuotations.map(quo => (
                <div key={quo.id} className="p-5 rounded-xl border border-gray-200 hover:border-[#176B45]/30 transition-all space-y-4 text-xs">
                  <div className="flex justify-between items-start pb-2 border-b border-gray-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#176B45]">{quo.quotationNumber}</span>
                        <Badge variant={quo.status === 'Accepted' ? 'green' : quo.status === 'Submitted' ? 'amber' : 'neutral'}>
                          {quo.status}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Valid until: {quo.validUntil}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#104D35]">₹{quo.totalQuotedAmount.toLocaleString()}</span>
                      <p className="text-[10px] text-gray-400">All taxes & cold-chain transit included</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-[#17231C]">Quoted Line Items:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {quo.items.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-[#FAF8F0] rounded-lg border border-[#176B45]/10 flex justify-between">
                          <div>
                            <strong>{item.productName}</strong>
                            <p className="text-[10px] text-gray-500">{item.qualityGrade} • {item.quantityKg} kg</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#104D35]">₹{item.unitPrice} / kg</span>
                            <p className="text-[10px] text-gray-500">₹{item.totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600 text-[11px]">
                    <strong>Commercial Terms:</strong> {quo.terms}
                  </div>

                  {quo.status === 'Submitted' && (
                    <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedQuotation(quo)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        Request Changes / Negotiate
                      </button>
                      <button
                        onClick={() => handleQuotationDecision(quo.id, 'Accepted')}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-lg shadow-sm"
                      >
                        Accept Quotation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Section 4: Supply Agreements */}
        {activeNav === 'agreements' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Binding Supermarket Supply Agreements</h2>
            <div className="space-y-3">
              {buyerAgreements.map(agr => (
                <div key={agr.id} className="p-4 rounded-xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-gray-400 text-[10px]">{agr.id}</span>
                      <h4 className="font-bold text-sm text-[#104D35] mt-0.5">{agr.productsSummary}</h4>
                    </div>
                    <Badge variant="green">{agr.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-600 text-[11px] pt-1">
                    <div>Monthly Commitment: <strong>{agr.agreedQuantityMonthly} {agr.unit}</strong></div>
                    <div>Cadence: <strong>{agr.deliveryFrequency}</strong></div>
                    <div>Quality Clause: <strong>{agr.qualityStandard}</strong></div>
                    <div>Payment Terms: <strong>{agr.paymentTerms}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Section 5: Orders & Deliveries */}
        {(activeNav === 'orders' || activeNav === 'deliveries') && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Purchase Orders & Reefer Deliveries</h2>
            <div className="space-y-3">
              {buyerOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                      <h4 className="font-bold text-sm text-[#17231C]">Delivery Date: {order.deliveryDate}</h4>
                      <p className="text-gray-500 text-[11px]">Drop Location: {order.deliveryAddress}</p>
                    </div>
                    <Badge variant={order.status === 'Dispatched' ? 'blue' : order.status === 'Delivered' ? 'green' : 'amber'}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-[11px]">
                    <span>Carrier: <strong>{order.deliveryPartnerName || 'Fleet Assigned'}</strong></span>
                    <span className="text-sm font-extrabold text-[#104D35]">Total: ₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Section 6: Invoices */}
        {activeNav === 'invoices' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Invoices & Payment Records</h2>
            <div className="space-y-3">
              {buyerOrders.map(order => (
                <div key={order.id} className="p-3.5 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#176B45]">INV-{order.id.slice(3)}</span>
                    <p className="text-gray-500">Order Ref: {order.id} • Date: {order.orderDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#17231C]">₹{order.totalAmount.toLocaleString()}</span>
                    <p className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Section 7: Business Profile */}
        {activeNav === 'profile' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Supermarket Business Profile</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Business Entity</span>
                <strong className="text-sm text-[#17231C]">{currentBuyer.businessName}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Buyer Classification</span>
                <strong className="text-sm text-[#104D35]">{currentBuyer.buyerType}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Procurement Officer</span>
                <strong className="text-sm text-[#17231C]">{currentBuyer.procurementManager}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">GST Registered</span>
                <strong className="text-sm text-gray-700 font-mono">{currentBuyer.gstNumber}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section 8: Settings */}
        {activeNav === 'settings' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Account Settings</h2>
            <p className="text-xs text-gray-600">Preferred Communication: <strong>{currentBuyer.preferredCommunication}</strong></p>
            <p className="text-xs text-gray-600">Registered Delivery Hub: <strong>{currentBuyer.address}</strong></p>
          </div>
        )}

        {/* Navigation Section 9: Notifications */}
        {activeNav === 'notifications' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#17231C]">Procurement Notifications</h2>
            {buyerNotifs.map(n => (
              <div key={n.id} className="p-3 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 text-xs">
                <span className="font-bold text-[#17231C] block">{n.title}</span>
                <p className="text-gray-600 mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Negotiation Modal */}
      {selectedQuotation && (
        <Modal
          isOpen={Boolean(selectedQuotation)}
          onClose={() => setSelectedQuotation(null)}
          title={`Negotiate Quotation: ${selectedQuotation.quotationNumber}`}
          subtitle={`Proposed Total: ₹${selectedQuotation.totalQuotedAmount.toLocaleString()}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17231C] mb-1">
                Enter Negotiation Notes or Counter-Offer:
              </label>
              <textarea
                rows={3}
                required
                value={negotiationText}
                onChange={(e) => setNegotiationText(e.target.value)}
                placeholder="e.g. Requesting ₹39/kg for Tomatoes on condition of bi-weekly 2,000 kg order."
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedQuotation(null)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleQuotationDecision(selectedQuotation.id, 'Negotiation')}
                className="px-4 py-1.5 bg-[#176B45] text-white font-bold rounded-lg shadow-sm"
              >
                Submit Counter-Offer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submit Sourcing Requirement Modal */}
      <Modal
        isOpen={isSubmitReqOpen}
        onClose={() => setIsSubmitReqOpen(false)}
        title="Submit New Supermarket Sourcing Demand"
        subtitle="Pure Krishi will match certified organic farmers to guarantee this supply."
      >
        <form onSubmit={handleSubmitReq} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={newReq.productName}
                onChange={(e) => setNewReq({ ...newReq, productName: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Category</label>
              <select
                value={newReq.category}
                onChange={(e) => setNewReq({ ...newReq, category: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Pulses">Pulses</option>
                <option value="Spices">Spices</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Quantity (kg) *</label>
              <input
                type="number"
                required
                value={newReq.requiredQuantity}
                onChange={(e) => setNewReq({ ...newReq, requiredQuantity: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Frequency</label>
              <select
                value={newReq.frequency}
                onChange={(e) => setNewReq({ ...newReq, frequency: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Target Delivery Date</label>
              <input
                type="date"
                required
                value={newReq.requiredDeliveryDate}
                onChange={(e) => setNewReq({ ...newReq, requiredDeliveryDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Quality Grade</label>
              <select
                value={newReq.qualityGrade}
                onChange={(e) => setNewReq({ ...newReq, qualityGrade: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Grade A Premium">Grade A Premium</option>
                <option value="Grade A">Grade A</option>
                <option value="Export Quality">Export Quality</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Organic Verification</label>
              <select
                value={newReq.organicRequirement}
                onChange={(e) => setNewReq({ ...newReq, organicRequirement: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="100% Certified Organic">100% Certified Organic</option>
                <option value="Naturally Grown / Zero Chemical">Naturally Grown / Zero Chemical</option>
                <option value="Pesticide Free">Pesticide Free</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17231C] mb-1">Special Packaging Instructions</label>
            <input
              type="text"
              value={newReq.additionalInstructions}
              onChange={(e) => setNewReq({ ...newReq, additionalInstructions: e.target.value })}
              className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsSubmitReqOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
            >
              Submit Sourcing Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Direct Order & Customer Lock Confirmation Modal */}
      {directOrderModalProduct && (
        <Modal
          isOpen={Boolean(directOrderModalProduct)}
          onClose={() => setDirectOrderModalProduct(null)}
          title={`Order & Lock Produce: ${directOrderModalProduct.name}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.lockProductForB2B(
                directOrderModalProduct.id,
                currentBuyer.businessName,
                currentBuyer.id,
                directOrderQty,
                `Supermarket Direct Order (${directOrderQty} kg) - ${directOrderNotes}`
              );
              setDirectOrderModalProduct(null);
              setActiveNav('orders');
            }}
            className="space-y-4 text-xs"
          >
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-amber-950">
              <div className="flex items-center space-x-1.5 font-bold">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>B2B Exclusive Customer Lock Guarantee</span>
              </div>
              <p className="text-xs text-amber-800">
                Confirming this order immediately reserves <strong>{directOrderQty} kg</strong> for {currentBuyer.businessName} and permanently sets this produce to <strong>"Locked for B2B"</strong> for all retail customers in the marketplace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Wholesale Quantity (kg):</label>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  value={directOrderQty}
                  onChange={(e) => setDirectOrderQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Wholesale Agreed Unit Price:</label>
                <input
                  type="text"
                  disabled
                  value={`₹${Math.round(directOrderModalProduct.price * 0.85)} / kg`}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-[#104D35]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 flex justify-between items-center font-bold">
              <span>Estimated Purchase Order Value:</span>
              <span className="text-base text-[#104D35]">
                ₹{(directOrderQty * Math.round(directOrderModalProduct.price * 0.85)).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Order Notes / Receiving Bay Instructions:</label>
              <textarea
                rows={2}
                value={directOrderNotes}
                onChange={(e) => setDirectOrderNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDirectOrderModalProduct(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold shadow-sm flex items-center space-x-1.5"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Confirm Purchase Order & Lock for B2B</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

